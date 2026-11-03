import { describe, expect, it } from 'vitest';
import { navigationProgress } from '@/lib/navigation-progress';

describe('acompanhamento da navegação',()=>{
 it('identifica a próxima curva e a distância restante',()=>{
  const route:[[number,number],[number,number],[number,number]]=[[0,0],[0.001,0],[0.001,0.001]];
  const progress=navigationProgress(route,[0.0002,0]);
  expect(progress.turn).toBe('right');expect(progress.turnDistance).toBeGreaterThan(80);expect(progress.remaining).toBeGreaterThan(180);
 });
 it('mede o desvio em relação à rota',()=>{
  const progress=navigationProgress([[0,0],[0.002,0]],[0.001,0.001]);
  expect(progress.offRoute).toBeGreaterThan(100);
 });
 it('identifica chegada ao fim da rota',()=>{
  const progress=navigationProgress([[0,0],[0.001,0]],[0.00099,0]);
  expect(progress.turn).toBe('arrive');
 });
});
