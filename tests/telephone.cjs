// Vérifie le site EN LIGNE (ou une adresse donnée) dans Chrome au format téléphone :
//  - aucune erreur dans la console ;
//  - aux 7 tailles de téléphone, les écrans d'exercice ne font pas défiler la page
//    et leurs boutons restent visibles ;
//  - un morceau appris en entier, une révision le lendemain, l'enchaînement, la récitation devant un adulte ;
//  - le plan du jour suit la date de récitation ;
//  - une poésie ajoutée par l'adulte fonctionne ;
//  - l'appli marche hors ligne après une première visite (site en ligne seulement).
// Usage : node tests/telephone.cjs [url]   (captures dans captures/)
const { chromium } = require('playwright');
const fs = require('fs');

const URL = process.argv[2] || 'https://lechampdelaurore-boop.github.io/par-coeur/';
const LIVE = !process.argv[2];
const SIZES = [[320, 568], [360, 640], [375, 667], [390, 664], [390, 844], [412, 780], [430, 932]];
const expectedCache = (fs.readFileSync('sw.js', 'utf8').match(/par-coeur-v\d+/) || [])[0];
const PREFS = JSON.stringify({ voix: false, son: false, anim: false, vibre: false });

let echec = false;
function note(ok, texte) { if (!ok) echec = true; console.log((ok ? 'OK   ' : 'ÉCHEC ') + texte); }

async function nouvellePage(browser, w, h, erreurs, prog) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  page.on('pageerror', e => erreurs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
  await page.addInitScript(([p, g]) => {
    if (sessionStorage.getItem('init')) return;
    sessionStorage.setItem('init', '1');
    localStorage.clear();
    localStorage.setItem('marc.parcoeur.prefs', p);
    if (g) localStorage.setItem('marc.parcoeur.prog', g);
  }, [PREFS, prog ? JSON.stringify(prog) : null]);
  await page.goto(URL + '?nocache=' + Date.now());
  await page.waitForFunction(() => window.__parcoeur);
  return page;
}
const etat = page => page.evaluate(() => __parcoeur.etat());
// La page ne défile pas et tous les boutons d'action sont dans l'écran
async function tient(page) {
  return page.evaluate(() => {
    const d = document.documentElement.scrollHeight - window.innerHeight;
    const hors = [...document.querySelectorAll('#jActions button')].filter(b => { const r = b.getBoundingClientRect(); return r.bottom > window.innerHeight + 1 || r.top < 0; }).length;
    const z = document.querySelector('#jZone').getBoundingClientRect().height;
    return { d, hors, z: Math.round(z) };
  });
}

(async () => {
  fs.mkdirSync('captures', { recursive: true });
  if (LIVE) {
    for (let i = 0; ; i++) {
      const live = await fetch(URL + 'sw.js?nocache=' + Date.now()).then(r => r.text()).catch(() => '');
      if (live.includes(expectedCache)) { console.log('Version en ligne : ' + expectedCache); break; }
      if (i >= 18) { console.log('Version en ligne différente de ' + expectedCache + ' après 3 min'); process.exit(1); }
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  const browser = await chromium.launch();

  // 1. Les 7 tailles. Morceau 5 (le plus long) avec le morceau 4 déjà su, pour voir aussi l'enchaînement.
  const dejaSu = { 'loup-agneau': { m: [0, 1, 2, 3].map(() => ({ niv: 4, box: 1, due: '2999-01-01' })).concat([4, 5, 6, 7].map(() => ({ niv: 0, box: 0, due: null }))), date: null, jour: null } };
  for (const [w, h] of SIZES) {
    const erreurs = [];
    const page = await nouvellePage(browser, w, h, erreurs, dejaSu);
    let pire = { d: 0, hors: 0, ou: '' }, petiteZone = 9999;
    const mesure = async ou => {
      const t = await tient(page);
      if (t.d > pire.d || t.hors > pire.hors) pire = { d: Math.max(t.d, pire.d), hors: Math.max(t.hors, pire.hors), ou };
      if (t.z < petiteZone) petiteZone = t.z;
      if (w === 320 || w === 390) await page.screenshot({ path: `captures/${w}x${h}-${ou}.png` });
    };
    await page.click('.tuile[data-m="4"]');
    await mesure('comprendre');
    await page.click('#aSuite'); await mesure('marche1');
    await page.click('#aSuite'); await mesure('marche2');
    await page.click('#aVerif'); await mesure('verifier');
    await page.click('#nSu'); await page.click('#aVerif'); await page.click('#nSu');
    await mesure('marche4');
    await page.click('#aVerif'); await page.click('#nSu');
    await mesure('trou');
    await page.click('.choix-mot >> nth=0'); await mesure('trou-reponse');
    await page.click('#aSuite'); await page.click('.choix-mot >> nth=0'); await page.click('#aSuite');
    await mesure('enchainer');
    await page.click('#aVerif'); await mesure('enchainer-verif');
    await page.click('#nSu');
    const e = await etat(page);
    await page.screenshot({ path: `captures/${w}x${h}-fin.png` });
    note(pire.d <= 0 && pire.hors === 0 && e.vue === 'vFin' && petiteZone >= 120 && !erreurs.length,
      `${w}×${h} : ${pire.d > 0 || pire.hors ? 'dépasse (' + pire.ou + ', ' + pire.d + ' px, ' + pire.hors + ' bouton(s) hors écran)' : 'tient sans défiler'}, zone de texte ≥ ${petiteZone} px, fin ${e.vue === 'vFin' ? 'atteinte' : 'non atteinte'}${erreurs.length ? ', erreurs : ' + erreurs.join(' / ') : ''}`);
    if (w === 390 && h === 844) {
      await page.click('#fSuite');
      await page.screenshot({ path: 'captures/accueil-390x844.png', fullPage: true });
    }
    await page.close();
  }

  // 2. Parcours complet : apprendre, réviser le lendemain, enchaîner, réciter devant un adulte
  {
    const erreurs = [];
    const page = await nouvellePage(browser, 390, 844, erreurs);
    const plan0 = await page.evaluate(() => __parcoeur.plan());
    note(plan0.join() === 'apprendre0', 'Premier jour : un seul morceau nouveau (' + plan0.join() + ')');
    await page.click('#bSeance');
    await page.click('#aSuite'); await page.click('#aSuite');
    // Marche 2 : « Pas encore » redescend d'une marche
    await page.click('#aVerif'); await page.click('#nPasEncore');
    note((await etat(page)).tache.marche === 1, '« Pas encore » redonne plus d\'aide (marche 1)');
    await page.click('#aSuite');
    for (let k = 0; k < 3; k++) { await page.click('#aVerif'); await page.click('#nSu'); }
    for (let k = 0; k < 2; k++) { await page.click('.choix-mot >> nth=0'); await page.click('#aSuite'); }
    let e = await etat(page);
    let pr = await page.evaluate(() => __parcoeur.prog());
    note(e.vue === 'vFin' && pr.m[0].niv === 4 && pr.m[0].box === 1 && pr.jour, 'Morceau 1 su, séance du jour notée');
    await page.click('#fSuite');
    note(await page.isVisible('text=Séance du jour faite'), 'Accueil : « Séance du jour faite »');

    await page.evaluate(() => __parcoeur.jours(1));
    const plan1 = await page.evaluate(() => __parcoeur.plan());
    note(plan1.join() === 'reviser0,apprendre1', 'Lendemain : révision du morceau 1 puis morceau 2 (' + plan1.join() + ')');
    await page.click('#bSeance');
    await page.click('#aVerif'); await page.click('#nSu');
    pr = await page.evaluate(() => __parcoeur.prog());
    note(pr.m[0].box === 2, 'Révision réussie : le morceau monte d\'une boîte (' + pr.m[0].box + ')');
    await page.click('#fSuite');
    await page.click('#aSuite'); await page.click('#aSuite');
    for (let k = 0; k < 3; k++) { await page.click('#aVerif'); await page.click('#nSu'); }
    for (let k = 0; k < 2; k++) { await page.click('.choix-mot >> nth=0'); await page.click('#aSuite'); }
    e = await etat(page);
    note(e.tache.etape === 'enchainer', 'Morceau 2 : on enchaîne avec le morceau 1');
    await page.click('#aVerif'); await page.click('#nSu');
    await page.click('#fSuite');

    await page.click('#bDepuis');
    await page.click('#aAdulte');
    await page.click('#jZone .ligne >> nth=1');
    await page.click('#aSuite'); await page.click('#aSuite');
    const txt = await page.textContent('#fTexte');
    pr = await page.evaluate(() => __parcoeur.prog());
    note(/5 vers sur 6/.test(txt) && pr.m[0].due && pr.m[1].box === 1, 'Récitation devant un adulte : « ' + txt + ' »');
    await page.screenshot({ path: 'captures/recitation-adulte.png' });
    note(!erreurs.length, 'Parcours sans erreur console' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
  }

  // 3. Le plan suit la date de récitation, et « Écouter » s'ouvre
  {
    const erreurs = [];
    const page = await nouvellePage(browser, 390, 844, erreurs);
    await page.click('#bDate');
    const dans3 = await page.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 3); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); });
    await page.fill('#dDateVal', dans3);
    await page.click('#dDateOk');
    const plan = await page.evaluate(() => __parcoeur.plan());
    note(plan.join() === 'apprendre0,apprendre1,apprendre2' && await page.isVisible('text=Récitation dans 3 jours'), 'Récitation dans 3 jours : 3 morceaux nouveaux par jour (' + plan.join() + ')');
    await page.click('#bEcouterTout');
    note((await etat(page)).vue === 'vEcoute' && (await page.locator('#eZone .ligne').count()) === 29, 'Écouter toute la poésie : 29 vers');
    await page.click('#bQuitter');
    const manquants = await page.evaluate(() => __parcoeur.mots());
    note(!manquants.length && !erreurs.length, 'Tous les mots expliqués sont bien dans le texte' + (manquants.length ? ' (introuvables : ' + manquants.join(', ') + ')' : ''));
    await page.close();
  }

  // 4. Une poésie ajoutée par l'adulte
  {
    const erreurs = [];
    const page = await nouvellePage(browser, 360, 640, erreurs);
    await page.click('#bPoesies');
    await page.fill('#aTitre', 'Essai');
    await page.fill('#aAuteur', 'Personne');
    await page.fill('#aTexte', 'Il pleut sur la ville\nLe ciel est tranquille\nLe chat dort au soleil\nIl fait un grand sommeil\n\nLa pluie tombe sans bruit\nSur le toit de la nuit');
    await page.click('#aAjouter');
    const n = await page.locator('.tuile').count();
    note(n === 2 && (await page.textContent('#pTitre')) === 'Essai', 'Poésie ajoutée : 2 morceaux, elle devient la poésie en cours');
    await page.click('.tuile[data-m="1"]');
    await page.click('#aSuite'); await page.click('#aSuite');
    for (let k = 0; k < 3; k++) { await page.click('#aVerif'); await page.click('#nSu'); }
    const tr = await page.evaluate(() => __parcoeur.trous());
    note(tr && tr.length === 2, 'Mots qui manquent créés tout seuls (' + (tr || []).map(t => t[1]).join(', ') + ')');
    note(!erreurs.length, 'Poésie ajoutée sans erreur console' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
  }

  // 5. Hors ligne (seulement sur le vrai site, en https)
  if (LIVE) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(URL);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForTimeout(1500);
    await ctx.setOffline(true);
    await page.reload();
    const ok = await page.waitForFunction(() => window.__parcoeur, null, { timeout: 8000 }).then(() => true).catch(() => false);
    note(ok, 'Marche hors ligne après une première visite');
    await ctx.close();
  }

  await browser.close();
  console.log(echec ? '\nAU MOINS UN ÉCHEC' : '\nTOUT EST BON');
  process.exit(echec ? 1 : 0);
})();
