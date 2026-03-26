import { integer, pgTable, varchar, text, boolean, date } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { user } from "./auth-schema.ts";

export const collectionTable = pgTable("collections", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  type: varchar({ length: 255 }).notNull(),
  content: integer().array().notNull(),
  ownerId: varchar({ length: 255 }).notNull(),
  success: integer().array(),
  tries: integer().array(),
  currentPuzzle: integer(),
  currentLoop: integer()
  
});

export const puzzleTable = pgTable("puzzles", {
  PuzzleId: integer().primaryKey().generatedAlwaysAsIdentity(),
  FEN: varchar({ length: 100 }).notNull(),
  Rating: integer().notNull(),
  Themes:  text(),
  Moves:  text(),
});

export const collectionRelations = relations(collectionTable, ({ one }) => ({
	owner: one(user, {
		fields: [collectionTable.ownerId],
		references: [user.id],
	}),
}));