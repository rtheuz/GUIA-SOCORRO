import { useEffect, useMemo, useRef, useState } from 'react';
import { type Point, type RoadData, type RoadRoute } from '@/lib/offline-routing';
import { navigationProgress } from '@/lib/navigation-progress';

type XY = [number, number];
type Segment = [XY, XY];
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export function NavigationMap({data,route,position,heading}:{data:RoadData;route:RoadRoute;position:Point;heading:number|null}) {
 const canvas=useRef<HTMLCanvasElement>(null);
 const [following,setFollowing]=useState(true);
 const followingRef=useRef(true);
 const camera=useRef({x:0,y:0,angle:0,zoom:1,tilt:true,initialized:false});
 const redraw=useRef(()=>{});
 const world=useMemo(()=>{
  const origin:Point=[data.bounds.south,data.bounds.west];
  const scale=111320*Math.cos(origin[0]*Math.PI/180);
  const point=(p:Point):XY=>[(p[1]-origin[1])*scale,(p[0]-origin[0])*111320];
  const nodes=new Map(data.nodes.map(([id,lat,lon])=>[id,point([lat,lon])]));
  const grid=new Map<string,Segment[]>();
  for(const way of data.ways)for(let i=1;i<way.refs.length;i++){
   const a=nodes.get(way.refs[i-1]!),b=nodes.get(way.refs[i]!);if(!a||!b)continue;
   const segment:Segment=[a,b];
   for(let x=Math.floor(Math.min(a[0],b[0])/250);x<=Math.floor(Math.max(a[0],b[0])/250);x++)
    for(let y=Math.floor(Math.min(a[1],b[1])/250);y<=Math.floor(Math.max(a[1],b[1])/250);y++){
     const key=`${x},${y}`,bucket=grid.get(key)||[];bucket.push(segment);grid.set(key,bucket);
    }
  }
  return {point,grid};
 },[data]);
 const routePoints=useMemo(()=>route.points.map(world.point),[route,world]);
 const latest=useRef({position,heading,route});latest.current={position,heading,route};
 const follow=()=>{followingRef.current=true;setFollowing(true);redraw.current();};
 useEffect(()=>{redraw.current();},[position,heading,route]);
 useEffect(()=>{
  const c=canvas.current,ctx=c?.getContext('2d');if(!c||!ctx)return;
  let frame=0,w=1,h=1,lastTime=0;
  const pointers=new Map<number,XY>();
  const draw=(time:number)=>{
   frame=0;const cam=camera.current;
   const current=world.point(latest.current.position);
   const progress=navigationProgress(latest.current.route.points,latest.current.position);
   const targetAngle=(latest.current.heading??progress.bearing)*Math.PI/180;
   let moving=false;
   if(followingRef.current){
    const t=cam.initialized?1-Math.exp(-Math.min(64,time-lastTime)/160):1;
    cam.x+=(current[0]-cam.x)*t;cam.y+=(current[1]-cam.y)*t;
    const delta=Math.atan2(Math.sin(targetAngle-cam.angle),Math.cos(targetAngle-cam.angle));cam.angle+=delta*t;
    moving=Math.hypot(current[0]-cam.x,current[1]-cam.y)>.1||Math.abs(delta)>.002;
    cam.initialized=true;
   }
   lastTime=time;
   const cos=Math.cos(cam.angle),sin=Math.sin(cam.angle),pixels=1.5*cam.zoom;
   const project=(p:XY):XY=>{
    const east=p[0]-cam.x,north=p[1]-cam.y,forward=north*cos+east*sin,right=east*cos-north*sin;
    const depth=cam.tilt?Math.max(.25,1+forward*pixels/Math.max(h,1)):1;
    return [w/2+right*pixels/depth,h*.65-forward*pixels*(cam.tilt?.65:1)/depth];
   };
   ctx.fillStyle='#edf1e9';ctx.fillRect(0,0,w,h);
   const radius=Math.min(2200,Math.max(w,h)/pixels*2),segments=new Set<Segment>();
   for(let x=Math.floor((cam.x-radius)/250);x<=Math.floor((cam.x+radius)/250);x++)
    for(let y=Math.floor((cam.y-radius)/250);y<=Math.floor((cam.y+radius)/250);y++)
     for(const segment of world.grid.get(`${x},${y}`)||[])segments.add(segment);
   const visible=(p:XY)=>!cam.tilt||((p[1]-cam.y)*cos+(p[0]-cam.x)*sin)*pixels> -h*.6;
   const stroke=(color:string,width:number,items:Iterable<Segment>)=>{
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
    for(const [a,b] of items){if(!visible(a)&&!visible(b))continue;ctx.moveTo(...project(a));ctx.lineTo(...project(b));}ctx.stroke();
   };
   stroke('#cbd3c9',8,segments);stroke('#fff',5,segments);
   const routeSegments:Segment[]=[];
   for(let i=1;i<routePoints.length;i++)routeSegments.push([routePoints[i-1],routePoints[i]]);
   stroke('#154f9c',12,routeSegments);stroke('#2987f2',7,routeSegments);
   const dest=project(routePoints[routePoints.length-1]);ctx.fillStyle='#d32626';ctx.beginPath();ctx.arc(...dest,9,0,Math.PI*2);ctx.fill();
   const pos=project(current);ctx.save();ctx.translate(...pos);ctx.rotate(targetAngle-cam.angle);
   ctx.fillStyle='#176dd4';ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-19);ctx.lineTo(14,14);ctx.lineTo(0,8);ctx.lineTo(-14,14);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
   if(moving)schedule();
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};redraw.current=schedule;
  const resize=()=>{const box=c.getBoundingClientRect();w=box.width;h=box.height;const ratio=Math.min(window.devicePixelRatio||1,2);c.width=Math.round(w*ratio);c.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);schedule();};
  const observer=new ResizeObserver(resize);observer.observe(c);
  const pause=()=>{followingRef.current=false;setFollowing(false);};
  const pan=(dx:number,dy:number)=>{const cam=camera.current,s=1.5*cam.zoom;cam.x-=dx*Math.cos(cam.angle)/s+dy*Math.sin(cam.angle)/s;cam.y+=dy*Math.cos(cam.angle)/s-dx*Math.sin(cam.angle)/s;};
  const down=(e:PointerEvent)=>{pause();c.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);};
  const move=(e:PointerEvent)=>{
   const old=pointers.get(e.pointerId);if(!old)return;
   const before=[...pointers.values()];pointers.set(e.pointerId,[e.clientX,e.clientY]);const after=[...pointers.values()];
   if(before.length===1)pan(e.clientX-old[0],e.clientY-old[1]);
   else {
    const length=(p:XY[])=>Math.hypot(p[1][0]-p[0][0],p[1][1]-p[0][1]);
    const angle=(p:XY[])=>Math.atan2(p[1][1]-p[0][1],p[1][0]-p[0][0]);
    camera.current.zoom=clamp(camera.current.zoom*length(after)/Math.max(1,length(before)),.35,5);
    camera.current.angle-=angle(after)-angle(before);pan((e.clientX-old[0])/2,(e.clientY-old[1])/2);
   }schedule();
  };
  const up=(e:PointerEvent)=>pointers.delete(e.pointerId);
  const wheel=(e:WheelEvent)=>{e.preventDefault();camera.current.zoom=clamp(camera.current.zoom*Math.exp(-e.deltaY*.002),.35,5);schedule();};
  c.addEventListener('pointerdown',down);c.addEventListener('pointermove',move);c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);c.addEventListener('wheel',wheel,{passive:false});
  resize();return()=>{observer.disconnect();cancelAnimationFrame(frame);redraw.current=()=>{};c.removeEventListener('pointerdown',down);c.removeEventListener('pointermove',move);c.removeEventListener('pointerup',up);c.removeEventListener('pointercancel',up);c.removeEventListener('wheel',wheel);};
 },[world,routePoints]);
 const control='rounded-xl bg-white shadow px-4 py-3 font-bold text-blue-800';
 return <><canvas ref={canvas} role="img" aria-label="Mapa de navegação em perspectiva, com rota e posição atual" className="h-full w-full touch-none"/><div className="absolute right-3 top-32 flex flex-col gap-2">
  <button className={control} aria-label="Ampliar mapa" onClick={()=>{camera.current.zoom=clamp(camera.current.zoom*1.4,.35,5);redraw.current();}}>+</button>
  <button className={control} aria-label="Reduzir mapa" onClick={()=>{camera.current.zoom=clamp(camera.current.zoom/1.4,.35,5);redraw.current();}}>−</button>
  <button className={control} onClick={()=>{camera.current.tilt=!camera.current.tilt;redraw.current();}}>2D / 3D</button>
  <button className={control} aria-label="Orientar mapa para o norte" onClick={()=>{followingRef.current=false;setFollowing(false);camera.current.angle=0;redraw.current();}}>N ↑</button>
  {!following&&<button className={control} onClick={follow}>Minha posição</button>}
 </div></>;
}
