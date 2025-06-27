import { num } from 'https://esm.sh/starknet@6.16.0';

export function toBigInt(value: string | undefined) {
  if (!value) return BigInt(0);
  return BigInt(value.toString());
}

export function standariseAddress(address: string | bigint) {
  let _a = address || '0';
  return num.getHexString(num.getDecimalString(_a.toString()));
}
