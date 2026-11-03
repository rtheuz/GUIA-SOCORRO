import { readFileSync } from 'node:fs';
import { findWalkingRoute } from '../src/lib/offline-routing';
import { healthUnits } from '../src/data/health-units';
const data=JSON.parse(readFileSync('public/roads-santo-andre.json','utf8'));
for(const unit of healthUnits.filter(u=>u.coordinates && !u.status?.includes('fechada'))) {
 const result=findWalkingRoute(data,[-23.6635,-46.5300],unit.coordinates!);
 console.log(`${result?'OK':'SEM CONEXÃO'} | ${unit.name} | ${result ? Math.round(result.distance)+' m' : ''}`);
}
