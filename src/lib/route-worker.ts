import { findWalkingRoute, type Point, type RoadData } from "./offline-routing";
import { findVehicleRoute, type VehicleRoadData } from "./vehicle-routing";
self.onmessage = async (event:MessageEvent<{start:Point; destination:Point; url:string; mode:'foot'|'car'}>) => {
  try {
    const cache=await caches.open("guia-mapa-offline-v1");
    const response=await cache.match(event.data.url);
    if(!response) throw new Error("Mapa offline indisponível");
    const data=await response.json() as RoadData;
    self.postMessage({route:event.data.mode === 'car' ? findVehicleRoute(data as VehicleRoadData,event.data.start,event.data.destination) : findWalkingRoute(data,event.data.start,event.data.destination)});
  } catch { self.postMessage({error:"Não foi possível calcular a rota neste aparelho."}); }
};
