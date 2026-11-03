import { distance, type Point, type RoadData, type RoadRoute } from './offline-routing';
export type VehicleRoadData = Omit<RoadData,'ways'> & {
  ways: {id:number; refs:(number|null)[];name:string;kind:string;oneway:-1|0|1}[];
  turns: [number,number,number,string][];
};
class Heap {
  data:[number,number][]=[];
  push(e:[number,number]) { let i=this.data.length;this.data.push(e);while(i){const p=(i-1)>>1;if(this.data[p][1]<=e[1])break;this.data[i]=this.data[p];i=p;}this.data[i]=e; }
  pop():[number,number]|undefined {const top=this.data[0],last=this.data.pop();if(this.data.length&&last){let i=0;while(i*2+1<this.data.length){let c=i*2+1;if(c+1<this.data.length&&this.data[c+1][1]<this.data[c][1])c++;if(this.data[c][1]>=last[1])break;this.data[i]=this.data[c];i=c;}this.data[i]=last;}return top;}
}
type Turn = {to:number; type:string};
export function findVehicleRoute(data:VehicleRoadData,start:Point,destination:Point):RoadRoute|null {
 const n=data.nodes.length, index=new Map<number,number>(); let from=-1,startGap=Infinity,endGap=Infinity;
 const nearDestination:[number,number][]=[];
 data.nodes.forEach(([id,lat,lon],i)=>{index.set(id,i);const p:Point=[lat,lon],a=distance(p,start),b=distance(p,destination);if(a<startGap){startGap=a;from=i;}if(b<endGap)endGap=b;if(b<=100)nearDestination.push([i,b]);});
 if(from<0||startGap>150||endGap>100)return null;
 const destinations=new Map(nearDestination.filter(([,gap])=>gap<=endGap+25));
 const maxEdges=data.ways.reduce((s,w)=>s+Math.max(0,w.refs.length-1)*2,0),head=new Int32Array(n).fill(-1),next=new Int32Array(maxEdges),target=new Int32Array(maxEdges),origin=new Int32Array(maxEdges),wayIndex=new Int32Array(maxEdges),meters=new Float32Array(maxEdges);let edgeCount=0;
 const add=(a:number,b:number,d:number,w:number)=>{origin[edgeCount]=a;target[edgeCount]=b;wayIndex[edgeCount]=w;meters[edgeCount]=d;next[edgeCount]=head[a];head[a]=edgeCount++;};
 data.ways.forEach((w,wi)=>{for(let i=1;i<w.refs.length;i++){const x=w.refs[i-1],y=w.refs[i];if(x===null||y===null)continue;const a=index.get(x),b=index.get(y);if(a===undefined||b===undefined||a===b)continue;const p=data.nodes[a],q=data.nodes[b],d=distance([p[1],p[2]],[q[1],q[2]]);if(w.oneway!==-1)add(a,b,d,wi);if(w.oneway!==1)add(b,a,d,wi);}});
 const restrictions=new Map<string,Turn[]>();for(const [via,fromWay,toWay,type] of data.turns){const key=`${via}:${fromWay}`;const list=restrictions.get(key)||[];list.push({to:toWay,type});restrictions.set(key,list);}
 const allowed=(prior:number,edge:number)=>{const via=data.nodes[target[prior]][0],oldWay=data.ways[wayIndex[prior]].id,newWay=data.ways[wayIndex[edge]].id,turns=restrictions.get(`${via}:${oldWay}`);const reversing=origin[prior]===target[edge];if(reversing && !turns?.some(t=>t.type==='only_u_turn' && t.to===newWay))return false;if(!turns)return true;const match=(t:Turn)=>t.to===newWay && (!t.type.includes('u_turn') || reversing);const only=turns.filter(t=>t.type.startsWith('only_'));if(only.length&&!only.every(match))return false;return !turns.some(t=>t.type.startsWith('no_')&&match(t));};
 if(destinations.has(from)) {const p=data.nodes[from];return {points:[[p[1],p[2]]],distance:startGap+destinations.get(from)!,instructions:[]};}
 const costs=new Float64Array(edgeCount).fill(Infinity),previous=new Int32Array(edgeCount).fill(-1),heap=new Heap();
 for(let e=head[from];e!==-1;e=next[e]){costs[e]=meters[e];heap.push([e,costs[e]]);}
 let found=-1;while(heap.data.length){const [e,cost]=heap.pop()!;if(cost!==costs[e])continue;const node=target[e];if(destinations.has(node)){found=e;break;}for(let candidate=head[node];candidate!==-1;candidate=next[candidate]){if(!allowed(e,candidate))continue;const value=cost+meters[candidate];if(value<costs[candidate]){costs[candidate]=value;previous[candidate]=e;heap.push([candidate,value]);}}}
 if(found<0)return null;
 const edges:number[]=[];for(let e=found;e!==-1;e=previous[e])edges.push(e);edges.reverse();const ids=[from,...edges.map(e=>target[e])];const instructions:{name:string;distance:number}[]=[];
 for(const edge of edges){const name=data.ways[wayIndex[edge]].name||'Via sem nome',last=instructions[instructions.length-1];if(last?.name===name)last.distance+=meters[edge];else instructions.push({name,distance:meters[edge]});}
 return {points:ids.map(i=>[data.nodes[i][1],data.nodes[i][2]]),distance:costs[found]+startGap+destinations.get(target[found])!,instructions};
}
