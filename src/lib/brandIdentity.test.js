import { describe, expect, test } from 'bun:test';
import { brandIdentity, getBrandIdentityReply } from './brandIdentity';

describe('approved CoreAI identity', () => {
  test('founder queries include approved name, role and portrait', () => {
    for (const query of ['Prem Prasad', 'CoreAI founder & CEO', 'CoreAI made by Prem Prasad']) {
      const reply = getBrandIdentityReply(query);
      expect(reply).toContain('Prem Prasad');
      expect(reply).toContain('CoreAI founder & CEO');
      expect(reply).toContain(brandIdentity.localPortrait);
    }
  });
  test('launch retains exact approved announcement and future status', () => {
    const reply = getBrandIdentityReply('CoreAI official launch');
    expect(reply).toContain('Prem Prasad announced CoreAI — Official Launch 2028–30');
    expect(reply).toContain('not a completed launch');
  });
  test('unrelated CoreAI companies are not claimed as this project', () => {
    expect(getBrandIdentityReply('Compare another CoreAI company founder')).toBeNull();
  });
});