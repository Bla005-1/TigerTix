import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { withMockAuth } from './mockAuth';

describe('Accessibility Compliance', () => {
  test('each Buy Ticket button has descriptive aria-label', async () => {
    const mockEvents = [
      { id: 1, name: 'Spring Concert', date: '2024-04-20', tickets_available: 50 },
      { id: 2, name: 'Art Expo', date: '2024-05-05', tickets_available: 10 },
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })
    );
    render(withMockAuth(<App />));
    const buttons = await screen.findAllByRole('button', { name: /buy ticket/i });
    expect(buttons).toHaveLength(mockEvents.length);
    buttons.forEach((button, idx) => {
      const ariaLabel = button.getAttribute('aria-label') || '';
      expect(ariaLabel.toLowerCase()).toContain(mockEvents[idx].name.toLowerCase());
    });
  });

  test('all interactive elements reachable via keyboard', async () => {
    const mockEvents = [
      { id: 1, name: 'Spring Concert', date: '2024-04-20', tickets_available: 50 },
      { id: 2, name: 'Art Expo', date: '2024-05-05', tickets_available: 10 },
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })
    );
    const user = userEvent;
    render(withMockAuth(<App />));

    const logoutButton = await screen.findByRole('button', { name: /logout/i });
    const recordButton = await screen.findByRole('button', { name: /record/i });
    const buyButtons = await screen.findAllByRole('button', { name: /buy ticket/i });

    await user.tab();
    expect(logoutButton).toHaveFocus();

    await user.tab();
    expect(recordButton).toHaveFocus();

    for (const button of buyButtons) {
      await user.tab();
      expect(button).toHaveFocus();
    }

    await user.tab();
    expect(document.body).toHaveFocus();
  });

});
