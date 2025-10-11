// mock data until db is together
const getEvents = () => { 
  return [ 
    { id: 1, name: 'Clemson Football Game', date: '2025-09-01', tickets_available: 1 }, 
    { id: 2, name: 'Campus Concert', date: '2025-09-10', tickets_available: 1 }, 
    { id: 3, name: 'Career Fair', date: '2025-09-15', tickets_available: 1 } 
  ]; 
}; 

const purchaseOneTicket = (id) => {
  if (id == 1) { return id };  // for testing until db is alive
  return 'NOT_FOUND';
}; 

module.exports = { getEvents, purchaseOneTicket }; 
