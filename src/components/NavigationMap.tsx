import { useEffect, useMemo, useRef } from 'react';
import { type Point, type RoadData, type RoadRoute } from '@/lib/offline-routing';
import { navigationProgress } from '@/lib/navigation-progress';

export function NavigationMap({data,route,position,heading}:{data:RoadData;route:RoadRoute;position:Point;heading:number|null}) {
 const ref=useRef<HTMLCanvasElement>(null);
 const nodes=useMemo(()=>new Map<number,Point>(data.nodes.map(([id,lat,lon])=>[id,[lat,lon]])),[data]);
 const progress=useMemo(()=>navigationProgress(route.points,position),[route,position]);
 const direction=heading===null ? progress.bearing : heading;
 useEffect(()=>{const c=ref.current,ctx=c?.getContext('2d');if(!c||!ctx)return;const w=c.width,h=c.height,ang=direction*Math.PI/180,cos=Math.cos(ang),sin=Math.sin(ang),longitudeScale=Math.cos(position[0]*Math.PI/180);
  const project=(p:Point):[number,number]|null=>{const east=(p[1]-position[1])*111320*longitudeScale,north=(p[0]-position[0])*111320;const forward=north*cos+east*sin,right=east*cos-north*sin;if(forward < -110 || forward>1300 || Math.abs(right)>900)return null;const z=Math.max(.5,1+forward/340);return [w/2+right*2.5/z,h*.77-forward*1.5/z];};
  const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#dbe9ee');sky.addColorStop(.4,'#eaf1eb');sky.addColorStop(1,'#eef1e9');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  const roads=(color:string,width:number)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();for(const way of data.ways){let active=false;for(const id of way.refs){const p=id===null?undefined:nodes.get(id);const xy=p?project(p):null;if(!xy){active=false;continue;}if(active)ctx.lineTo(...xy);else ctx.moveTo(...xy);active=true;}}ctx.stroke();};
  roads('#d2d9d3',8);roads('#ffffff',5);
  const routeLine=(color:string,width:number)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();let active=false;for(let i=Math.max(0,progress.segment-1);i<route.points.length;i++){const xy=project(route.points[i]);if(!xy){active=false;continue;}if(active)ctx.lineTo(...xy);else ctx.moveTo(...xy);active=true;}ctx.stroke();};routeLine('#154f9c',14);routeLine('#2987f2',9);
  const destination=project(route.points[route.points.length-1]);if(destination){ctx.fillStyle='#d32626';ctx.beginPath();ctx.arc(destination[0],destination[1],11,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.stroke();}
  const y=h*.77;ctx.save();ctx.translate(w/2,y);ctx.shadowColor='#174b86';ctx.shadowBlur=12;ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(18,19);ctx.lineTo(0,12);ctx.lineTo(-18,19);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#176dd4';ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(12,13);ctx.lineTo(0,8);ctx.lineTo(-12,13);ctx.closePath();ctx.fill();ctx.restore();
 },[data,nodes,route,position,direction,progress.segment]);
 return <canvas ref={ref} width={700} height={1000} role="img" aria-label="Mapa de navegação em perspectiva, com rota e posição atual" className="h-full w-full"/>;
}
