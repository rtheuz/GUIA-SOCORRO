import { createOSMStream } from 'osm-pbf-parser-node';
import { writeFile } from 'node:fs/promises';
const bounds={south:-23.83,north:-23.58,west:-46.62,east:-46.25};
const coords=new Map(), blockedNodes=new Set(), ways=[], relations=[];
const allowedHighways=new Set(['motorway','motorway_link','trunk','trunk_link','primary','primary_link','secondary','secondary_link','tertiary','tertiary_link','unclassified','residential','living_street','service','road']);
const blocked=new Set(['no','private','destination','delivery','customers','agricultural','forestry']);
for await(const item of createOSMStream(process.argv[2],{withTags:true})) {
 if(item.type==='node' && item.lat>=bounds.south && item.lat<=bounds.north && item.lon>=bounds.west && item.lon<=bounds.east) {
  coords.set(item.id,[item.lat,item.lon]); const t=item.tags||{};
  if(t.barrier && !['entrance','cattle_grid','border_control','toll_booth'].includes(t.barrier) && !['yes','permissive'].includes(t.motorcar || t.motor_vehicle || t.vehicle || t.access)) blockedNodes.add(item.id);
 }
 if(item.type==='way') {
  const t=item.tags||{}; if(!allowedHighways.has(t.highway) || !item.refs.some(id=>coords.has(id))) continue;
  const access=t.motorcar || t.motor_vehicle || t.vehicle || t.access; if(blocked.has(access)) continue;
  if(['access:conditional','vehicle:conditional','motor_vehicle:conditional','motorcar:conditional','oneway:conditional','oneway:motor_vehicle:conditional'].some(k=>t[k])) continue;
  const one=t['oneway:motorcar'] || t['oneway:motor_vehicle'] || t['oneway:vehicle'] || t.oneway || (t.junction==='roundabout'?'yes':'no');
  if(!['yes','1','true','-1','reverse','no','0','false'].includes(one)) continue;
  ways.push({id:item.id,refs:item.refs.map(id=>coords.has(id) && !blockedNodes.has(id)?id:null),name:t.name||'',kind:t.highway,oneway:['yes','1','true'].includes(one)?1:['-1','reverse'].includes(one)?-1:0});
 }
 if(item.type==='relation' && item.tags?.type==='restriction') {
  const t=item.tags; if((t.except||'').split(';').map(s=>s.trim()).some(s=>['motorcar','motor_vehicle','vehicle'].includes(s)) && !t['restriction:motorcar'] && !t['restriction:motor_vehicle']) continue;
  const specific=t['restriction:motorcar'] || t['restriction:motor_vehicle'];
  const values=[specific || t.restriction, t['restriction:motorcar:conditional']?.split('@')[0].trim(), t['restriction:motor_vehicle:conditional']?.split('@')[0].trim(), t['restriction:conditional']?.split('@')[0].trim()].filter(v=>v && (v.startsWith('no_') || v.startsWith('only_')));
  if(!values.length) continue;
  const from=item.members.filter(m=>m.role==='from' && m.type==='way').map(m=>m.ref);
  const to=item.members.filter(m=>m.role==='to' && m.type==='way').map(m=>m.ref);
  const via=item.members.filter(m=>m.role==='via'); if(!from.length||!to.length||!via.length)continue;
  const conditional=Boolean(t['restriction:motorcar:conditional'] || t['restriction:motor_vehicle:conditional'] || t['restriction:conditional']);
  for(const value of values) relations.push({from,to,via,type:value,conditional});
 }
}
const ids=new Set(ways.map(w=>w.id)), blockedWays=new Set();
const conditionalNodes=new Set();
// Via-way restrictions are conservatively excluded until an entire multi-way
// restriction can be represented by the router.
for(const r of relations) if(r.via.some(v=>v.type==='way') && r.from.some(id=>ids.has(id))) for(const v of r.via) if(v.type==='way') blockedWays.add(v.ref);
for(const r of relations) if(r.conditional && r.from.some(id=>ids.has(id))) for(const v of r.via) if(v.type==='node') conditionalNodes.add(v.ref);
const valid=ways.filter(w=>!blockedWays.has(w.id)).map(w=>({...w,refs:w.refs.map(id=>conditionalNodes.has(id)?null:id)})); const validIds=new Set(valid.map(w=>w.id));
const turns=[];for(const r of relations){const via=r.via.length===1 && r.via[0].type==='node'?r.via[0].ref:null;if(via===null||!coords.has(via))continue;for(const from of r.from)for(const to of r.to)if(validIds.has(from)&&validIds.has(to)) turns.push([via,from,to,r.type]);}
const used=new Set();for(const w of valid)for(let i=1;i<w.refs.length;i++){const a=w.refs[i-1],b=w.refs[i];if(a!==null && b!==null){used.add(a);used.add(b);}}
const nodes=[...used].map(id=>[id,...coords.get(id)]);
await writeFile('public/roads-vehicles-santo-andre.json',JSON.stringify({bounds,nodes,ways:valid,turns}));
console.log(`nodes=${nodes.length} ways=${valid.length} turns=${turns.length} excludedViaWays=${blockedWays.size}`);
