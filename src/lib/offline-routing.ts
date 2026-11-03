export type Point = [number, number];
export type RoadData = { bounds: {south:number; north:number; west:number; east:number}; nodes: [number,number,number][]; ways: {refs:(number|null)[]; name:string; kind:string}[] };
export type RoadRoute = { points: Point[]; distance: number; instructions: {name:string; distance:number}[] };
const radians = (value:number) => value * Math.PI / 180;
export function distance(a:Point, b:Point) {
  const dy=radians(b[0]-a[0]), dx=radians(b[1]-a[1]);
  const v=Math.sin(dy/2)**2+Math.cos(radians(a[0]))*Math.cos(radians(b[0]))*Math.sin(dx/2)**2;
  return 12742000*Math.asin(Math.min(1,Math.sqrt(v)));
}
class Heap {
  data: [number,number][] = [];
  push(entry:[number,number]) { let i=this.data.length; this.data.push(entry); while(i>0) { const p=(i-1)>>1; if(this.data[p][1]<=entry[1]) break; this.data[i]=this.data[p]; i=p; } this.data[i]=entry; }
  pop(): [number,number] | undefined { const first=this.data[0]; const last=this.data.pop(); if(this.data.length && last) { let i=0; while(i*2+1<this.data.length) { let c=i*2+1; if(c+1<this.data.length && this.data[c+1][1]<this.data[c][1]) c++; if(this.data[c][1]>=last[1]) break; this.data[i]=this.data[c]; i=c; } this.data[i]=last; } return first; }
}
export function findWalkingRoute(data:RoadData, start:Point, destination:Point): RoadRoute | null {
  const count=data.nodes.length, index=new Map<number,number>();
  let from=-1, to=-1, fromDistance=Infinity, toDistance=Infinity;
  data.nodes.forEach(([id,lat,lon],i)=>{ index.set(id,i); const point:Point=[lat,lon], a=distance(point,start), b=distance(point,destination); if(a<fromDistance) {fromDistance=a;from=i;} if(b<toDistance) {toDistance=b;to=i;} });
  if(fromDistance>150 || toDistance>150 || from<0 || to<0) return null;
  // Arrays compactos evitam um objeto JavaScript para cada aresta no celular.
  const maxEdges=data.ways.reduce((sum,w)=>sum+Math.max(0,w.refs.length-1)*2,0);
  const head=new Int32Array(count).fill(-1), next=new Int32Array(maxEdges), target=new Int32Array(maxEdges), wayIndex=new Int32Array(maxEdges), length=new Float32Array(maxEdges);
  let edgeCount=0;
  const add=(a:number,b:number,meters:number,way:number)=>{target[edgeCount]=b;length[edgeCount]=meters;wayIndex[edgeCount]=way;next[edgeCount]=head[a];head[a]=edgeCount++;};
  data.ways.forEach((way,w)=>{for(let i=1;i<way.refs.length;i++) {const x=way.refs[i-1],y=way.refs[i]; if(x===null || y===null) continue; const a=index.get(x),b=index.get(y); if(a===undefined || b===undefined || a===b) continue; const na=data.nodes[a],nb=data.nodes[b],meters=distance([na[1],na[2]],[nb[1],nb[2]]); add(a,b,meters,w);add(b,a,meters,w);}});
  const costs=new Float64Array(count).fill(Infinity), previous=new Int32Array(count).fill(-1), previousEdge=new Int32Array(count).fill(-1), heap=new Heap();
  costs[from]=0;heap.push([from,0]);
  while(heap.data.length) {const [id,cost]=heap.pop()!; if(cost!==costs[id]) continue; if(id===to) break; for(let edge=head[id];edge!==-1;edge=next[edge]) {const v=target[edge], value=cost+length[edge]; if(value<costs[v]) {costs[v]=value;previous[v]=id;previousEdge[v]=edge;heap.push([v,value]);}}}
  if(!Number.isFinite(costs[to])) return null;
  const ids=[to], parts:{name:string;distance:number}[]=[]; let current=to;
  while(current!==from) {const edge=previousEdge[current], prior=previous[current];if(edge<0 || prior<0) return null;parts.push({name:data.ways[wayIndex[edge]].name || 'Via sem nome',distance:length[edge]});current=prior;ids.push(current);}
  ids.reverse();parts.reverse();const instructions:{name:string;distance:number}[]=[];
  for(const part of parts) {const prior=instructions[instructions.length-1];if(prior?.name===part.name) prior.distance+=part.distance;else instructions.push({...part});}
  return {points:ids.map(i=>[data.nodes[i][1],data.nodes[i][2]]),distance:costs[to]+fromDistance+toDistance,instructions};
}
