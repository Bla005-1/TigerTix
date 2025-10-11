import React, { useEffect, useState } from 'react';
import './App.css'; 
  
function App() { 
  const [events, setEvents] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
 
  const fetchEvents = () => {
    fetch('http://localhost:6001/api/events') 
      .then((res) => res.json()) 
      .then((data) => setEvents(data)) 
      .catch((err) => {
        console.error(err);
        setStatusMessage('Event loading failed.')
      }); 
  }; 
  useEffect(() => { fetchEvents(); }, []);
 
  const buyTicket = (eventID, eventName) => { 
    fetch(`http://localhost:6001/api/events/${eventID}/purchase`, { method: 'POST' })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (res.ok) {
          setStatusMessage(`Ticket purchased for: ${eventName}`);
          fetchEvents();
        } else {
          const msg = body?.error || 'Purchase failed.';
          setStatusMessage(msg);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatusMessage('Server error. Please try again.');
      });
  }; 
 
  return ( 
    <div className="App"> 
      <header>
        <h1 id="page-title">Clemson Campus Events</h1>
      </header>

      <div aria-live="polite" className="status">
        {statusMessage}
      </div>

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
