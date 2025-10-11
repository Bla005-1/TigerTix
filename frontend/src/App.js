import React, { useEffect, useState } from 'react';
import './App.css'; 
  
function App() { 
  const [events, setEvents] = useState([]);
 
  const fetchEvents = () => {
    fetch('http://localhost:6001/api/events') 
      .then((res) => res.json()) 
      .then((data) => setEvents(data)) 
      .catch((err) => {
        console.error(err);
        alert('Event loading failed.')
      }); 
  }; 
  useEffect(() => { fetchEvents(); }, []);
 
  const buyTicket = (eventID, eventName) => { 
    fetch(`http://localhost:6001/api/events/${eventID}/purchase`, { method: 'POST' })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (res.ok) {
          alert(`Ticket purchased for: ${eventName}`);
          fetchEvents();
        } else {
          const msg = body?.error || 'Purchase failed.';
          alert(msg);
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Server error. Please try again.');
      });
  }; 
 
  return ( 
    <div className="App"> 
      <h1>Clemson Campus Events</h1> 
      <ul> 
        {events.map((event) => ( 
          <li key={event.id}> 
            {event.name} - {event.date} - {event.tickets_available}{' '} 
            <button onClick={() => buyTicket(event.id, event.name)}>Buy Ticket</button> 
          </li> 
        ))} 
      </ul> 
    </div> 
  ); 
} 
 
export default App; 
