import { validateSearchInput } from '../validateSearch';

describe('validateSearchInput', () => {
  test('rejects empty/whitespace', () => {
    expect(validateSearchInput('', 'title')).toEqual({ ok: false, reason: 'empty' });
    expect(validateSearchInput('   ', 'title')).toEqual({ ok: false, reason: 'empty' });
  });

  test('rejects too short', () => {
    expect(validateSearchInput('a', 'person')).toEqual({ ok: false, reason: 'too_short' });
  });

  test('rejects too long', () => {
    const long = 'x'.repeat(101);
    expect(validateSearchInput(long, 'company')).toEqual({ ok: false, reason: 'too_long' });
  });

  test('accepts normal input and trims', () => {
    expect(validateSearchInput('  dune ', 'title')).toEqual({ ok: true, query: 'dune' });
  });
});
