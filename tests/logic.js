/* ============================================================
   AQIQAT — тест логики
   Запуск:  node logic.js   (или npm test из этой папки)

   Главное отличие от версии v3: ночь больше не одна. Она
   собирается из вариантов по сиду, а значит проверять надо не
   «ту ночь, которую я написал», а ВСЁ ПРОСТРАНСТВО ночей.

   Поэтому здесь три уровня защиты:
     1. каждый вариант в отдельности — правило зеркального рычага
     2. каждый вариант в полной ночи — идеальная игра ≥ 90 %
     3. 32 случайных сида × 6 стратегий — инварианты баланса
        обязаны держаться на КАЖДОМ сиде, а не в среднем
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

/* В браузере `window.AQ = ...` создаёт глобальную AQ, потому что window
   и есть глобальный объект. Воспроизводим это. */
const sandbox = { localStorage: { getItem: () => null, setItem: () => {} }, console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

/* Порядок важен: резолвер обязан существовать до того, как
   варианты попробуют в него дописаться. */
['content/villages.js', 'content/night01.js', 'js/scenario.js', 'content/variants01.js',
 'content/articles01.js', 'content/headlines.js', 'js/i18n.js', 'js/state.js']
  .forEach(f => {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) return;          // варианты могут ещё не существовать
    vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: f });
  });

const AQ = sandbox.window.AQ;
const G = AQ.Game;
const SC = AQ.SCENARIO;

let fails = 0;
function check(name, cond, extra) {
  if (cond) console.log(`  ok   ${name}`);
  else { console.log(`  FAIL ${name}${extra ? '  — ' + extra : ''}`); fails++; }
}
/* Тихая проверка: печатает только провалы. Нужна там, где
   проверок сотни (варианты × сиды) и лог иначе не читается. */
function quiet(name, cond, extra) {
  if (!cond) { console.log(`  FAIL ${name}${extra ? '  — ' + extra : ''}`); fails++; }
  return cond;
}

const CLAIM = ['true', 'fake', 'unresolved'];
const PHOTO = ['real', 'fake', 'none'];
const villageIds = AQ.MAP.villages.map(v => v.id);
const acts = SC.ensureActs(AQ.NIGHT);

/* Как выглядит ВЕРНЫЙ ход по данному входящему. Одна функция на
   весь файл: и симуляция идеальной игры, и проверка рычага
   обязаны понимать «правильно» одинаково. */
function correctMove(it) {
  const T = it.truth;
  if (T.claim === 'true')  return { call: T.photo === 'fake' ? 'fake' : 'real', part: T.photo === 'fake' ? 'photo' : null };
  if (T.claim === 'fake')  return { call: 'fake', part: T.photo === 'fake' ? 'both' : 'story' };
  return { call: 'unsure', part: null };
}

/* ============ 1. Целостность контента ============ */
console.log('\n=== КОНТЕНТ ===');

/* Верхняя граница не про красоту: смена конечна, и каждый акт
   сверх девяти означает, что до последнего входящего дойдут
   только те, кто почти не проверяет. */
check('от семи до десяти актов', acts.length >= 7 && acts.length <= 10, String(acts.length));

let variantCount = 0;
acts.forEach(a => {
  check(`${a.id}: есть хотя бы один вариант`, a.variants.length > 0);
  const vids = a.variants.map(v => v.vid || 'base');
  check(`${a.id}: vid уникальны`, new Set(vids).size === vids.length, vids.join(','));

  a.variants.forEach(v => {
    variantCount++;
    const it = SC.materialiseVid(AQ.NIGHT, a.id, v.vid || 'base');
    const tag = `${a.id}/${it.vid}`;

    const claimIds = it.claimAtoms.map(x => x.id);
    const toolIds = [];
    Object.keys(it.tools).forEach(t => {
      (it.tools[t].atoms || []).forEach(x => toolIds.push(x.id));
      if (!it.tools[t].blind && !(it.tools[t].atoms || []).length)
        quiet(`${tag}/${t}: не слепой, но без атомов`, false);
      if (it.tools[t].blind && !it.tools[t].note)
        quiet(`${tag}/${t}: слепой без пояснения`, false);
    });

    (it.findings || []).forEach(f => {
      const ok = (claimIds.includes(f.a) || toolIds.includes(f.a)) &&
                 (claimIds.includes(f.b) || toolIds.includes(f.b));
      quiet(`${tag}: находка ${f.a}|${f.b} ссылается на несуществующий атом`, ok);
      quiet(`${tag}: находка без EN`, !!(f.text && f.text.en));
    });

    quiet(`${tag}: truth валиден`, CLAIM.includes(it.truth.claim) && PHOTO.includes(it.truth.photo),
      JSON.stringify(it.truth));
    quiet(`${tag}: посёлок существует`,
      it.village === 'all' || it.village === 'route' || villageIds.includes(it.village), it.village);
    quiet(`${tag}: есть outcomes.right и .missed`, !!it.outcomes.right && !!it.outcomes.missed);
    quiet(`${tag}: SENIM даёт валидный вердикт`, ['real', 'fake', 'unsure'].includes(it.senim.verdict));

    /* На верный ход обязан быть заготовлен текст последствия. */
    const cm = correctMove(it);
    const wantKey = G.grade(it, cm.call, cm.part);
    quiet(`${tag}: нет текста на верный исход (${wantKey})`,
      !!(it.outcomes[wantKey] || (wantKey === 'partial' && it.outcomes.right)));

    ['en', 'ru', 'kk'].forEach(l => {
      quiet(`${tag}: нет текста на ${l}`, !!it.text[l]);
      quiet(`${tag}: нет «почему важно» на ${l}`, !!(it.why && it.why[l]));
    });

    /* Статья, которую приносит Ерасыл. Она платная, поэтому её
       целостность — вопрос честности, а не косметики. */
    const art = it.senim.article;
    quiet(`${tag}: Ерасылу нечего принести (нет статьи)`, !!art);
    if (art) {
      quiet(`${tag}: репутация статьи невалидна`,
        ['good', 'mixed', 'bad'].includes(art.reputation), String(art.reputation));
      /* Дата либо относительная (after — минуты после прихода
         входящего), либо абсолютная и осмысленно старая. Третьего
         не дано: без даты статья не читается как публикация. */
      quiet(`${tag}: у статьи нет даты`, art.after !== undefined || !!art.date);
      if (art.after !== undefined) {
        quiet(`${tag}: статья написана слишком поздно после события`,
          art.after >= 0 && art.after <= 30, String(art.after));
      }
      ['en', 'ru', 'kk'].forEach(l => {
        quiet(`${tag}: статья без источника на ${l}`, !!(art.source && art.source[l]));
        quiet(`${tag}: статья без текста на ${l}`, !!(art.text && art.text[l]));
      });
    }
  });
});
console.log(`\n  актов ${acts.length}, вариантов ${variantCount}, комбинаций ночи ${acts.reduce((s, a) => s * a.variants.length, 1)}`);

/* ---- Ерасыл обязан оставаться выгодным ------------------
   Он стоит монет. Если бы его статьи чаще уводили в сторону,
   чем помогали, единственной разумной стратегией стало бы
   никогда его не нанимать — и вся ветка контента умерла бы
   не будучи прочитанной. */
{
  let arts = [];
  acts.forEach(a => a.variants.forEach(v => { if (v.senim && v.senim.article) arts.push(v.senim.article); }));
  const helpful = arts.filter(x => x.matchesTruth !== false).length;
  const bad = arts.filter(x => x.reputation === 'bad').length;
  console.log(`  статей ${arts.length}: полезных ${helpful}, уводящих ${arts.length - helpful}, с плохой репутацией ${bad}`);
  check('статьи Ерасыла чаще помогают, чем мешают', helpful >= arts.length * 0.8, `${helpful}/${arts.length}`);
  check('мусорная репутация — редкость', bad <= arts.length * 0.15, `${bad}/${arts.length}`);
  /* Уводящая статья обязана быть честно помечена репутацией:
     игрок, читающий шапку, должен иметь шанс насторожиться. */
  const sneaky = arts.filter(x => x.matchesTruth === false && x.reputation === 'good');
  check('уводящая статья никогда не носит репутацию «надёжная»', sneaky.length === 0, String(sneaky.length));
}

['A', 'B'].forEach(set => {
  const t = AQ.HEADLINES[set].filter(h => h.truth).length;
  check(`набор ${set}: 4 истинных и 4 ложных`, t === 4 && AQ.HEADLINES[set].length === 8);
});

/* ============ 2. Правило зеркального рычага ============
   На актах массовой эвакуации ЛЮБОЙ вариант обязан быть
   устроен так, что верный ход поднимает людей: через stand,
   если заявление истинно, и через kill, если оно поддельно.
   Это то единственное правило, которое позволяет вариантам
   переворачивать правду, не ломая достижимость ста процентов. */
console.log('\n=== ЗЕРКАЛЬНЫЙ РЫЧАГ ===');

function standsFor(call, part) {
  if (call === 'real') return 'full';
  if (call === 'fake' && part === 'photo') return 'full';
  if (call === 'unsure') return 'weak';
  return 'no';
}

acts.forEach(a => {
  const lever = a.lever;
  if (!lever || lever.kind !== 'evacuate') return;

  /* Правило 2: произошло событие или нет — функция акта, а не
     вариация. Иначе слепое «всё фейк» однажды попадёт в
     правильный ответ и поднимет тысячи человек даром. */
  const claims = new Set(a.variants.map(v => v.truth.claim));
  check(`${a.id}: truth.claim одинаков во всех вариантах`, claims.size === 1,
    [...claims].join(','));

  a.variants.forEach(v => {
    const it = SC.materialiseVid(AQ.NIGHT, a.id, v.vid || 'base');
    const cm = correctMove(it);
    const st = standsFor(cm.call, cm.part);
    const eff = (st === 'no' ? (it.effect && it.effect.kill) : (it.effect && it.effect.stand)) || {};
    const list = eff.evacuate === 'all' ? villageIds : (eff.evacuate || []);
    const missing = lever.villages.filter(x => list.indexOf(x) === -1);

    quiet(`${a.id}/${it.vid}: верный ход (${cm.call}${cm.part ? '/' + cm.part : ''}) НЕ поднимает ${missing.join(',')}`,
      missing.length === 0);
  });
  check(`${a.id}: зеркальный рычаг держится на всех ${a.variants.length} вариантах`, true);
});

/* ============ 3. Карта достижима ============ */
console.log('\n=== КАРТА ===');

const reachable = new Set();
acts.forEach(a => a.variants.forEach(v => {
  ['stand', 'kill'].forEach(k => {
    const e = v.effect && v.effect[k];
    if (!e || !e.evacuate) return;
    (e.evacuate === 'all' ? villageIds : e.evacuate).forEach(x => reachable.add(x));
  });
}));
villageIds.forEach(id => check(`${id}: кто-то может его эвакуировать`, reachable.has(id)));
console.log(`  всего людей: ${AQ.MAP.totalPop}`);

AQ.MAP.villages.forEach(v => {
  check(`${v.id}: успевает уехать до воды при идеальном доверии`,
    v.evacMin * 1.0 < v.floodAt, `${v.evacMin} мин против ${v.floodAt}`);
});

/* ============ 4. Симуляция ============ */

function play(decide, seed, opts) {
  G.reset(false, seed);
  const S = AQ.S;
  S.phase = 'shift';
  if (opts && opts.force) {
    /* Подменить вариант конкретного акта, остальное оставить
       на волю сида — так проверяется каждый вариант внутри
       настоящей ночи, а не в вакууме. */
    const idx = S.items.findIndex(x => x.id === opts.force.act);
    const forced = SC.materialiseVid(AQ.NIGHT, opts.force.act, opts.force.vid);
    if (idx >= 0 && forced) S.items[idx] = forced;
  }
  G.spend(S, 0);

  let guard = 0;
  while (!G.isOver(S) && guard++ < 500) {
    let q = G.queue(S);
    if (!q.length) {
      const waiting = S.items.filter(it => !S.resolved[it.id] && it.arrive > S.clock);
      if (!waiting.length) break;
      G.spend(S, Math.max(1, Math.min(...waiting.map(it => it.arrive)) - S.clock));
      continue;
    }
    const it = q[0];
    S.opened[it.id] = S.opened[it.id] || { tools: {}, atoms: [], findings: [], senimSeen: true };
    const d = decide(S, it);
    if (d === 'nuke') G.takedown(S, it.id);
    else G.publish(S, it.id, d.call, d.part);
  }
  S.items.forEach(it => G.miss(S, it));
  S.clock = AQ.NIGHT.clock.length;
  G.settle(S);

  const saved = G.savedNow(S);
  return { S, saved, pct: Math.round(saved / AQ.MAP.totalPop * 100) };
}

const STRATEGIES = {
  perfect:  (S, it) => correctMove(it),
  cynic:    () => ({ call: 'fake', part: 'both' }),
  truster:  (S, it) => ({ call: it.senim.verdict, part: it.senim.part || 'both' }),
  holder:   () => ({ call: 'unsure', part: null }),
  gullible: () => ({ call: 'real', part: null }),
  censor:   () => 'nuke',

  /* Единственная стратегия, которая ТРАТИТ, — и потому
     единственная, на которой вообще видно экономику.

     Она копает как живой игрок: пробует инструменты подряд,
     пока не наткнётся на тот, что даёт улику по этому
     входящему. Иногда это первый же, иногда третий — и вот
     тут кошелёк и начинает решать. Нашёл улику — отвечает
     верно; кончились деньги раньше — отвечает верой, потому
     что именно так ведёт себя человек, которому нечем
     проверить.

     Остальные стратегии инструментов не касаются: они
     проверяют логику вердикта, а не деньги, и кошелёк на них
     не влияет. */
  budgeted: (S, it) => {
    const cost = G.kayaCfg().tool;
    const useful = {};
    (it.findings || []).forEach(f => { useful[f.a] = true; useful[f.b] = true; });

    for (const tid of ['reverse', 'geo', 'time', 'tree']) {
      if (!G.canAfford(S, cost)) break;
      const r = G.useTool(S, it.id, tid);
      if (r.error) break;
      if (!r.blind && (r.atoms || []).some(a => useful[a.id])) return correctMove(it);
    }
    /* Проверить не вышло — остаётся вера, как у всех. */
    return { call: 'real', part: null };
  }
};

/* ---- 4a. каждый вариант внутри полной ночи ---- */
console.log('\n=== КАЖДЫЙ ВАРИАНТ В ПОЛНОЙ НОЧИ ===');
let worstVariant = { pct: 999, tag: '' };
acts.forEach(a => {
  a.variants.forEach(v => {
    const vid = v.vid || 'base';
    const r = play(STRATEGIES.perfect, 'variantcheck-' + a.id + '-' + vid, { force: { act: a.id, vid: vid } });
    if (r.pct < worstVariant.pct) worstVariant = { pct: r.pct, tag: `${a.id}/${vid}` };
    quiet(`${a.id}/${vid}: идеальная игра спасает мало (${r.pct}%)`, r.pct >= 90, `${r.saved} чел`);
  });
});
check(`идеальная игра ≥ 90 % на каждом из ${variantCount} вариантов`,
  worstVariant.pct >= 90, `худший ${worstVariant.tag} = ${worstVariant.pct}%`);
console.log(`  худший вариант для идеальной игры: ${worstVariant.tag} — ${worstVariant.pct}%`);

/* ---- 4b. 32 сида × все стратегии ---- */
console.log('\n=== 32 СИДА × ' + Object.keys(STRATEGIES).length + ' СТРАТЕГИЙ ===');

const SEEDS = [];
for (let i = 0; i < 32; i++) SEEDS.push('s' + (i * 7919 + 13));

const agg = {};
Object.keys(STRATEGIES).forEach(k => (agg[k] = { min: 999, max: -1, sum: 0 }));
let seedFails = 0;

SEEDS.forEach(seed => {
  const r = {};
  Object.keys(STRATEGIES).forEach(k => {
    r[k] = play(STRATEGIES[k], seed);
    const a = agg[k];
    a.min = Math.min(a.min, r[k].pct);
    a.max = Math.max(a.max, r[k].pct);
    a.sum += r[k].pct;
  });

  const dumbest = Math.max(r.cynic.pct, r.holder.pct, r.gullible.pct, r.truster.pct);
  const ok =
    quiet(`сид ${seed}: идеальная игра ${r.perfect.pct}% (< 90)`, r.perfect.pct >= 90) &
    quiet(`сид ${seed}: циник ${r.cynic.pct}% (≥ 45)`, r.cynic.pct < 45) &
    quiet(`сид ${seed}: циник не вдвое хуже идеала`, r.cynic.saved * 2 < r.perfect.saved) &
    quiet(`сид ${seed}: осторожный ${r.holder.pct}% (≥ 70)`, r.holder.pct < 70) &
    quiet(`сид ${seed}: «верю всему» ${r.gullible.pct}% (≥ 70)`, r.gullible.pct < 70) &
    quiet(`сид ${seed}: тупая стратегия ${dumbest}% слишком близко к идеалу ${r.perfect.pct}%`,
      dumbest < r.perfect.pct - 25) &
    quiet(`сид ${seed}: цензор не обрушил свободу слова`, r.censor.S.meters.foe < 40) &
    quiet(`сид ${seed}: идеальная игра не дала лучший финал Даны`, G.danaGrade(r.perfect.S) === 'excellent');
  if (!ok) seedFails++;
});

console.log('\n  стратегия      мин   сред   макс');
Object.keys(STRATEGIES).forEach(k => {
  const a = agg[k];
  console.log(`  ${k.padEnd(12)} ${String(a.min).padStart(4)}% ${String(Math.round(a.sum / SEEDS.length)).padStart(5)}% ${String(a.max).padStart(5)}%`);
});
check(`инварианты баланса держатся на всех ${SEEDS.length} сидах`, seedFails === 0, `провалено сидов: ${seedFails}`);
check('циник спасает ноль на каждом сиде', agg.cynic.max === 0, `худший случай ${agg.cynic.max}%`);

/* ---- 4в. кошелёк не должен ни развязывать руки, ни душить ----
   Экономика KAYA удалась только если игрок с деньгами явно
   сильнее слепого и явно слабее всезнающего. Слишком щедро —
   валюта декоративна; слишком скудно — игра превращается в
   угадайку, где решает не мышление, а невезение.            */
{
  const b = agg.budgeted, best = Math.max(agg.cynic.max, agg.holder.max, agg.gullible.max);
  const avg = Math.round(b.sum / SEEDS.length);
  console.log(`\n  игрок с кошельком: ${b.min}–${b.max}% (сред. ${avg}%) против слепых ${best}% и идеала ${agg.perfect.min}%`);
  check('деньги дают преимущество над слепой игрой', avg > best, `${avg}% против ${best}%`);
  /* Ночь, где первый же инструмент всякий раз попадает в цель,
     случается — и тогда дотошный игрок берёт всё. Это хорошо и
     так задумано. Плохо было бы, если бы так выходило ОБЫЧНО:
     тогда исход решал бы кошелёк, а не голова. Поэтому смотрим
     на среднее, а не на лучший случай. */
  check('но обычно одних денег не хватает', avg < agg.perfect.min - 20, `${avg}% против ${agg.perfect.min}%`);
  check('кошелёк не решает всё сам: разброс велик', b.max - b.min > 20, `${b.min}–${b.max}%`);

  /* Прожить ночь на стартовом запасе нельзя, но и остаться без
     единой проверки — тоже: должно хватить на несколько. */
  const trial = play(STRATEGIES.budgeted, 'purse-check');
  const used = trial.S.profile.toolUses;
  const maxChecks = trial.S.items.length * 4;
  console.log(`  за ночь куплено проверок: ${used} из ${maxChecks} возможных, на руках осталось ◈${G.kayaBalance(trial.S)}`);
  check('кошелька хватает больше чем на две проверки', used > 2, String(used));
  check('но не на то, чтобы раскопать всё', used < maxChecks * 0.6, `${used}/${maxChecks}`);
}

/* ============ 5. Детерминизм и ветвление ============ */
console.log('\n=== СИД И ВЕТВЛЕНИЕ ===');

const a1 = SC.resolve(AQ.NIGHT, 'fixed-seed', {}).map(x => x.vid).join(',');
const a2 = SC.resolve(AQ.NIGHT, 'fixed-seed', {}).map(x => x.vid).join(',');
check('один сид даёт одну и ту же ночь', a1 === a2, a1 + ' vs ' + a2);

const diff = SEEDS.slice(0, 12).map(s => SC.resolve(AQ.NIGHT, s, {}).map(x => x.vid).join(','));
check('разные сиды дают разные ночи', new Set(diff).size > 1,
  `уникальных раскладов: ${new Set(diff).size} из 12`);

/* Ветвление проверяем только если варианты вообще объявили флаги. */
const anySets = acts.some(a => a.variants.some(v => v.sets));
const anyGated = acts.some(a => a.variants.some(v => v.requires || v.excludes));
if (anySets && anyGated) {
  const withFlag = SC.resolve(AQ.NIGHT, 'fixed-seed', { panic_high: true }).map(x => x.vid).join(',');
  check('флаг меняет расклад ночи', withFlag !== a1, a1 + ' vs ' + withFlag);
} else {
  console.log('  —    ветвление по флагам ещё не объявлено в контенте');
}

/* ============ 6. Ловушка Ақсу ============ */
console.log('\n=== ЛОВУШКА АҚСУ ===');
const dam = SC.materialiseVid(AQ.NIGHT, 'aqsu_dam', 'base');
check('заявление истинно, а улика поддельна',
  dam.truth.claim === 'true' && dam.truth.photo === 'fake');
check('SENIM ведёт в ловушку', dam.senim.verdict === 'fake' && dam.senim.part === 'both');
check('есть спасающая находка', (dam.findings || []).some(f => f.confirms && f.pivotal));
check('геолокация слепа', dam.tools.geo.blind === true);

check('«фейк → только фото» = верно', G.grade(dam, 'fake', 'photo') === 'right');
check('«фейк → сама новость» = ошибка', G.grade(dam, 'fake', 'story') === 'wrongFake');
check('«фейк → и то и другое» = ошибка', G.grade(dam, 'fake', 'both') === 'wrongFake');
check('«правда» = наполовину (поручился за фейковое фото)', G.grade(dam, 'real', null) === 'partial');
check('«не знаю» = слабо', G.grade(dam, 'unsure', null) === 'wrongUnsure');

/* Разница в людях между верным и неверным ходом — на каждом
   варианте ловушки, а не только на базовом. */
function damRun(vid, call, part) {
  G.reset(false, 'damcheck');
  const S = AQ.S; S.phase = 'shift';
  const idx = S.items.findIndex(x => x.id === 'aqsu_dam');
  const forced = SC.materialiseVid(AQ.NIGHT, 'aqsu_dam', vid);
  if (idx >= 0 && forced) S.items[idx] = forced;
  G.spend(S, 0);
  G.spend(S, 56);
  G.publish(S, 'aqsu_dam', call, part);
  S.clock = AQ.NIGHT.clock.length; G.settle(S);
  return Math.round(S.villages.aqsu.saved);
}

SC.variantsOf(AQ.NIGHT, 'aqsu_dam').forEach(vid => {
  const it = SC.materialiseVid(AQ.NIGHT, 'aqsu_dam', vid);
  const cm = correctMove(it);
  const right = damRun(vid, cm.call, cm.part);
  const wrong = damRun(vid, 'fake', 'story');
  console.log(`    ${vid}: верный ход (${cm.call}${cm.part ? '/' + cm.part : ''}) ${right} чел, ложное опровержение ${wrong} чел`);
  quiet(`aqsu_dam/${vid}: верный ход не спасает посёлок`, right >= 1100, String(right));
  quiet(`aqsu_dam/${vid}: ложное опровержение не губит посёлок`, wrong === 0, String(wrong));
});
check('ловушка работает на каждом варианте', true);

/* ============ 7. Экономика времени и монет ============
   Дефицит держат теперь не часы, а кошелёк. Время ушло в
   другую роль: оно решает, СКОЛЬКО входящих вообще попадёт в
   руки, а деньги — сколько из них удастся проверить.        */
console.log('\n=== ВРЕМЯ И МОНЕТЫ ===');
const N = AQ.NIGHT;
const possible = acts.length * 4;

/* Часы: сколько реального времени занимает забег. */
const pace = N.pace || 0.67;
const idleRun = N.clock.length / pace / 60;
console.log(`    смена ${N.clock.length} игр. мин · темп ${pace} мин/сек · без действий ${idleRun.toFixed(1)} реальных минут`);
check('забег укладывается в 6–11 реальных минут', idleRun >= 6 && idleRun <= 11, idleRun.toFixed(1));

/* Кошелёк: стартовый запас плюс всё, что можно заработать
   безошибочной игрой, против цены проверить вообще всё. */
const K = N.kaya;
const perfectPurse = K.start + acts.length * K.right;
const maxTools = Math.floor(perfectPurse / K.tool);
console.log(`    старт ◈${K.start} · проверка ◈${K.tool} · верно +${K.right} · ошибка ${K.wrong}`);
console.log(`    даже безошибочно: ~${maxTools} проверок из ${possible} (${Math.round(maxTools / possible * 100)}%)`);
check('триаж обязателен: даже идеальная игра не купит 60% проверок', maxTools < possible * 0.6, `${maxTools}/${possible}`);
check('но хотя бы по одной проверке на входящее хватает', maxTools >= acts.length, String(maxTools));
check('стартового запаса хватает на 2 проверки, но не на 3',
  K.start >= K.tool * 2 && K.start < K.tool * 3, String(K.start));
/* Если верный вердикт не окупает проверку, кошелёк умирает у
   всех без исключения и игра превращается в угадайку. */
check('верный вердикт окупает проверку', K.right > K.tool, `${K.right} > ${K.tool}`);
/* А если окупает слишком щедро — деньги перестают быть
   ограничением, и весь смысл валюты исчезает. */
check('но не больше чем в полтора раза', K.right <= K.tool * 1.5, `${K.right} <= ${K.tool * 1.5}`);

/* ============ 8. Сигнальная теория ============ */
console.log('\n=== СИГНАЛЬНАЯ ТЕОРИЯ ===');
const S1 = AQ.SDT.analyse(4, 0, 4, 4);
const S2 = AQ.SDT.analyse(2, 2, 4, 4);
const S3 = AQ.SDT.analyse(4, 4, 4, 4);
console.log(`    идеал  d'=${S1.d.toFixed(2)} c=${S1.c.toFixed(2)}`);
console.log(`    случай d'=${S2.d.toFixed(2)} c=${S2.c.toFixed(2)}`);
console.log(`    циник  d'=${S3.d.toFixed(2)} c=${S3.c.toFixed(2)}`);
check('идеальный ответ даёт высокую d′', S1.d > 2.5);
check('случайный даёт d′ ≈ 0', Math.abs(S2.d) < 0.01);
check('циник: d′ ≈ 0 при сильно отрицательном c', Math.abs(S3.d) < 0.01 && S3.c < -0.8);
check('d′ конечна на краях', isFinite(S1.d) && isFinite(S3.d));

console.log(fails === 0 ? '\n✔ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ\n' : `\n✘ ПРОВАЛЕНО: ${fails}\n`);
process.exit(fails ? 1 : 0);
