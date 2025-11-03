import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import VoiceChat from '../VoiceChat';

global.fetch = jest.fn();

describe('VoiceChat Component (LLM + Voice Interface)', () => {
  const mockSetStatus = jest.fn();
  const mockBuyTicket = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock speech APIs to prevent real browser calls
    window.SpeechRecognition = jest.fn().mockImplementation(() => ({
      start: jest.fn(),
      stop: jest.fn(),
      abort: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    window.__voiceRecognition = null;
    window.speechSynthesis = { speak: jest.fn(), cancel: jest.fn(), getVoices: () => [] };
    global.SpeechSynthesisUtterance = jest.fn().mockImplementation(function MockUtterance(text) {
      this.text = text;
    });
  });

  afterEach(() => {
    delete global.SpeechSynthesisUtterance;
  });

  test('renders initial interface with Record button', () => {
    render(<VoiceChat buyTicket={mockBuyTicket} setStatusMessage={mockSetStatus} />);
    expect(screen.getByRole('button', { name: /record/i })).toBeVisible();
    expect(screen.getByText('Press record and start speaking...')).toBeVisible();
  });

  test('handles recognition result and displays confirmation', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { event_id: 1, event: 'Jazz Night', tickets: 2 },
      }),
    });
    render(<VoiceChat buyTicket={mockBuyTicket} setStatusMessage={mockSetStatus} />);
    fireEvent.click(screen.getByRole('button', { name: /record/i }));
    act(() => {
      window.__voiceRecognition.onresult({
        results: [[{ transcript: 'Book two tickets to Jazz Night' }]],
      });
    });
    fireEvent.click(screen.getByRole('button', { name: /stop/i }));
    expect(
      await screen.findByText('Confirm booking for 2 tickets to Jazz Night?')
    ).toBeVisible();
  });

  test('allows user to confirm booking', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { event_id: 1, event: 'Jazz Night', tickets: 2 },
      }),
    });
    render(<VoiceChat buyTicket={mockBuyTicket} setStatusMessage={mockSetStatus} />);
    fireEvent.click(screen.getByRole('button', { name: /record/i }));
    act(() => {
      window.__voiceRecognition.onresult({
        results: [[{ transcript: 'Book two tickets to Jazz Night' }]],
      });
    });
    fireEvent.click(screen.getByRole('button', { name: /stop/i }));
    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mockSetStatus).toHaveBeenLastCalledWith('2 tickets purchased for: Jazz Night');
    });
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /confirm/i })).not.toBeInTheDocument();
    });
  });

  test('handles server or network errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const statusContainer = document.createElement('div');
    document.body.appendChild(statusContainer);
    mockSetStatus.mockImplementation((message) => {
      statusContainer.textContent = message;
    });
    render(<VoiceChat buyTicket={mockBuyTicket} setStatusMessage={mockSetStatus} />);
    fireEvent.click(screen.getByRole('button', { name: /record/i }));
    act(() => {
      window.__voiceRecognition.onresult({
        results: [[{ transcript: 'Book two tickets to Jazz Night' }]],
      });
    });
    fireEvent.click(screen.getByRole('button', { name: /stop/i }));
    await waitFor(() => {
      expect(screen.getByText('Server error. Please try again.')).toBeVisible();
    });
    statusContainer.remove();
  });

  test('speech synthesis triggers correctly when responding', async () => {
    const MockUtterance = jest.fn(function MockUtterance(text) {
      this.text = text;
    });
    global.SpeechSynthesisUtterance = MockUtterance;

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { event_id: 1, event: 'Jazz Night', tickets: 2 },
      }),
    });

    render(<VoiceChat buyTicket={mockBuyTicket} setStatusMessage={mockSetStatus} />);

    fireEvent.click(screen.getByRole('button', { name: /record/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /stop/i })).toBeVisible();
    });

    act(() => {
      window.__voiceRecognition.onresult({
        results: [[{ transcript: 'Book two tickets to Jazz Night' }]],
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /stop/i }));

    await waitFor(() => {
      expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    });
    expect(MockUtterance).toHaveBeenCalledWith('Confirm booking for 2 tickets to Jazz Night?');
  });

});
