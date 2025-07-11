export function isValidUUID(uuidString: unknown): uuidString is string {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof uuidString === 'string' && uuidRegex.test(uuidString);
}
