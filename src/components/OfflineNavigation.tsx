import { useEffect, useMemo, useRef, useState } from "react";
import { type Point, type RoadData, type RoadRoute } from "@/lib/offline-routing";
import type { HealthUnit } from "@/data/health-units";

const CACHE = "guia-mapa-offline-v1";
const MAP_URL = `${import.meta.env.BASE_URL}roads-santo-andre.json`;
const formatDistance = (meters:number) => meters < 1000 ? `${Math.round(meters)} m` : `${(meters/1000).toFixed(1)} km`;

function RouteMap({data, route, position}: {data:RoadData; route:RoadRoute; position:Point}) {
  const ref=useRef<HTMLCanvasElement>(null);
  const nodes=useMemo(() => new Map<number,Point>(data.nodes.map(([id,lat,lon])=>[id,[lat,lon]])),[data]);
  useEffect(() => {
    const canvas=ref.current, ctx=canvas?.getContext("2d"); if(!canvas || !ctx) return;
    const width=canvas.width, height=canvas.height;
    const points=[...route.points,position];
    let minLat=Math.min(...points.map(p=>p[0])), maxLat=Math.max(...points.map(p=>p[0]));
    let minLon=Math.min(...points.map(p=>p[1])), maxLon=Math.max(...points.map(p=>p[1]));
    const padLat=Math.max((maxLat-minLat)*0.2,0.002), padLon=Math.max((maxLon-minLon)*0.2,0.002);
    minLat-=padLat; maxLat+=padLat; minLon-=padLon; maxLon+=padLon;
    const latitudeScale=Math.cos((minLat+maxLat)*Math.PI/360);
    const scale=Math.min(width/((maxLon-minLon)*latitudeScale),height/(maxLat-minLat));
    const centerLat=(minLat+maxLat)/2, centerLon=(minLon+maxLon)/2;
    const xy=(p:Point):[number,number] => [width/2+(p[1]-centerLon)*latitudeScale*scale, height/2-(p[0]-centerLat)*scale];
    ctx.fillStyle="#f2f2eb"; ctx.fillRect(0,0,width,height);
    ctx.strokeStyle="#c6c9c4"; ctx.lineWidth=1.2;
    ctx.beginPath();
    for(const way of data.ways) { let active=false; for(const id of way.refs) { const p=id===null ? undefined : nodes.get(id); if(!p) {active=false;continue;} const [x,y]=xy(p); if(!active) ctx.moveTo(x,y); else ctx.lineTo(x,y); active=true; } }
    ctx.stroke();
    ctx.strokeStyle="#b91c1c"; ctx.lineWidth=5; ctx.lineJoin="round"; ctx.lineCap="round"; ctx.beginPath(); route.points.forEach((p,i)=>{const [x,y]=xy(p); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);}); ctx.stroke();
    for(const [point,color] of [[position,"#1261b0"],[route.points[route.points.length-1],"#b91c1c"]] as [Point,string][]) { const [x,y]=xy(point);ctx.beginPath();ctx.fillStyle=color;ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle="white";ctx.lineWidth=2;ctx.stroke(); }
  },[data,nodes,route,position]);
  return <canvas ref={ref} width={700} height={500} role="img" aria-label="Mapa das ruas com trajeto em vermelho, localização atual em azul e destino em vermelho" className="w-full rounded-lg border border-border" />;
}

export default function OfflineNavigation({unit, onClose}:{unit:HealthUnit; onClose:()=>void}) {
  const [data,setData]=useState<RoadData|null>(null), [position,setPosition]=useState<Point|null>(null), [route,setRoute]=useState<RoadRoute|null>(null);
  const [message,setMessage]=useState(""), [loading,setLoading]=useState(false);
  const [accuracy,setAccuracy]=useState<number|null>(null);
  const workerRef=useRef<Worker|null>(null);
  useEffect(() => () => workerRef.current?.terminate(), []);
  useEffect(() => { let cancelled=false; if(window.caches) caches.open(CACHE).then(c=>c.match(MAP_URL)).then(async r=>{if(r && !cancelled) setData(await r.json());}).catch(()=>{}); return ()=>{cancelled=true}; },[]);
  const download=async () => { setLoading(true); setMessage(""); try { if(!window.caches) throw new Error("Este navegador não oferece armazenamento offline."); const response=await fetch(MAP_URL); if(!response.ok) throw new Error("Não foi possível baixar o mapa."); const map=await response.clone().json() as RoadData; if(!map.nodes?.length || !map.ways?.length) throw new Error("O mapa recebido está incompleto."); const cache=await caches.open(CACHE); await cache.put(MAP_URL,response); setData(map); setMessage("Mapa salvo neste aparelho para uso offline."); } catch {setMessage("Não foi possível salvar o mapa. Conecte-se à internet e verifique o espaço disponível.");} finally {setLoading(false);} };
  const calculate=() => { if(!data || !unit.coordinates) return; if(!navigator.geolocation) {setMessage("Este navegador não oferece acesso à localização.");return;} setLoading(true); setMessage(""); navigator.geolocation.getCurrentPosition(({coords})=>{ const point:Point=[coords.latitude,coords.longitude]; setPosition(point); setAccuracy(coords.accuracy); workerRef.current?.terminate(); const worker=new Worker(new URL("../lib/route-worker.ts",import.meta.url),{type:"module"}); workerRef.current=worker; worker.onmessage=(event:MessageEvent<{route?:RoadRoute|null;error?:string}>)=>{setRoute(event.data.route ?? null);setMessage(event.data.error || (event.data.route ? "" : "Não encontramos um trajeto conectado. Você pode estar fora da área do mapa ou distante de uma via mapeada."));setLoading(false);worker.terminate();workerRef.current=null;}; worker.onerror=()=>{setMessage("Não foi possível calcular a rota neste aparelho.");setLoading(false);worker.terminate();workerRef.current=null;}; worker.postMessage({start:point,destination:unit.coordinates,url:MAP_URL}); },()=>{setMessage("Não foi possível obter sua localização. Ative o GPS e permita o acesso no navegador.");setLoading(false);},{enableHighAccuracy:true,timeout:20000,maximumAge:0}); };
  useEffect(()=>{ if(!route || !navigator.geolocation) return; const id=navigator.geolocation.watchPosition(({coords})=>{setPosition([coords.latitude,coords.longitude]);setAccuracy(coords.accuracy);},()=>{}, {enableHighAccuracy:true,maximumAge:5000,timeout:20000}); return ()=>navigator.geolocation.clearWatch(id); },[route]);
  return <section className="fixed inset-0 z-50 overflow-y-auto bg-background p-4" aria-label={`Navegação para ${unit.name}`}>
    <div className="max-w-2xl mx-auto space-y-4">
      <button onClick={onClose} className="rounded-lg bg-secondary px-4 py-2 font-semibold">← Voltar</button>
      <h2 className="font-bold text-xl">Rota a pé: {unit.name}</h2>
      <p className="text-sm">{unit.address}</p>
      <p className="text-sm p-3 rounded-lg bg-secondary">Rota somente a pé, não adequada para dirigir. Pode incluir escadas e trechos sem acessibilidade. Confira a sinalização e as condições do caminho; bloqueios e mudanças recentes podem não aparecer. Em emergência, ligue 192.</p>
      {!data && <><p className="text-sm">Baixe o mapa uma vez com internet. Ele ocupa cerca de 20 MB no aparelho e poderá ser usado sem conexão.</p><button disabled={loading} onClick={download} className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-bold">{loading ? "Baixando mapa…" : "Baixar mapa offline"}</button></>}
      {data && <><p className="text-sm">Mapa disponível neste aparelho.</p><button disabled={loading} onClick={calculate} className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-bold">{loading ? "Aguarde…" : route ? "Recalcular rota" : "Calcular rota a pé"}</button><button disabled={loading} onClick={download} className="w-full text-sm underline">Atualizar mapa pela internet</button></>}
      {message && <p role="status" className="p-3 bg-secondary rounded-lg text-sm">{message}</p>}
      {route && position && data && <><RouteMap data={data} route={route} position={position}/><p className="text-sm font-semibold">Trajeto estimado: {formatDistance(route.distance)}. Precisão do GPS: {accuracy === null ? "desconhecida" : `aproximadamente ${Math.round(accuracy)} m`}.</p>{accuracy !== null && accuracy > 100 && <p role="status" className="text-sm font-bold text-primary">Sinal de GPS impreciso. Procure um local aberto e recalcule.</p>}<p className="text-sm">O ponto azul acompanha o GPS. Se sair do trajeto, toque em “Recalcular rota”. Os trechos entre os pontos e as ruas são aproximados.</p><ol className="list-decimal pl-6 space-y-1 text-sm">{route.instructions.map((step,i)=><li key={i}>Siga por {step.name} por aproximadamente {formatDistance(step.distance)}.</li>)}</ol></>}
      <p className="text-xs text-muted-foreground">Dados de ruas: © colaboradores do <a className="underline" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, licença ODbL. Dados podem estar incompletos ou desatualizados.</p>
    </div>
  </section>;
}
