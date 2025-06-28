-- CreateTable
CREATE TABLE "strk_transfers" (
    "id" BIGSERIAL NOT NULL,
    "block_number" BIGINT NOT NULL,
    "tx_index" INTEGER NOT NULL,
    "event_index" INTEGER NOT NULL,
    "tx_hash" VARCHAR(66) NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "from" VARCHAR(66) NOT NULL,
    "to" VARCHAR(66) NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "_cursor" BIGINT,

    CONSTRAINT "strk_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "strk_transfers_block_number_idx" ON "strk_transfers"("block_number");

-- CreateIndex
CREATE INDEX "strk_transfers_from_idx" ON "strk_transfers"("from");

-- CreateIndex
CREATE INDEX "strk_transfers_to_idx" ON "strk_transfers"("to");

-- CreateIndex
CREATE INDEX "strk_transfers_timestamp_idx" ON "strk_transfers"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "strk_transfers_tx_hash_event_index_key" ON "strk_transfers"("tx_hash", "event_index");
