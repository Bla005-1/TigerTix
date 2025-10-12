CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    tickets_available INTEGER NOT NULL,
    UNIQUE (name, date)
);

-- seed data for testing
INSERT OR IGNORE INTO events (name, date, tickets_available) VALUES ('Football Game', '2025-09-01', 10);
INSERT OR IGNORE INTO events (name, date, tickets_available) VALUES ('Career Fair', '2025-09-05', 5);
INSERT OR IGNORE INTO events (name, date, tickets_available) VALUES ('Baseball Game', '2025-09-09', 1);
