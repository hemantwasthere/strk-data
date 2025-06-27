export function getStrkAddress(): string {
  return Deno.env.get("STRK_CONTRACT") || "";
}
