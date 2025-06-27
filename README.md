# STRK Transfer Indexer (Prisma Version)

## Setup

1. Edit `.env` with your settings and STRK contract address.
2. Install dependencies:
   ```bash
   pnpm install
   # or npm install
   ```
3. Run Prisma migration and generate client:
   ```bash
   pnpm prisma:migrate
   pnpm prisma:generate
   # or npm run prisma:migrate && npm run prisma:generate
   ```
4. Run the indexer:
   ```bash
   apibara run transfer.ts --allow-env=.env --sink-id strk-transfer
   ```

## Notes
- All STRK transfer events are stored in the `StrkTransfer` table via Prisma.
- You can use Prisma Studio to inspect data:
  ```bash
  pnpm prisma:studio
  ```
