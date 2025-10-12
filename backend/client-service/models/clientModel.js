const { all, get, run } = require('../../shared-db/setup')

const getEvents = async () => {
  const rows = await all('SELECT id, name, date, tickets_available FROM events ORDER BY date ASC;');
  return Array.isArray(rows) ? rows : [];
};

const purchaseOneTicket = async (id) => {
  const result = await run(
    'UPDATE events SET tickets_available = tickets_available - 1 WHERE id = ? AND tickets_available > 0;',
    [id]
  );

  if (result.changes === 1) return id;

  const row = await get('SELECT tickets_available FROM events WHERE id = ?;', [
    id,
  ]);
  if (!row) return 'NOT_FOUND';
  return 'SOLD_OUT';
};

module.exports = { getEvents, purchaseOneTicket }; 
