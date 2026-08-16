/* ============================================================
   AQIQAT — тест интерфейса
   Проходит игру настоящими кликами в настоящем браузере на трёх
   языках, проверяет вёрстку на пяти ширинах и снимает экраны.

   Запуск:  node ui.js
   ============================================================ */

const puppeteer = require('puppeteer-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const GAME = require('url').pathToFileURL(path.join(__dirname, '..', 'index.html')).href;
const OUT = path.join(os.tmpdir(), 'aqiqat-shots');
fs.mkdirSync(OUT, { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));
let fails = 0, errs = [];

function check(name, cond, extra) {
  if (cond) console.log(`  ok   ${name}`);
  else { console.log(`  FAIL ${name}${extra ? '  — ' + extra : ''}`); fails++; }
}
function noErrors(step) {
  check(step + ': без ошибок в консоли', errs.length === 0, errs[0]);
  errs = [];
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--disable-gpu', '--hide-scrollbars']
  });
  const p = await browser.newPage();
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });

  const $ = (sel) => p.evaluate(s => !!document.querySelector(s), sel);
  const click = (sel) => p.evaluate(s => { const e = document.querySelector(s); if (e) e.click(); }, sel);
  const shot = (n) => p.screenshot({ path: path.join(OUT, n + '.png') });

  /* ---------- 1. полное прохождение ---------- */
  console.log('\n=== ПРОХОЖДЕНИЕ ===');
  await p.setViewport({ width: 1440, height: 940, deviceScaleFactor: 1 });
  await p.goto(GAME, { waitUntil: 'load' }); await wait(600);
  check('меню отрисовано', await $('#btn-begin'));
  await shot('01-menu');

  await click('#btn-begin'); await wait(700);
  check('пролог объясняет цель', await $('.pro-lines'));
  check('пролог показывает SENIM', await $('#pro-skip'));
  await shot('01b-prologue');
  await click('#pro-skip'); await wait(800);
  check('смена началась сразу, без теста', await $('.mapsvg'));
  check('Ерасыл — персонаж с диафрагмой', await $('.senim-eye'));
  /* Он теперь платный: до найма видна только цена, а мнения и
     точности нет вовсе. Это и проверяем. */
  check('Ерасыл до найма молчит', await $('#senim-hire') && !(await $('.senim-acc')));
  check('цена найма показана', await $('.hire-b .hb-c'));
  check('Андрей и Али на месте', (await p.evaluate(() => document.querySelectorAll('.npcb').length)) === 2);
  check('монеты видны в шапке', await $('.mini.kaya b'));
  check('инструмент стоит монет, а не минут',
    (await p.evaluate(() => document.querySelector('.tool .c').textContent)).indexOf('◈') === 0);
  check('карта: шесть посёлков', (await p.evaluate(() => document.querySelectorAll('.mvil').length)) === 6);
  check('карта: люди на месте', (await p.evaluate(() => document.querySelectorAll('.mped').length)) > 30);
  check('счётчик спасённых виден', await $('.saved .num b'));
  check('обучение ведёт за руку', await $('#coach.on') && await $('.tut-focus'));
  noErrors('старт');
  await shot('02-tutorial');

  /* подсказка должна стоять у своей цели, а не в углу экрана */
  const anchored = await p.evaluate(() => {
    const c = document.getElementById('coach').getBoundingClientRect();
    const t = document.querySelector('.tut-focus').getBoundingClientRect();
    return Math.abs((c.left + c.width / 2) - (t.left + t.width / 2)) < 220 && c.top > 40;
  });
  check('подсказка привязана к цели', anchored);

  /* Обучение: инструмент → связь → вердикт. Ночь собирается из
     вариантов, поэтому конкретные атомы каждый раз другие —
     идём туда, куда показывает сама подсказка. */
  const followCoach = async () => {
    const sel = await p.evaluate(() => {
      const t = document.querySelector('.tut-focus');
      if (!t) return null;
      if (t.dataset.t) return '.tool[data-t="' + t.dataset.t + '"]';
      if (t.dataset.a) return '#catoms .atom[data-a="' + t.dataset.a + '"]';
      if (t.dataset.ta) return '[data-ta="' + t.dataset.ta + '"]';
      return null;
    });
    if (sel) await click(sel);
    return sel;
  };

  await followCoach(); await wait(700);
  check('инструмент вернул результат', await $('[data-ta]'));
  await followCoach(); await wait(300);
  await followCoach(); await wait(700);
  check('противоречие засчитано', (await p.evaluate(() => document.querySelectorAll('.find').length)) === 1);
  await shot('03-finding');

  /* после вердикта сначала отыгрывает карта (штамп, камера),
     модалка приходит через ~1.5 секунды */
  await click('.vb.fake'); await wait(2100);
  check('последствие показано', await $('#m-ok'));
  await shot('04-consequence');
  await click('#m-ok'); await wait(900);
  noErrors('первое входящее');

  /* второе — подтверждение правды, оно же самый дорогой ход ночи */
  check('второе входящее открылось', (await p.evaluate(() => AQ.S.activeId)) === 'evac_qarasu');

  /* --- экономика KAYA на живом экране --------------------- */
  {
    const before = await p.evaluate(() => AQ.S.kaya.balance);
    await click('#senim-hire'); await wait(900);
    const after = await p.evaluate(() => AQ.S.kaya.balance);
    check('наём Ерасыла списал монеты', after === before - 20, `${before}→${after}`);
    check('Ерасыл принёс статью', await $('.senim-art .art-body'));
    check('репутация источника видна до текста', await $('.senim-art .art-rep'));
    check('он предупреждает, что может ошибаться', await $('.senim-caveat'));
    check('точность Ерасыла видна после найма', await $('.senim-acc'));
    await shot('05b-yerassyl');

    /* Андрей уходит и возвращается с наводкой — не с ответом. */
    const b2 = await p.evaluate(() => AQ.S.kaya.balance);
    await click('.npcb[data-npc="andrey"]'); await wait(3400);
    check('Андрей списал монеты', (await p.evaluate(() => AQ.S.kaya.balance)) === b2 - 12);
    check('наводка появилась в карточке', await $('.npch .nh-t'));
    const hint = await p.evaluate(() => document.querySelector('.npch .nh-t').textContent.toLowerCase());
    check('наводка не произносит вердикт',
      hint.indexOf('фейк') === -1 && hint.indexOf('правда') === -1 && hint.indexOf('fake') === -1);
    await shot('05c-npc');
  }

  await click('.vb.real'); await wait(2100);
  await click('#m-ok'); await wait(1000);
  const savedAfter = await p.evaluate(() => AQ.Game.savedNow(AQ.S));
  check('подтверждение правды подняло людей', savedAfter > 0, String(savedAfter));
  check('карта показывает эвакуацию', await $('.mvil.s-evacuating'));
  await shot('05-map-evacuating');

  /* карта отвечает на клик: зум и карточки объектов */
  await p.evaluate(() => AQ.MapView.camera.set(2.6, 56, 38, 0));
  await wait(700);
  check('зум меняет уровень детализации',
    (await p.evaluate(() => document.getElementById('mapbox').dataset.lod)) === '3');
  await shot('11-map-zoom');
  await p.evaluate(() => AQ.INSPECT.open('village', 'aqsu')); await wait(400);
  check('карточка посёлка открывается', await $('#inspect.on .i-title'));
  await p.evaluate(() => AQ.INSPECT.open('bridge', 'm36')); await wait(300);
  check('карточка моста открывается', await $('#inspect.on'));
  await p.evaluate(() => AQ.INSPECT.open('landmark', 'hospital')); await wait(300);
  check('карточка больницы открывается', await $('#inspect.on'));
  await shot('12-inspect');
  await p.evaluate(() => { AQ.INSPECT.close(); AQ.MapView.camera.reset(); }); await wait(600);
  noErrors('карта');

  /* третье — ловушка */
  check('третье входящее — ловушка', (await p.evaluate(() => AQ.S.activeId)) === 'aqsu_dam');
  await shot('06-trap');

  /* Ловушка теперь вариативна: в одних ночах улика поддельна и
     верен ответ «фейк → только фото», в других она подлинная и
     верен ответ «правда». Играем по факту, а не по памяти. */
  const damTruth = await p.evaluate(() => {
    const it = AQ.Game.item(AQ.S, 'aqsu_dam');
    return { vid: it.vid, photo: it.truth.photo };
  });
  console.log(`    вариант ловушки этой ночи: ${damTruth.vid} (фото ${damTruth.photo})`);

  if (damTruth.photo === 'fake') {
    await click('.vb.fake'); await wait(500);
    check('появился уточняющий вопрос', await $('.vcard.step2'));
    await shot('07-step2');
    await click('[data-p="photo"]'); await wait(2100);
  } else {
    await click('.vb.real'); await wait(2100);
  }
  const damGrade = await p.evaluate(() => AQ.S.resolved.aqsu_dam.grade);
  check('верный ход по ловушке засчитан', damGrade === 'right', damGrade);
  await click('#m-ok'); await wait(700);
  noErrors('ловушка');

  /* --- баг, из-за которого вердикт молча не срабатывал -----
     Слух истекает, пока игрок с ним работает: инструменты жгут
     время, окно закрывается, и до фикса экран просто
     сбрасывался — игрок жал «вердикт» и не получал ничего.
     Теперь игра обязана сказать об этом вслух. */
  {
    const gone = await p.evaluate(() => {
      const it = AQ.Game.item(AQ.S, AQ.S.activeId);
      if (!it) return null;
      AQ.Game.spend(AQ.S, it.expire - AQ.S.clock);
      return it.id;
    });
    await wait(800);
    const notice = await $('#m-ok');
    check('истёкшее входящее объявлено, а не проглочено молча', notice, String(gone));
    /* И сам вердикт по мертвецу тоже не должен молчать. */
    const silent = await p.evaluate(id => {
      const r = AQ.Game.publish(AQ.S, id, 'fake', 'both');
      return r && r.error === 'expired';
    }, gone);
    check('publish возвращает причину, а не null', silent);
    if (notice) { await click('#m-ok'); await wait(900); }
    noErrors('истёкшее входящее');
  }

  /* доигрываем до конца */
  let guard = 0;
  while (await $('.vb.real') && guard++ < 30) {
    await click('.vb.real'); await wait(1700);
    if (await $('#m-ok')) { await click('#m-ok'); await wait(600); }
  }
  check('смена завершилась, рассвет открыт', await $('.dawn'), 'guard=' + guard);
  noErrors('до рассвета');

  check('рассвет: крупный счёт людей', await $('.dbig b'));
  check('рассвет: рекорд в той же строке, что и счёт', await $('.dtop .drec'));
  check('рассвет: разбор вердиктов',
    (await p.evaluate(() => document.querySelectorAll('.lrow').length)) === (await p.evaluate(() => AQ.S.items.length)));
  /* Оценка складывается из двух вопросов; в разборе обязаны быть
     видны оба, иначе «наполовину» необъяснимо. */
  check('рассвет: видно и заявление, и улику', await $('.lrow .lw'));
  check('рассвет: цена в людях рядом со строкой', await $('.lrow .lp'));
  check('рассвет: сообщение Даны', await $('.dana-msg'));
  check('рассвет: доверял / заслуживал', await $('.ybox .yb-n'));
  check('рассвет: техническое свёрнуто', await p.evaluate(() => {
    const d = document.querySelector('.dmore'); return !!d && !d.open;
  }));
  check('рассвет: какая это была ночь — внутри раскрывашки', await $('.dmore .nightbox'));
  check('рассвет: сид и «та же ночь»', await $('#btn-sameseed'));
  check('рассвет: без теста нет блока d′', !(await $('.sdtbox')));

  /* Главное требование этого экрана: он читается целиком, без
     прокрутки страницы. */
  const dawnFits = await p.evaluate(() => ({
    page: document.documentElement.scrollHeight <= window.innerHeight + 1,
    buttons: document.querySelector('.again').getBoundingClientRect().bottom <= window.innerHeight + 1
  }));
  check('рассвет помещается без прокрутки страницы', dawnFits.page && dawnFits.buttons, JSON.stringify(dawnFits));
  await p.screenshot({ path: path.join(OUT, '08-dawn.png') });

  const html = await p.evaluate(() => document.getElementById('scr-dawn').innerHTML);
  check('нет незаменённых плейсхолдеров', !/\{[a-z]+\}/.test(html), (html.match(/\{[a-z]+\}/g) || []).join(','));
  check('нет undefined в разметке', html.indexOf('undefined') === -1);

  const line = await p.evaluate(() => AQ.DAWN.resultLine(AQ.S));
  check('строка результата собирается', !/undefined|NaN/.test(line) && line.split('\t').length >= 14);
  console.log('    ' + line.replace(/\t/g, '  '));

  /* ---------- 2. режим с тестом ---------- */
  console.log('\n=== РЕЖИМ «ИЗМЕРИТЬ СЕБЯ» ===');
  await p.goto(GAME + '?r=' + Math.random(), { waitUntil: 'load' }); await wait(500);
  await click('#btn-study'); await wait(600);
  await click('#pro-skip'); await wait(500);
  check('пре-тест открылся', await $('#ans-t'));
  for (let i = 0; i < 8; i++) { await click(i % 2 ? '#ans-t' : '#ans-f'); await wait(120); }
  check('после теста началась смена', await $('.mapsvg'));
  noErrors('режим теста');

  /* ---------- 3. языки ---------- */
  console.log('\n=== ЯЗЫКИ ===');
  for (const l of ['ru', 'kk', 'en']) {
    await p.evaluate(lang => AQ.setLang(lang), l);
    await wait(350);
    const ok = await p.evaluate(() => !!document.querySelector('.mapsvg') && !!document.querySelector('.vb.real'));
    check(`смена переживает переключение на ${l}`, ok);
  }
  noErrors('переключение языка');
  await p.evaluate(() => AQ.setLang('ru')); await wait(300);
  await shot('09-russian');

  /* ---------- 4. вёрстка ---------- */
  console.log('\n=== ВЁРСТКА ===');
  for (const v of [[1440, 940], [1180, 900], [820, 1100], [390, 844], [340, 740]]) {
    await p.setViewport({ width: v[0], height: v[1], deviceScaleFactor: 1 });
    await wait(400);
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = [];
      document.querySelectorAll('*').forEach(el => {
        if (el.closest('svg')) return;              // содержимое SVG обрезано кадром намеренно
        const b = el.getBoundingClientRect();
        if (b.width > vw + 1 || b.right > vw + 1) over.push(el.className || el.tagName);
      });
      return { vw, sw: document.documentElement.scrollWidth, over: over.slice(0, 4), n: over.length };
    });
    check(`${v[0]}px: нет горизонтального переполнения`, r.sw <= r.vw + 1 && r.n === 0,
      `scrollW=${r.sw} vw=${r.vw} ` + r.over.join(', '));
  }
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 }); await wait(400);
  await shot('10-phone');

  await browser.close();
  console.log('\nснимки: ' + OUT);
  console.log(fails === 0 ? '✔ ИНТЕРФЕЙС ПРОХОДИТСЯ ЦЕЛИКОМ\n' : `✘ ПРОВАЛЕНО: ${fails}\n`);
  process.exit(fails ? 1 : 0);
})();
