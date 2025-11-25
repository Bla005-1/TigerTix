import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import App from '../App';
import { withMockAuth } from './mockAuth';

// Mock global fetch for API calls
global.fetch = jest.fn();

describe('App Component (Client Service Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  test('renders header and page title', () => {
    render(withMockAuth(<App />));
    const heading = screen.getByRole('heading', { level: 1, name: /Clemson Campus Events/i });
    expect(heading).toBeInTheDocument();
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('aria-labelledby', 'page-title');
    expect(banner).toContainElement(heading);
  });

  test('loads events successfully from API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        { id: '1', name: 'Tiger Rally', date: '2024-09-01', tickets_available: 15 },
        { id: '2', name: 'Homecoming Parade', date: '2024-10-15', tickets_available: 40 },
        { id: '3', name: 'Alumni Meetup', date: '2024-11-05', tickets_available: 0 },
      ]),
    });
    render(withMockAuth(<App />));
    await waitFor(() => {
      expect(screen.getByText(/Tiger Rally/i)).toBeInTheDocument();
      expect(screen.getByText(/Homecoming Parade/i)).toBeInTheDocument();
      expect(screen.getByText(/Alumni Meetup/i)).toBeInTheDocument();
    });
    const expectedEvents = [
      { name: 'Tiger Rally', tickets: '15 tickets' },
      { name: 'Homecoming Parade', tickets: '40 tickets' },
      { name: 'Alumni Meetup', tickets: '0 tickets' },
    ];
    expectedEvents.forEach(({ name, tickets }) => {
      const row = screen.getByRole('group', { name: `Event ${name}` });
      expect(within(row).getByText(name)).toBeInTheDocument();
      expect(within(row).getByText(tickets)).toBeInTheDocument();
    });
  });

  test('shows fallback message when event fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    render(withMockAuth(<App />));
    const liveRegion = await screen.findByText('Event loading failed.');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');

    fireEvent.click(screen.getByRole('button', { name: /start recording/i }));

    await waitFor(() => {
      expect(liveRegion).toHaveTextContent('SpeechRecognition not supported in this browser');
    });
  });

  test('handles ticket purchase success', async () => {
    const initialEvents = [
      { id: '1', name: 'Tiger Rally', date: '2024-09-01', tickets_available: 2 },
      { id: '2', name: 'Homecoming Parade', date: '2024-10-15', tickets_available: 10 },
    ];
    const updatedEvents = [
      { id: '1', name: 'Tiger Rally', date: '2024-09-01', tickets_available: 1 },
      { id: '2', name: 'Homecoming Parade', date: '2024-10-15', tickets_available: 10 },
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => initialEvents,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => updatedEvents,
      });

    render(withMockAuth(<App />));

    const buyButton = await screen.findByRole('button', { name: /buy ticket for tiger rally/i });
    fireEvent.click(buyButton);

    await waitFor(() => {
      expect(screen.getByText('Ticket purchased for: Tiger Rally')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('1 ticket')).toBeInTheDocument();
    });

    expect(global.fetch.mock.calls[0][0]).toEqual(expect.stringContaining('/api/events'));
    expect(global.fetch.mock.calls[1][0]).toEqual(expect.stringContaining('/api/events/1/purchase'));
    expect(global.fetch.mock.calls[2][0]).toEqual(expect.stringContaining('/api/events'));

  });

  test('handles ticket purchase failure', async () => {
    const initialEvents = [
      { id: '1', name: 'Tiger Rally', date: '2024-09-01', tickets_available: 1 },
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => initialEvents,
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ error: 'No tickets available' }),
      });
    render(withMockAuth(<App />));

    const buyButton = await screen.findByRole('button', { name: /buy ticket for tiger rally/i });
    fireEvent.click(buyButton);

    await waitFor(() => {
      expect(screen.getByText('No tickets available')).toBeInTheDocument();
    });

    await waitFor(() => {
      const soldOutButton = screen.getByRole('button', { name: /buy ticket for tiger rally/i });
      expect(soldOutButton).toBeDisabled();
      expect(soldOutButton).toHaveTextContent(/sold out/i);
      expect(soldOutButton).toHaveAttribute('aria-disabled', 'true');
    });
  });

  test('renders accessible ARIA attributes for each event', async () => {
    const events = [
      { id: '1', name: 'Tiger Rally', date: '2024-09-01', tickets_available: 5 },
      { id: '2', name: 'Homecoming Parade', date: '2024-10-15', tickets_available: 12 },
      { id: '3', name: 'Alumni Meetup', date: '2024-11-05', tickets_available: 0 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => events,
    });

    render(withMockAuth(<App />));

    const labelledRows = await screen.findAllByRole('group', { name: /Event/i });
    expect(labelledRows).toHaveLength(events.length);

    events.forEach(({ name, tickets_available }) => {
      const row = screen.getByRole('group', { name: `Event ${name}` });
      expect(row).toHaveAttribute('aria-label', `Event ${name}`);

      const buyButton = within(row).getByRole('button', { name: `Buy ticket for ${name}` });
      expect(buyButton).toHaveAttribute('aria-label', `Buy ticket for ${name}`);
      if (tickets_available === 0) {
        expect(buyButton).toHaveAttribute('aria-disabled', 'true');
      }
    });
  });

  test('disables button after purchase to prevent duplicate requests', async () => {
    const initialEvents = [
      { id: '1', name: 'Tiger Rally', date: '2024-09-01', tickets_available: 1 },
    ];
    const soldOutEvents = [
      { id: '1', name: 'Tiger Rally', date: '2024-09-01', tickets_available: 0 },
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => initialEvents,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => soldOutEvents,
      });

    render(withMockAuth(<App />));

    const buyButton = await screen.findByRole('button', { name: /buy ticket for tiger rally/i });
    expect(buyButton).toBeEnabled();

    fireEvent.click(buyButton);

    await screen.findByText('Ticket purchased for: Tiger Rally');
    const soldOutButton = await screen.findByRole('button', { name: /buy ticket for tiger rally/i });

    await waitFor(() => {
      expect(soldOutButton).toBeDisabled();
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
    expect(soldOutButton).toHaveTextContent(/sold out/i);

    fireEvent.click(soldOutButton);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
