import { chromium } from '@playwright/test';
const browser=await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
const context=await browser.newContext({geolocation:{latitude:-23.6635,longitude:-46.5300,accuracy:15},permissions:['geolocation']});
const page=await context.newPage();
page.on('pageerror',error=>console.error('PAGE ERROR',error));
await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:4173'}/unidades`);
await page.evaluate(()=>navigator.serviceWorker.ready);
await page.getByLabel('Buscar por nome, rua ou bairro').fill('UPA Perimetral');
await page.getByRole('button',{name:'Rota a pé offline'}).click();
await page.getByRole('button',{name:'Baixar mapa offline'}).click();
await page.getByText('Mapa disponível neste aparelho.').waitFor({timeout:60000});
await context.setOffline(true);
await page.getByRole('button',{name:'Calcular rota a pé'}).click();
await page.getByText(/Trajeto estimado:/).waitFor({timeout:60000});
console.log('OFFLINE:',await page.getByText(/Trajeto estimado:/).innerText());
console.log('STEPS:',await page.locator('ol li').count());
await page.reload();
await page.getByLabel('Buscar por nome, rua ou bairro').fill('UPA Perimetral');
await page.getByRole('button',{name:'Rota a pé offline'}).click();
await page.getByText('Mapa disponível neste aparelho.').waitFor({timeout:20000});
await page.getByRole('button',{name:'Calcular rota a pé'}).click();
await page.getByText(/Trajeto estimado:/).waitFor({timeout:60000});
console.log('OFFLINE RELOAD AND CACHED ROUTING: OK');
await browser.close();



