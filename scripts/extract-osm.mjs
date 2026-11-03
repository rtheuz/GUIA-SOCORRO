import { createOSMStream } from "osm-pbf-parser-node";
import { writeFile } from "node:fs/promises";

// Recorte com margem para trajetos entre bairros e Paranapiacaba.
const bounds = { south: -23.83, north: -23.58, west: -46.62, east: -46.25 };
const coords = new Map();
const namedNodes = [];
const ways = [];
const namedWays = [];
for await (const item of createOSMStream(process.argv[2], { withTags: true })) {
  if (item.type === "node" && item.lat >= bounds.south && item.lat <= bounds.north && item.lon >= bounds.west && item.lon <= bounds.east) {
    coords.set(item.id, [item.lat, item.lon]);
    if (item.tags?.name && (item.tags.amenity === 'clinic' || item.tags.amenity === 'hospital' || item.tags.healthcare)) namedNodes.push({ name: item.tags.name, lat: item.lat, lon: item.lon, tags: item.tags });
  }
  if (item.type === "way") {
    const tag = item.tags || {};
    const contained = item.refs.some(id => coords.has(id));
    if (!contained) continue;
    if (tag.name && (tag.amenity === 'clinic' || tag.amenity === 'hospital' || tag.healthcare)) {
      const points = item.refs.map(id => coords.get(id)).filter(Boolean);
      if (points.length) namedWays.push({ name: tag.name, lat: points.reduce((a,p)=>a+p[0],0)/points.length, lon: points.reduce((a,p)=>a+p[1],0)/points.length, tags: tag });
    }
    if (!tag.highway || ['motorway','motorway_link','trunk','trunk_link','construction','proposed','raceway','bus_guideway'].includes(tag.highway)) continue;
    if (['no','private'].includes(tag.foot) || (['no','private'].includes(tag.access) && !['yes','designated','permissive'].includes(tag.foot))) continue;
    ways.push({ refs: item.refs, name: tag.name || '', kind: tag.highway });
  }
}
const used = new Set(ways.flatMap(w => w.refs.filter(id => coords.has(id))));
const nodes = [...used].map(id => [id, ...coords.get(id)]);
const validWays = ways.map(w => ({ ...w, refs: w.refs.map(id => coords.has(id) ? id : null) })).filter(w => w.refs.length > 1);
await writeFile('public/roads-santo-andre.json', JSON.stringify({ bounds, nodes, ways: validWays }));
await writeFile('scripts/osm-health-candidates.json', JSON.stringify([...namedNodes, ...namedWays], null, 2));
console.log(`Nodes: ${nodes.length}, ways: ${validWays.length}, health candidates: ${namedNodes.length + namedWays.length}`);
