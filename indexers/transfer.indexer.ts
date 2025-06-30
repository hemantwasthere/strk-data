import {
  drizzle,
  drizzleStorage,
  useDrizzleStorage,
} from "@apibara/plugin-drizzle";
import { type Filter, StarknetStream } from "@apibara/starknet";
import { defineIndexer } from "apibara/indexer";
import { useLogger } from "apibara/plugins";
import { hash } from "starknet";

import { strk_transfers } from "../lib/schema.js";
import { toBigInt } from "../lib/utils.js";

const db = drizzle({
  schema: {
    strk_transfers,
  },
  connectionString: "postgresql://admin:admin@localhost:5430/strk-transfers",
});

export default defineIndexer(StarknetStream)({
  streamUrl: "https://mainnet.starknet.a5a.ch",
  startingBlock: 505964n,
  finality: "accepted",
  filter: {
    events: [
      {
        address:
          "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        includeTransaction: true,
        keys: [hash.getSelectorFromName("Transfer") as `0x${string}`],
      },
    ],
    header: "always",
  } satisfies Filter,
  plugins: [
    drizzleStorage({
      db,
      idColumn: "id",
      persistState: true,
      indexerName: "transfer.indexer",
    }),
  ],

  async transform({ endCursor, block, context, finality }) {
    const { db } = useDrizzleStorage();

    const logger = useLogger();

    const { header, events } = block;

    if (!header.blockNumber) {
      return;
    }

    logger.info(
      "Transforming block | orderKey: ",
      endCursor?.orderKey,
      " | finality: ",
      finality
    );

    const { timestamp } = block.header;

    const timestampUnix = Math.floor(new Date(timestamp).getTime() / 1000);

    for (const event of events) {
      const from = event.data[0].toString();
      const to = event.data[1].toString();
      const value = toBigInt(event.data[2]).toString();

      const record = {
        block_number: Number(block.header.blockNumber),
        tx_index: Number(event.transactionIndex),
        event_index: Number(event.eventIndex),
        tx_hash: String(event.transactionHash),
        timestamp: Number(Math.floor(timestampUnix)),
        from,
        to,
        value,
        cursor: null,
      };

      await db.insert(strk_transfers).values(record);
    }
  },
});
