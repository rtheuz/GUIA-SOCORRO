import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HealthUnitsPage from '@/pages/HealthUnitsPage';
import { healthUnits } from '@/data/health-units';

afterEach(()=>vi.restoreAllMocks());
describe('distância das unidades',()=>{
 it('ordena as unidades pelas distâncias quando a localização está disponível',()=>{
  const position=healthUnits.find(unit=>unit.name==='UPA Perimetral')!.coordinates!;
  Object.defineProperty(navigator, 'geolocation', {configurable:true, value:{
    watchPosition:vi.fn((success:PositionCallback)=>{success({coords:{latitude:position[0],longitude:position[1],accuracy:10,altitude:null,altitudeAccuracy:null,heading:null,speed:null},timestamp:Date.now()} as GeolocationPosition);return 1;}),
    clearWatch:vi.fn(),
  }});
  render(<MemoryRouter><HealthUnitsPage /></MemoryRouter>);
  const first=screen.getByRole('heading',{name:'UPA Perimetral'}).parentElement!;
  expect(within(first).getByText('0 m em linha reta')).toBeInTheDocument();
  expect(screen.getAllByRole('heading', {level:3})[0]).toHaveTextContent('UPA Perimetral');
  expect(screen.queryByText('Distância indisponível')).not.toBeInTheDocument();
 });
 it('informa quando a localização não está disponível',()=>{
  Object.defineProperty(navigator,'geolocation',{configurable:true,value:{watchPosition:vi.fn((_success:PositionCallback,error:PositionErrorCallback)=>{error({code:1,message:'negada',PERMISSION_DENIED:1,POSITION_UNAVAILABLE:2,TIMEOUT:3});return 1;}),clearWatch:vi.fn()}});
  render(<MemoryRouter><HealthUnitsPage /></MemoryRouter>);
  expect(screen.getByRole('status')).toHaveTextContent('Ative a localização');
 });
});
