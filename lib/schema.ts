import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const strk_transfers = pgTable("strk_transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  block_number: integer("block_number").unique().notNull(),
  tx_index: integer("tx_index").notNull(),
  event_index: integer("event_index").notNull(),
  tx_hash: varchar("tx_hash", { length: 66 }).notNull(),
  timestamp: integer("timestamp").notNull(),
  from: varchar("from", { length: 66 }).notNull(),
  to: varchar("to", { length: 66 }).notNull(),
  value: text("value").notNull(),
  cursor: text("_cursor"),
});
