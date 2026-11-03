import { readFileSync } from 'node:fs';
import { findVehicleRoute } from '../src/lib/vehicle-routing';
import { healthUnits } from '../src/data/health-units';
const data=JSON.parse(readFileSync('public/roads-vehicles-santo-andre.json','utf8'));
for(const unit of healthUnits.filter(u=>u.coordinates && !u.status?.includes('fechada'))) {
 const route=findVehicleRoute(data,[-23.6635,-46.5300],unit.coordinates!);
 console.log(`${route?'OK':'SEM CONEXÃO'} | ${unit.name} | ${route ? Math.round(route.distance)+' m' : ''}`);
 if(!route) process.exitCode=1;
}
