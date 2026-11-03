import { describe, expect, it } from "vitest";
import { findWalkingRoute, type RoadData } from "@/lib/offline-routing";
const data: RoadData = {bounds:{south:-1,north:1,west:-1,east:1}, nodes:[[1,0,0],[2,0,0.001],[3,0,0.002],[4,0.001,0.001]], ways:[{refs:[1,2,3],name:"Rua A",kind:"residential"},{refs:[2,4],name:"Rua B",kind:"footway"}]};
describe("rotas offline", () => {
  it("segue ruas conectadas e agrupa nomes", () => {
    const route=findWalkingRoute(data,[0,0],[0.001,0.001]);
    expect(route?.points).toEqual([[0,0],[0,0.001],[0.001,0.001]]);
    expect(route?.instructions.map(i=>i.name)).toEqual(["Rua A","Rua B"]);
    expect(route?.distance).toBeGreaterThan(200);
  });
  it("não inventa conexões com ruas distantes", () => expect(findWalkingRoute(data,[0.1,0.1],[0,0])).toBeNull());
  it("não atravessa trechos sem dados", () => expect(findWalkingRoute({...data, ways:[{refs:[1,null,3],name:"",kind:"path"}]},[0,0],[0,0.002])).toBeNull());
  it("procura uma rua conectada quando o ponto mais próximo está isolado", () => {
    const roads:RoadData={...data,nodes:[[1,0,0],[2,0,0.00005],[3,0,0.0002],[4,0,0.002]],ways:[{refs:[1,2],name:"Trecho isolado",kind:"service"},{refs:[3,4],name:"Rua conectada",kind:"residential"}]};
    expect(findWalkingRoute(roads,[0,0],[0,0.002])?.instructions.map(step=>step.name)).toEqual(["Rua conectada"]);
  });
});
