import { hash } from 'https://esm.sh/starknet@6.16.0';
import type { Block, FieldElement, Starknet } from 'npm:@apibara/indexer@0.4.1/starknet';

import { getStrkAddress } from './constants.ts';
import prisma from './prisma/client.ts';
import { standariseAddress, toBigInt } from './utils.ts';

export const config = {
  streamUrl: Deno.env.get('STREAM_URL'),
  startingBlock: Number(Deno.env.get('STARTING_BLOCK')),
  finality: 'DATA_STATUS_ACCEPTED',
  network: 'starknet',
  filter: {
    header: { weak: true },
    events: [
      {
        fromAddress: getStrkAddress() as FieldElement,
        includeTransaction: true,
        keys: [hash.getSelectorFromName('Transfer') as FieldElement],
      },
    ],
  },
  sinkType: 'none', // We handle DB writes via Prisma
};

export default async function transform({ header, events }: Block) {
  if (!header) return [];
  const { blockNumber, timestamp } = header;
  const timestamp_unix = Math.floor(new Date(timestamp as string).getTime() / 1000);

  const records = (events || [])
    .map(({ event, transaction }) => {
      if (!event || !event.data || !event.keys || !transaction?.meta) return null;
      const from = event.keys[1];
      const to = event.keys[2];
      const value = toBigInt(event.data[0]).toString();
      return {
        block_number: BigInt(blockNumber),
        tx_index: transaction.meta.transactionIndex ?? 0,
        event_index: event.index ?? 0,
        tx_hash: transaction.meta.hash,
        timestamp: Math.floor(timestamp_unix),
        from: standariseAddress(from),
        to: standariseAddress(to),
        value,
      };
    })
    .filter(Boolean);

  // Insert all records using Prisma
  if (records.length > 0) {
    await prisma.strkTransfer.createMany({ data: records, skipDuplicates: true });
  }
  return records;
}
