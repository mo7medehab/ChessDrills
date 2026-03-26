CREATE TABLE "puzzles" (
	"PuzzleId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzles_PuzzleId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"FEN" varchar(100) NOT NULL,
	"Rating" integer NOT NULL,
	"Themes" text[],
	"Moves" text[]
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"elo" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
