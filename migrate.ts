import { db } from "./db";

console.log("Running migration to create table counter");
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS counter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    namespace TEXT NOT NULL,
    key TEXT NOT NULL,
    value INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(namespace, key)
  );
`;

const createTriggerQuery = `
  CREATE TRIGGER IF NOT EXISTS update_counter_updated_at
  AFTER UPDATE ON counter
  FOR EACH ROW
  BEGIN
    UPDATE counter SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
  END;
`;

db.run(createTableQuery)
console.log("Create table counter successfully");

db.run(createTriggerQuery);
console.log("Create trigger to update updated_at successfully");