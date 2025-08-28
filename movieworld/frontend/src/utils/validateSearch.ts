export type SearchMode = 'title' | 'person' | 'company' | 'genre';

export function validateSearchInput(queryRaw: string, mode: SearchMode) {
  const query = (queryRaw ?? '').trim();

  // base rules
  if (!query) return { ok: false, reason: 'empty' };
  if (query.length < 2) return { ok: false, reason: 'too_short' };
  if (query.length > 100) return { ok: false, reason: 'too_long' };

  // (optional) mode-specific rules you can grow later
  // e.g. only letters/numbers for company names, etc.

  return { ok: true as const, query };
}
