import { distance, type Point } from './offline-routing';
export type NavigationProgress = { nearest:Point; segment:number; offRoute:number; remaining:number; turnDistance:number; turnIndex:number; turn:'left'|'right'|'straight'|'arrive'; bearing:number };
export function bearing(a:Point,b:Point) {const r=Math.PI/180,y=Math.sin((b[1]-a[1])*r)*Math.cos(b[0]*r),x=Math.cos(a[0]*r)*Math.sin(b[0]*r)-Math.sin(a[0]*r)*Math.cos(b[0]*r)*Math.cos((b[1]-a[1])*r);return (Math.atan2(y,x)/r+360)%360;}
export function navigationProgress(points:Point[], position:Point):NavigationProgress {
 if(points.length<2){return {nearest:points[0] || position,segment:0,offRoute:distance(position,points[0] || position),remaining:0,turnDistance:0,turnIndex:0,turn:'arrive',bearing:0};}
 const cos=Math.cos(position[0]*Math.PI/180),xy=(p:Point)=>[(p[1]-position[1])*111320*cos,(p[0]-position[0])*111320];
 let best=Infinity,segment=0,t=0,nearest=points[0];
 for(let i=0;i<points.length-1;i++){const a=xy(points[i]),b=xy(points[i+1]),dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy;if(!den)continue;const u=Math.max(0,Math.min(1,-(a[0]*dx+a[1]*dy)/den)),d=Math.hypot(a[0]+u*dx,a[1]+u*dy);if(d<best){best=d;segment=i;t=u;nearest=[points[i][0]+(points[i+1][0]-points[i][0])*u,points[i][1]+(points[i+1][1]-points[i][1])*u];}}
 let remaining=distance(nearest,points[segment+1]);for(let i=segment+1;i<points.length-1;i++)remaining+=distance(points[i],points[i+1]);
 const currentBearing=bearing(points[segment],points[segment+1]); let travelled=distance(nearest,points[segment+1]);
 for(let i=segment+1;i<points.length-1;i++){let before=i-1,after=i+1;while(before>0 && distance(points[before],points[i])<12)before--;while(after<points.length-1 && distance(points[i],points[after])<12)after++;const change=((bearing(points[i],points[after])-bearing(points[before],points[i])+540)%360)-180;if(Math.abs(change)>=40 && travelled>=8)return {nearest,segment,offRoute:best,remaining,turnDistance:travelled,turnIndex:i,turn:change>0?'right':'left',bearing:currentBearing};travelled+=distance(points[i],points[i+1]);}
 return {nearest,segment,offRoute:best,remaining,turnDistance:remaining,turnIndex:points.length-1,turn:remaining<30?'arrive':'straight',bearing:currentBearing};
}
