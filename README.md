# Guia Socorro

Aplicativo de consulta de primeiros socorros e unidades de saúde de Santo André, com suporte offline após a primeira visita.

## Navegação offline

Na lista de unidades, os destinos com ponto conferido exibem “Rota a pé offline”. Com internet, abra um deles e baixe o mapa uma vez (aproximadamente 20 MB de armazenamento). Depois, o aplicativo pode calcular uma rota a pé e acompanhar a posição pelo GPS sem conexão. O usuário pode recalcular ou atualizar o mapa quando estiver conectado. O navegador pode remover arquivos armazenados quando faltar espaço.

A navegação é somente a pé; não calcula rotas para veículos, não oferece trânsito ao vivo ou orientação por voz e pode incluir escadas. Ela depende do sinal de GPS e de dados de mapa que podem estar incompletos. O trajeto é uma referência e não substitui a sinalização ou a observação das condições reais. Em emergências, ligue 192. As unidades sem posição suficientemente conferida continuam com endereço e telefone, sem botão de rota offline.

Os endereços foram consultados nas páginas de [unidades básicas](https://portais.santoandre.sp.gov.br/saude/unidades-basicas/) e [urgência e emergência](https://portais.santoandre.sp.gov.br/saude/urgencia-e-emergencia/) da Prefeitura em 03/11/2026. As posições habilitadas foram confrontadas com pontos e ruas do OpenStreetMap e, quando disponíveis, com registros do [CNES](https://datasus.saude.gov.br/cnes-estabelecimentos/) e podem representar o centro do estabelecimento, não a entrada exata. Atualize e confira endereços, situação e posições periodicamente.

O arquivo `public/roads-santo-andre.json` contém dados de ruas © [colaboradores do OpenStreetMap](https://www.openstreetmap.org/copyright), distribuídos sob a ODbL. Foi gerado a partir do extrato Sudeste de 03/11/2026 fornecido pela [Geofabrik](https://download.geofabrik.de/south-america/brazil/sudeste.html). O script `scripts/extract-osm.mjs` gera o recorte a partir do arquivo `.osm.pbf`: `node scripts/extract-osm.mjs caminho/do/extrato.osm.pbf`. Ao atualizar os dados, revise as regras para pedestres, os destinos e os testes, e altere o identificador do cache em `OfflineNavigation.tsx` e `route-worker.ts` para que o novo mapa possa ser baixado.

## Desenvolvimento

Execute `npm install`, `npm test` e `npm run build`. Para servir a versão compilada, execute `npm run preview`. O projeto inclui configuração de publicação na Vercel.

