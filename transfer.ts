import { hash } from "https://esm.sh/starknet@6.16.0";
import type { Config } from "npm:@apibara/indexer";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";

import { getStrkAddress } from "./constants.ts";
import { standariseAddress, toBigInt } from "./utils.ts";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),
  finality: "DATA_STATUS_ACCEPTED",
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [
      {
        fromAddress: getStrkAddress() as FieldElement,
        includeTransaction: true,
        keys: [hash.getSelectorFromName("Transfer") as FieldElement],
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "strk_transfers",
    noTls: true, // true for private urls, false for public urls
  },
};

export default function transform({ header, events }: Block) {
  if (!events || !header) return [];

  const { blockNumber, timestamp } = header;
  const timestamp_unix = Math.floor(
    new Date(timestamp as string).getTime() / 1000
  );

  return events
    .map(({ event, transaction }, idx) => {
      if (!event || !event.data || !event.keys || !transaction?.meta)
        return null;

      const from = event.data[0];
      const to = event.data[1];
      const value = toBigInt(event.data[2]).toString();

      return {
        block_number: Number(blockNumber),
        tx_index: Number(transaction.meta.transactionIndex ?? 0),
        event_index: Number(event.index ?? 0),
        tx_hash: String(transaction.meta.hash),
        timestamp: Number(Math.floor(timestamp_unix)),
        from: String(standariseAddress(from)),
        to: String(standariseAddress(to)),
        value: String(value),
        cursor: null,
      };
    })
    .filter((x) => x != null);
}
