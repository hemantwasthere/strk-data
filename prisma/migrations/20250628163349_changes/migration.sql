/*
  Warnings:

  - The primary key for the `strk_transfers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `strk_transfers` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `strk_transfers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `strk_transfers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[block_number]` on the table `strk_transfers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "strk_transfers_block_number_idx";

-- DropIndex
DROP INDEX "strk_transfers_from_idx";

-- DropIndex
DROP INDEX "strk_transfers_timestamp_idx";

-- DropIndex
DROP INDEX "strk_transfers_to_idx";

-- DropIndex
DROP INDEX "strk_transfers_tx_hash_event_index_key";

-- AlterTable
ALTER TABLE "strk_transfers" DROP CONSTRAINT "strk_transfers_pkey",
DROP COLUMN "created_at",
DROP COLUMN "id",
DROP COLUMN "updated_at";

-- CreateIndex
CREATE UNIQUE INDEX "strk_transfers_block_number_key" ON "strk_transfers"("block_number");
