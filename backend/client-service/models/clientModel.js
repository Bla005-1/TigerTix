// mock data until db is together
const getEvents = () => { 
  return [ 
    { id: 1, name: 'Clemson Football Game', date: '2025-09-01' }, 
    { id: 2, name: 'Campus Concert', date: '2025-09-10' }, 
    { id: 3, name: 'Career Fair', date: '2025-09-15' } 
  ]; 
}; 

const purchaseOneTicket = () => { 
  return 'NOT_FOUND';
}; 

module.exports = { getEvents, purchaseOneTicket }; 
