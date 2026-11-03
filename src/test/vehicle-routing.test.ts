import { describe, expect, it } from 'vitest';
import { findVehicleRoute, type VehicleRoadData } from '@/lib/vehicle-routing';
const data:VehicleRoadData={bounds:{south:-1,north:1,west:-1,east:1},nodes:[[1,0,0],[2,0,0.001],[3,0,0.002],[4,0.001,0.001],[5,0.001,0.002]],ways:[{id:10,refs:[1,2],name:'Entrada',kind:'residential',oneway:1},{id:20,refs:[2,3],name:'Direta',kind:'residential',oneway:1},{id:30,refs:[2,4,5,3],name:'Desvio',kind:'residential',oneway:0}],turns:[]};
describe('rota para veículos',()=>{
 it('respeita mão única',()=>{ expect(findVehicleRoute(data,[0,0],[0,0.002])?.instructions.map(s=>s.name)).toEqual(['Entrada','Direta']); expect(findVehicleRoute(data,[0,0.002],[0,0])).toBeNull(); });
 it('respeita mão única invertida',()=>{const reverse:VehicleRoadData={...data,ways:[{id:10,refs:[1,2],name:'Via',kind:'residential',oneway:-1}],turns:[]};expect(findVehicleRoute(reverse,[0,0],[0,0.001])).toBeNull();expect(findVehicleRoute(reverse,[0,0.001],[0,0])).not.toBeNull();});
 it('evita conversão proibida',()=>{const route=findVehicleRoute({...data,turns:[[2,10,20,'no_right_turn']]},[0,0],[0,0.002]);expect(route?.instructions.map(s=>s.name)).toEqual(['Entrada','Desvio']);});
 it('segue conversão obrigatória',()=>{const route=findVehicleRoute({...data,turns:[[2,10,30,'only_right_turn']]},[0,0],[0,0.002]);expect(route?.instructions.map(s=>s.name)).toEqual(['Entrada','Desvio']);});
 it('permite seguir reto quando o retorno na mesma via é proibido',()=>{
  const straight:VehicleRoadData={...data,ways:[{id:10,refs:[1,2,3],name:'Via',kind:'residential',oneway:0}],turns:[[2,10,10,'no_u_turn']]};
  expect(findVehicleRoute(straight,[0,0],[0,0.002])?.points).toEqual([[0,0],[0,0.001],[0,0.002]]);
 });
 it('recusa pontos fora da malha',()=>expect(findVehicleRoute(data,[0.1,0.1],[0,0])).toBeNull());
});
