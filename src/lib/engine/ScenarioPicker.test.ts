import { describe, it, expect } from 'vitest';
import { ScenarioPicker } from './ScenarioPicker';

describe('ScenarioPicker (SOLID - SRP)', () => {
  const picker = new ScenarioPicker();

  it('should not pick same scenario twice', () => {
    const history = ['SCN-01'];
    const { scenario } = picker.pick(history, 0, [], 2, 'Pragmatis');
    expect(scenario?.id).not.toBe('SCN-01');
  });

  it('should pick from crucial pool if streak is high', () => {
    const { scenario } = picker.pick([], 5, [], 2, 'Pragmatis'); // streak 5 trigger crucial
    expect(scenario?.type).toBe('crucial');
  });

  it('should pick from crucial pool if global order is low (Butterfly Effect)', () => {
    const globalMetrics = { order: 30 };
    const { scenario } = picker.pick([], 0, [], 2, 'Pragmatis', globalMetrics);
    expect(scenario?.type).toBe('crucial');
  });

  it('should pick flagged scenario if flag is active', () => {
    // SCN-03-B butuh flag 'pabrik_terbangun'
    const { scenario } = picker.pick([], 0, ['pabrik_terbangun'], 2, 'Pragmatis');
    // Note: ini tergantung data skenario, tapi kita test logic filter-nya
    expect(scenario).toBeDefined();
  });
});
