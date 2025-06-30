CREATE TABLE "strk_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_number" integer NOT NULL,
	"tx_index" integer NOT NULL,
	"event_index" integer NOT NULL,
	"tx_hash" varchar(66) NOT NULL,
	"timestamp" integer NOT NULL,
	"from" varchar(66) NOT NULL,
	"to" varchar(66) NOT NULL,
	"value" text NOT NULL,
	"_cursor" text,
	CONSTRAINT "strk_transfers_block_number_unique" UNIQUE("block_number")
);
