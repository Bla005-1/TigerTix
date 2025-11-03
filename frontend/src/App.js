import React, { useEffect, useState } from 'react';
import './App.css';
import VoiceChat from './VoiceChat';

function App() { 
  const [events, setEvents] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
 
  // Fetches all events from the client microservice and updates state.
  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:6001/api/events');
      if (!res.ok) {
        throw new Error(`Failed to load events: ${res.status}`);
      }
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setEvents([]);
      console.error(err);
      setStatusMessage('Event loading failed.');
    }
  }; 
  useEffect(() => { fetchEvents(); }, []);
 
  // Sends a POST request to purchase a ticket for a given event.
  const buyTicket = async (eventID, eventName, updateStatus=true) => { 
    try {
      const res = await fetch(`http://localhost:6001/api/events/${eventID}/purchase`, { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        if (updateStatus) setStatusMessage(`Ticket purchased for: ${eventName}`);
        await fetchEvents();
      } else {
        const msg = body?.error || 'Purchase failed.';
        setStatusMessage(msg);
        if (res.status === 409) {
          setEvents((prev) =>
            prev.map((event) =>
              event.id === eventID ? { ...event, tickets_available: 0 } : event
            )
          );
        }
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Server error. Please try again.');
    }
  }; 
 
  return ( 
    <div className="App"> 
      <header aria-labelledby="page-title">
        <h1 id="page-title">Clemson Campus Events</h1>
      </header>

      {statusMessage && (<div aria-live="polite" className="status">
        {statusMessage}
      </div>)}
      <VoiceChat 
        buyTicket={buyTicket} 
        setStatusMessage={setStatusMessage}
      />
      <main role="main">
        <ul aria-labelledby="page-title">
          {events.map((event) => {
            const soldOut = Number(event.tickets_available) <= 0;
            return (
              <li key={event.id} className="event-item">
                <div className="event-row" role="group" aria-label={`Event ${event.name}`}>
                  <span className="col-name" title={event.name}>
                    {event.name}
                  </span>

                  <time className="col-date" dateTime={event.date}>
                    {event.date}
                  </time>

                  <span
                    className="col-tickets"
                    aria-label={`${event.tickets_available} ${event.tickets_available === 1 ? 'ticket' : 'tickets'} available`}
                  >
                    {event.tickets_available} {event.tickets_available === 1 ? 'ticket' : 'tickets'}
                  </span>

                  <button
                    className="col-action"
                    onClick={() => buyTicket(event.id, event.name)}
                    aria-label={`Buy ticket for ${event.name}`}
                    disabled={soldOut}
                    aria-disabled={soldOut}
                  >
                    {soldOut ? 'Sold Out' : 'Buy Ticket'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
 
export default App; 
