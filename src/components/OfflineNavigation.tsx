import { useEffect, useRef, useState } from "react";
import { distance, type Point, type RoadData, type RoadRoute } from "@/lib/offline-routing";
import type { HealthUnit } from "@/data/health-units";
import { NavigationMap } from "@/components/NavigationMap";
import { navigationProgress } from "@/lib/navigation-progress";

const CACHE = "guia-mapa-offline-v1";
const formatDistance = (meters:number) => meters < 1000 ? `${Math.round(meters)} m` : `${(meters/1000).toFixed(1)} km`;

export default function OfflineNavigation({unit, onClose}:{unit:HealthUnit; onClose:()=>void}) {
  const [mode,setMode]=useState<'foot'|'car'>('car');
  const mapUrl = `${import.meta.env.BASE_URL}${mode === 'car' ? 'roads-vehicles-santo-andre.json' : 'roads-santo-andre.json'}`;
  const [data,setData]=useState<RoadData|null>(null), [position,setPosition]=useState<Point|null>(null), [route,setRoute]=useState<RoadRoute|null>(null);
  const [message,setMessage]=useState(""), [loading,setLoading]=useState(false);
  const [accuracy,setAccuracy]=useState<number|null>(null);
  const [heading,setHeading]=useState<number|null>(null);
  const lastCalculation=useRef(0);
  const calculateRef=useRef<()=>void>(()=>{});
  const workerRef=useRef<Worker|null>(null);
  useEffect(() => () => workerRef.current?.terminate(), []);
  useEffect(() => { let cancelled=false; setData(null); setRoute(null); setMessage(""); if(window.caches) caches.open(CACHE).then(c=>c.match(mapUrl)).then(async r=>{if(r) {const map=await r.json(); if(!cancelled) setData(map);}}).catch(()=>{}); return ()=>{cancelled=true}; },[mapUrl]);
  const download=async () => { setLoading(true); setMessage(""); try { if(!window.caches) throw new Error("Este navegador não oferece armazenamento offline."); const response=await fetch(mapUrl); if(!response.ok) throw new Error("Não foi possível baixar o mapa."); const map=await response.clone().json() as RoadData; if(!map.nodes?.length || !map.ways?.length) throw new Error("O mapa recebido está incompleto."); const cache=await caches.open(CACHE); await cache.put(mapUrl,response); setData(map); setMessage("Mapa salvo neste aparelho para uso offline."); } catch {setMessage("Não foi possível salvar o mapa. Conecte-se à internet e verifique o espaço disponível.");} finally {setLoading(false);} };
  const calculate=() => { if(!data || !unit.coordinates) return; if(!navigator.geolocation) {setMessage("Este navegador não oferece acesso à localização.");return;} setLoading(true); setMessage(""); navigator.geolocation.getCurrentPosition(({coords})=>{ const point:Point=[coords.latitude,coords.longitude]; setPosition(point); setAccuracy(coords.accuracy); workerRef.current?.terminate(); const worker=new Worker(new URL("../lib/route-worker.ts",import.meta.url),{type:"module"}); workerRef.current=worker; worker.onmessage=(event:MessageEvent<{route?:RoadRoute|null;error?:string}>)=>{setRoute(event.data.route ?? null);setMessage(event.data.error || (event.data.route ? "" : "Não encontramos um trajeto conectado. Você pode estar fora da área do mapa ou distante de uma via mapeada."));setLoading(false);worker.terminate();workerRef.current=null;}; worker.onerror=()=>{setMessage("Não foi possível calcular a rota neste aparelho.");setLoading(false);worker.terminate();workerRef.current=null;}; worker.postMessage({start:point,destination:unit.coordinates,url:mapUrl,mode}); },()=>{setMessage("Não foi possível obter sua localização. Ative o GPS e permita o acesso no navegador.");setLoading(false);},{enableHighAccuracy:true,timeout:20000,maximumAge:15000}); };
  calculateRef.current=calculate;
  useEffect(()=>{ if(!route || !navigator.geolocation) return; lastCalculation.current=Date.now(); const id=navigator.geolocation.watchPosition(({coords})=>{const point:Point=[coords.latitude,coords.longitude];setPosition(previous=>previous && distance(previous,point)<5 ? previous : point);setAccuracy(coords.accuracy);setHeading(coords.heading !== null && Number.isFinite(coords.heading) && (coords.speed ?? 0)>1 ? coords.heading : null);const progress=navigationProgress(route.points,point);if(coords.accuracy<50 && progress.offRoute>100 && Date.now()-lastCalculation.current>20000){lastCalculation.current=Date.now();calculateRef.current();}},()=>{}, {enableHighAccuracy:true,maximumAge:5000,timeout:20000}); return ()=>navigator.geolocation.clearWatch(id); },[route]);
  if(route && position && data) {
    const progress=navigationProgress(route.points,position);
    const destinationGap=unit.coordinates ? distance(route.points[route.points.length-1],unit.coordinates) : 0;
    const action=progress.turn==='left'?'Vire à esquerda':progress.turn==='right'?'Vire à direita':progress.turn==='arrive'?'Destino próximo':'Siga em frente';
    const arrow=progress.turn==='left'?'↰':progress.turn==='right'?'↱':progress.turn==='arrive'?'●':'↑';
    const nextRoad=route.instructions.find(step=>step.pointIndex!==undefined && step.pointIndex>=progress.turnIndex-2 && step.pointIndex<=progress.turnIndex+4 && step.name!=='Via sem nome');
    return <section className="fixed inset-0 z-50 bg-slate-100 overflow-hidden" aria-label={`Navegação para ${unit.name}`}>
      <div className="absolute inset-0"><NavigationMap data={data} route={route} position={position} heading={heading}/></div>
      <div className="absolute top-3 left-3 right-3 rounded-2xl bg-blue-800 text-white shadow-lg px-4 py-3 flex items-center gap-4" role="status"><span className="text-4xl font-bold" aria-hidden="true">{arrow}</span><div><p className="font-bold text-xl">{action}</p><p className="text-sm">{progress.turn==='arrive'?'Destino próximo':`em ${formatDistance(progress.turnDistance)}${nextRoad ? ` · ${nextRoad.name}` : ''}`}</p></div></div>
      {progress.offRoute>100 && <div className="absolute top-24 left-3 right-3 rounded-lg bg-white px-4 py-2 text-sm shadow">{loading?'Recalculando rota…':'Fora da rota. Verifique sua localização.'}</div>}
      <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-4 shadow-lg"><div className="flex items-center justify-between gap-3"><div><p className="font-bold text-xl">{formatDistance(progress.remaining+destinationGap)} restantes</p><p className="text-sm text-muted-foreground">{unit.name}</p></div><button onClick={onClose} className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">Encerrar</button></div><div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>GPS: {accuracy===null?'--':`± ${Math.round(accuracy)} m`}</span><button onClick={calculate} disabled={loading} className="font-semibold text-blue-700 underline">{loading?'Recalculando…':'Recalcular'}</button><a href="https://www.openstreetmap.org/copyright" className="underline">© OpenStreetMap</a></div></div>
    </section>;
  }
  return <section className="fixed inset-0 z-50 overflow-y-auto bg-background p-4" aria-label={`Navegação para ${unit.name}`}>
    <div className="max-w-2xl mx-auto space-y-4">
      <button onClick={onClose} className="rounded-lg bg-secondary px-4 py-2 font-semibold">← Voltar</button>
      <h2 className="font-bold text-xl">Rota: {unit.name}</h2>
      <p className="text-sm">{unit.address}</p>
      <div className="flex gap-2" aria-label="Meio de transporte">{([['car','De carro'],['foot','A pé']] as const).map(([value,label])=><button key={value} disabled={loading} aria-pressed={mode===value} onClick={()=>setMode(value)} className={`flex-1 rounded-lg py-2 font-semibold ${mode===value?'bg-primary text-primary-foreground':'bg-secondary text-secondary-foreground'}`}>{label}</button>)}</div>
      <p className="text-sm p-3 rounded-lg bg-secondary">{mode==='car' ? 'Confira a sinalização: o mapa pode não refletir alterações recentes, bloqueios ou restrições temporárias.' : 'A rota a pé pode incluir escadas e trechos sem acessibilidade.'}</p>
      {!data && <><p className="text-sm">Baixe o mapa para {mode==='car'?'carro':'caminhada'} uma vez com internet para usá-lo sem conexão.</p><button disabled={loading} onClick={download} className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-bold">{loading ? "Baixando mapa…" : "Baixar mapa offline"}</button></>}
      {data && <><p className="text-sm">Mapa disponível neste aparelho.</p><button disabled={loading} onClick={calculate} className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-bold">{loading ? "Aguarde…" : route ? "Recalcular rota" : mode==='car' ? "Calcular rota de carro" : "Calcular rota a pé"}</button><button disabled={loading} onClick={download} className="w-full text-sm underline">Atualizar mapa pela internet</button></>}
      {message && <p role="status" className="p-3 bg-secondary rounded-lg text-sm">{message}</p>}
      <p className="text-xs text-muted-foreground">Dados de ruas: © colaboradores do <a className="underline" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, licença ODbL. Dados podem estar incompletos ou desatualizados.</p>
    </div>
  </section>;
}


