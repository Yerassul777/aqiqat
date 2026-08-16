/* ============================================================
   AQIQAT — STATE
   ------------------------------------------------------------
   Состояние смены, карта, экономика времени, адаптивный
   Источник и математика сигнальной теории.

   Главная перемена v2: счёт идёт не в процентах доверия, а в
   людях. Доверие осталось, но превратилось из самоцели в
   множитель: чем меньше тебе верят, тем медленнее посёлок
   снимается с места после твоего вердикта.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.S = null;

/* ============================================================
   СИГНАЛЬНАЯ ТЕОРИЯ — d′ и c
   ------------------------------------------------------------
   d′ — способность ОТЛИЧАТЬ правду от лжи.
   c  — общая склонность считать всё ложью.

   Modirrousta-Galian & Higham (2023): ведущие игры про
   дезинформацию двигают c и не двигают d′. Мы считаем оба и
   показываем игроку разницу прямым текстом.
   ============================================================ */
AQ.SDT = (function () {

  function probit(p) {
    if (p <= 0) p = 1e-6;
    if (p >= 1) p = 1 - 1e-6;
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
             1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
             6.680131188771972e+01, -1.328068155288572e+01];
    var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
             -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
             3.754408661907416e+00];
    var pl = 0.02425, q, r;
    if (p < pl) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
             ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
    }
    if (p <= 1 - pl) {
      q = p - 0.5; r = q * q;
      return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
             (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
    }
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
            ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }

  /* Поправка Хаутуса (+0.5 / +1): на 4+4 пунктах без неё
     идеальный результат даёт бесконечность. */
  function analyse(hits, fa, nSignal, nNoise) {
    var H = (hits + 0.5) / (nSignal + 1);
    var F = (fa + 0.5) / (nNoise + 1);
    var zH = probit(H), zF = probit(F);
    return {
      hits: hits, fa: fa, nSignal: nSignal, nNoise: nNoise,
      hitRate: H, faRate: F,
      d: zH - zF, c: -0.5 * (zH + zF),
      correct: hits + (nNoise - fa), total: nSignal + nNoise
    };
  }

  return { probit: probit, analyse: analyse };
})();


/* ============================================================
   ИСТОЧНИК — противник, который читает твой стиль
   ============================================================ */
AQ.SOURCE = (function () {
  var MAX_MOVES = 1;   // в семи входящих больше одного хода не помещается

  function profile(S) {
    var p = S.profile;
    var decided = p.fake + p.real + p.unsure + p.takedown;
    if (decided < 3) return null;

    var scores = {
      trigger_happy: p.fake * 1.0 + p.blindFake * 1.6 - p.real * 0.5,
      senim_truster: p.senimFollow * 1.5 - p.toolUses * 0.35,
      censor:        p.takedown * 3.0,
      over_holder:   p.unsure * 1.6 - (p.fake + p.real) * 0.5
    };

    var best = null, bestV = 2.0;
    for (var k in scores) {
      if (scores[k] > bestV && S.injected.indexOf(k) === -1) { best = k; bestV = scores[k]; }
    }
    return best;
  }

  return {
    consider: function (S) {
      if (S.injected.length >= MAX_MOVES) return null;
      var kind = profile(S);
      if (!kind) return null;
      S.injected.push(kind);
      return kind;                       // текст уходит в сообщения, входящее не добавляем
    }
  };
})();


/* ============================================================
   СМЕНА
   ============================================================ */
AQ.Game = (function () {

  var N = function () { return AQ.NIGHT; };
  var M = function () { return AQ.MAP; };

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  function village(id) {
    var vs = M().villages;
    for (var i = 0; i < vs.length; i++) if (vs[i].id === id) return vs[i];
    return null;
  }

  function shuffle(a, rnd) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Сид ночи. Задать его явно можно двумя способами: параметром
     (тесты, кнопка «сыграть ту же ночь») или хешем в адресе
     (#seed=12345) — судьи на демо получают ровно ту же ночь. */
  function pickSeed(explicit) {
    if (explicit !== undefined && explicit !== null && explicit !== '') return String(explicit);
    try {
      var m = /seed=([A-Za-z0-9_-]+)/.exec(location.hash || '');
      if (m) return m[1];
    } catch (e) {}
    return String(Date.now() % 1000000);
  }

  /* Обучение — единственное, что помнится между заходами помимо
     рекордов. Хранилище может быть недоступно (file://, приватный
     режим) — тогда просто показываем обучение снова. */
  function tutorialSeen() {
    try { return localStorage.getItem('aqiqat_tutorial_seen') === '1'; }
    catch (e) { return false; }
  }

  function newState(withTest, explicitSeed) {
    var seed = pickSeed(explicitSeed);
    var rnd = AQ.SCENARIO.mulberry32(AQ.SCENARIO.hashStr('pre|' + seed));

    var preSet = rnd() < 0.5 ? 'A' : 'B';
    var postSet = preSet === 'A' ? 'B' : 'A';

    var villages = {};
    M().villages.forEach(function (v) {
      villages[v.id] = {
        id: v.id, status: 'calm',
        evacStart: null, progress: 0, speedup: false, cap: 1,
        saved: 0, locked: false, rumour: false, pending: false,
        /* Доверие теперь живёт в каждом посёлке отдельно. Ошибся
           по слуху про Қарасу — медленнее выходит именно Қарасу.
           Это и есть «карта как симуляция доверия». */
        trust: v.trust,
        /* Паника — второй местный параметр. В панике людей хуже
           слушают: посёлок выходит медленнее, даже если верит. */
        panic: 10
      };
    });

    return {
      phase: 'menu',
      withTest: !!withTest,
      clock: 0,
      clockFrac: 0,
      /* Ночь собирается из вариантов по сиду. Форма входящего
         та же, что была, — весь код ниже об этом не знает. */
      items: AQ.SCENARIO.resolve(N(), seed, {}),
      flags: {},
      activeId: null,
      resolved: {},
      opened: {},
      villages: villages,
      /* Больница: заполняется эвакуированными. Переполнение
         отменяет ускорение — лодкам некуда везти людей. */
      hospital: { beds: 213, taken: 0 },
      /* Монеты KAYA: бюджет проверок на ночь. Тратятся на
         инструменты, на Ерасыла и на обход дворов; возвращаются
         только за верные вердикты. */
      kaya: { balance: (N().kaya && N().kaya.start) || 40, spent: 0, earned: 0 },
      routeBlocked: false,
      meters: { cred: 70, foe: 100 },
      profile: { fake: 0, real: 0, unsure: 0, blindFake: 0, takedown: 0, senimFollow: 0, toolUses: 0 },
      injected: [],
      messages: [],
      danaSent: 0,
      aigerimSent: 0,
      senimShown: 0,
      senimChecked: 0,
      /* Обучение показывается один раз в жизни, а не в каждом
         заходе. Второй забег начинается сразу с работы: игрок,
         который пришёл бить рекорд, уже знает, куда жать. */
      tutorialStep: tutorialSeen() ? 99 : 0,
      pre:  { set: preSet,  answers: [], order: shuffle(AQ.HEADLINES[preSet].slice(), rnd) },
      post: { set: postSet, answers: [], order: shuffle(AQ.HEADLINES[postSet].slice(), rnd) },
      lastSettle: 0,
      startedAt: Date.now(),
      seed: seed
    };
  }

  /* ---- время -------------------------------------------- */

  function timeLeft(S) { return N().clock.length - S.clock; }

  function spend(S, minutes) {
    S.clock = Math.min(N().clock.length, S.clock + minutes);
    settleVillages(S);
    expireItems(S);
    markPending(S);
    pushMessages(S);
  }

  /* Пассивный ход времени. Отдельная функция, а не второй
     механизм: она отдаёт минуты тому же spend(), поэтому вода,
     эвакуация, истечение слухов и сообщения Даны работают
     одинаково независимо от того, двигал ли стрелку игрок или
     она шла сама. Дробные минуты копятся в S.clockFrac, иначе
     на маленьком шаге таймера всё округлялось бы в ноль и часы
     стояли бы. */
  function tick(S, minutes) {
    if (!S || minutes <= 0) return 0;
    var acc = (S.clockFrac || 0) + minutes;
    var whole = Math.floor(acc);
    S.clockFrac = acc - whole;
    if (whole > 0) spend(S, whole);
    return whole;
  }

  /* ---- монеты KAYA --------------------------------------- */

  function kayaCfg() { return N().kaya || {}; }
  function kayaBalance(S) { return (S && S.kaya) ? S.kaya.balance : 0; }
  function canAfford(S, n) { return kayaBalance(S) >= n; }

  function spendKaya(S, n) {
    if (!S.kaya || !canAfford(S, n)) return false;
    S.kaya.balance -= n;
    S.kaya.spent += n;
    return true;
  }

  /* Монеты уходят в минус только на бумаге: баланс не бывает
     отрицательным, но штраф всё равно списывается полностью с
     того, что было. Иначе игрок с пустым кошельком ошибался бы
     бесплатно. */
  function earnKaya(S, n) {
    if (!S.kaya) return 0;
    var before = S.kaya.balance;
    S.kaya.balance = Math.max(0, before + n);
    var d = S.kaya.balance - before;
    if (d > 0) S.kaya.earned += d;
    return d;
  }

  /* Часы ночи из смещения в минутах. Отдельно от clockLabel,
     потому что подписывать временем нужно не только «сейчас»:
     статья, которую приносит Ерасыл, обязана быть датирована
     относительно события, о котором она написана, а не жить в
     будущем. Одно форматирование на всю игру. */
  function clockAt(minutes) {
    /* Отрицательное смещение — это «до начала смены», и оно
       осмысленно: пост мог быть опубликован в 22:47, а до стола
       дойти в 23:00. */
    var t = N().clock.start + Math.round(minutes);
    t = ((t % 1440) + 1440) % 1440;
    var h = Math.floor(t / 60), m = t % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  function clockLabel(S) { return clockAt(S.clock); }

  /* Когда рвётся дамба. Раньше здесь стояла отдельная константа
     170, ни с чем не связанная, — и в итоге на карте дамба ещё
     цела, когда пост о прорыве уже пришёл, а статья о нём
     датирована часом позже, чем идут часы. Теперь это ОДИН
     момент: дамбу прорывает тогда, когда об этом приходит
     входящее. Мир и лента новостей рассказывают одно и то же. */
  var damAtCache = null;
  function damAt() {
    if (damAtCache === null) {
      var a = AQ.SCENARIO && AQ.SCENARIO.act(N(), 'aqsu_dam');
      damAtCache = a && a.arrive !== undefined ? a.arrive : 170;
    }
    return damAtCache;
  }
  function damBroken(S) { return S.clock >= damAt(); }

  /* ---- вода и эвакуация ---------------------------------- */

  function waterLevel(S) {
    var c = M().waterCurve, t = S.clock;
    for (var i = 0; i < c.length - 1; i++) {
      if (t <= c[i + 1].at) {
        var span = c[i + 1].at - c[i].at || 1;
        var f = (t - c[i].at) / span;
        return c[i].level + (c[i + 1].level - c[i].level) * f;
      }
    }
    return c[c.length - 1].level;
  }

  /* Сколько посёлков сейчас в движении. Нужен и механике
     (затор), и карте (очередь точек перед мостом). */
  function bridgeLoad(S) {
    var n = 0;
    for (var k in S.villages) {
      var st = S.villages[k];
      if (st.status === 'evacuating' && !st.locked) n++;
    }
    return n;
  }

  /* Сколько минут посёлок реально уезжает.
     Дорога перекрыта — дольше. ЭТОМУ посёлку не верят — дольше.
     Мост забит четырьмя колоннами разом — дольше.
     Пришли лодки — быстрее. */
  function effectiveEvac(S, v) {
    var st = S.villages[v.id];
    var m = v.evacMin;
    if (S.routeBlocked) m *= 1.6;
    m *= 1.30 - 0.30 * (st.trust / 100);
    if (bridgeLoad(S) >= 4) m *= 1.12;      // затор у моста М-36
    if ((st.panic || 0) >= 70) m *= 1.15;   // в панике инструкции не работают
    /* Лодки помогают, только пока их есть куда разгружать. */
    if (st.speedup && !hospitalFull(S)) m *= 0.7;
    return m;
  }

  function hospitalFull(S) {
    var h = S.hospital;
    return !!h && h.taken >= h.beds;
  }

  /* Паника: растёт от необработанных слухов и от беды у соседа,
     оседает сама, если её ничем не подкармливать. */
  function settlePanic(S, dt) {
    if (dt <= 0) return;
    var pend = {};
    queue(S).forEach(function (it) {
      if (it.village === 'all') { for (var k in S.villages) pend[k] = true; }
      else if (S.villages[it.village]) pend[it.village] = true;
    });
    var anyFlooded = false;
    for (var id in S.villages) if (S.villages[id].status === 'flooded') anyFlooded = true;

    M().villages.forEach(function (v) {
      var st = S.villages[v.id];
      var d = -0.06 * dt;                                  // само оседает
      if (pend[v.id]) d += 0.20 * dt;                      // слух без ответа
      if (anyFlooded && !st.locked) d += 0.10 * dt;        // сосед утонул
      if (v.floodAt - S.clock < 60 && !st.locked) d += 0.14 * dt;
      st.panic = clamp((st.panic || 0) + d, 0, 100);
    });
  }

  /* Вердикт двигает доверие того посёлка, которого он касался.
     Ошибка бьёт по нему сильно и слегка задевает остальных —
     слухи о службе тоже расходятся по дорогам. */
  /* Возвращает, у КОГО и НАСКОЛЬКО изменилось доверие. Раньше
     функция молчала, и игрок видел в модалке только голое
     «−14» — без имени посёлка и без причины. Число без адресата
     не объясняет ничего. */
  function applyTrust(S, it, g) {
    var ids = (it.village === 'all' || it.village === 'route')
      ? Object.keys(S.villages) : [it.village];
    var broad = ids.length > 1;
    var moved = [];

    function bump(id, d) {
      var st = S.villages[id];
      if (!st || !d) return;
      var before = st.trust;
      st.trust = clamp(st.trust + d, 5, 100);
      var real = Math.round(st.trust - before);
      if (real) moved.push({ id: id, delta: real, target: ids.indexOf(id) !== -1 });
    }

    /* Верный вердикт сбивает панику: людям сказали, что знают. */
    function calm(id, d) {
      var st = S.villages[id];
      if (st) st.panic = clamp((st.panic || 0) + d, 0, 100);
    }
    if (g === 'right' || g === 'partial') ids.forEach(function (id) { calm(id, -18); });
    else if (g === 'wrongFake' || g === 'wrongTrue') ids.forEach(function (id) { calm(id, 22); });

    if (g === 'right')            ids.forEach(function (id) { bump(id, broad ? 6 : 10); });
    else if (g === 'partial')     ids.forEach(function (id) { bump(id, 4); });
    else if (g === 'wrongFake' || g === 'wrongTrue') {
      for (var k in S.villages) bump(k, ids.indexOf(k) !== -1 ? -14 : -5);
    }
    else if (g === 'wrongUnsure') ids.forEach(function (id) { bump(id, -5); });
    else if (g === 'missed')      ids.forEach(function (id) { bump(id, -6); });
    else if (g === 'takedown')  { for (var j in S.villages) bump(j, -6); }

    return moved;
  }

  function evacProgress(S, id) {
    var st = S.villages[id];
    return st ? st.progress : 0;
  }

  /* Эвакуация НАКАПЛИВАЕТСЯ, а не пересчитывается от текущих
     условий. Это принципиально: если считать прогресс формулой
     (сейчас − старт) / скорость, то любое позднее событие
     переписывает уже прожитое — вторая остановка сдвигает точку
     заморозки вперёд, а приехавшие лодки задним числом ускоряют
     тех, кто уже утонул. Здесь прошлое зафиксировано, меняется
     только скорость будущего. */
  function settleVillages(S) {
    var dt = S.clock - (S.lastSettle || 0);
    S.lastSettle = S.clock;

    M().villages.forEach(function (v) {
      var st = S.villages[v.id];
      if (st.locked) return;

      if (dt > 0 && st.status === 'evacuating' && st.evacStart !== null && S.clock > st.evacStart) {
        /* засчитываем только ту часть шага, что прошла после старта
           и до прихода воды */
        var from = Math.max(S.clock - dt, st.evacStart);
        var to = Math.min(S.clock, v.floodAt);
        if (to > from) st.progress = clamp(st.progress + (to - from) / effectiveEvac(S, v), 0, st.cap);
      }

      st.saved = v.pop * st.progress;
      if (st.progress >= 1) { st.status = 'evacuated'; st.locked = true; st.saved = v.pop; }
      else if (S.clock >= v.floodAt) { st.status = 'flooded'; st.locked = true; }
    });

    settlePanic(S, dt);

    /* Приёмный покой наполняется по мере прибытия людей. */
    if (S.hospital) {
      var arrived = 0;
      M().villages.forEach(function (v) { arrived += S.villages[v.id].saved; });
      S.hospital.taken = Math.round(arrived * 0.07);
    }
  }

  function savedNow(S) {
    var t = 0;
    M().villages.forEach(function (v) {
      var st = S.villages[v.id];
      t += st.locked ? st.saved : v.pop * evacProgress(S, v.id);
    });
    return Math.round(t);
  }

  /* ---- очередь ------------------------------------------- */

  function queue(S) {
    return S.items.filter(function (it) {
      return S.clock >= it.arrive && S.clock < it.expire && !S.resolved[it.id];
    }).sort(function (a, b) { return a.arrive - b.arrive; });
  }

  function item(S, id) {
    for (var i = 0; i < S.items.length; i++) if (S.items[i].id === id) return S.items[i];
    return null;
  }

  /* Какие посёлки сейчас под слухом — чтобы карта пульсировала. */
  function markPending(S) {
    for (var k in S.villages) { S.villages[k].pending = false; S.villages[k].rumour = false; }
    queue(S).forEach(function (it) {
      if (it.village === 'all') {
        for (var k in S.villages) S.villages[k].pending = true;
      } else if (S.villages[it.village]) {
        S.villages[it.village].pending = true;
      }
    });
  }

  function miss(S, it) {
    if (S.resolved[it.id]) return null;
    var r = { missed: true, call: null, part: null };
    S.resolved[it.id] = r;
    applyMeters(S, it, 'missed');
    applyTrust(S, it, 'missed');
    return r;
  }

  function expireItems(S) {
    S.items.forEach(function (it) { if (S.clock >= it.expire) miss(S, it); });
  }

  function pushMessages(S) {
    N().dana.forEach(function (m, i) {
      if (i >= S.danaSent && S.clock >= m.at) {
        S.messages.push({ who: 'dana', text: AQ.L(m.text), time: clockLabel(S) });
        S.danaSent = i + 1;
        if (AQ.onMessage) AQ.onMessage('dana');
      }
    });
    N().aigerim.forEach(function (m, i) {
      if (i >= S.aigerimSent && S.clock >= m.at) {
        S.messages.push({ who: 'aigerim', text: AQ.L(m.text), time: clockLabel(S) });
        S.aigerimSent = i + 1;
        if (AQ.onMessage) AQ.onMessage('aigerim');
      }
    });
  }

  /* ---- инструменты --------------------------------------- */

  function useTool(S, itemId, toolId) {
    var it = item(S, itemId);
    if (!it) return { error: 'no-item' };
    /* Слух мог истечь, пока игрок возился с предыдущей проверкой.
       Раньше этого никто не проверял: инструменты продолжали
       работать по мёртвому входящему, а вердикт по нему потом
       молча не срабатывал. */
    if (S.resolved[itemId]) return { error: 'expired' };
    var st = S.opened[itemId] = S.opened[itemId] || { tools: {}, atoms: [], findings: [], senimSeen: false };
    if (st.tools[toolId]) return { error: 'used' };
    if (timeLeft(S) < N().cost.tool) return { error: 'no-time' };
    if (!canAfford(S, kayaCfg().tool)) return { error: 'no-kaya' };

    spendKaya(S, kayaCfg().tool);
    spend(S, N().cost.tool);
    S.profile.toolUses++;

    var def = it.tools[toolId] || { blind: true };
    var res = { tool: toolId, blind: !!def.blind, atoms: def.atoms || [], note: def.note || null };
    st.tools[toolId] = res;
    res.atoms.forEach(function (a) { if (st.atoms.indexOf(a.id) === -1) st.atoms.push(a.id); });
    return res;
  }

  /* ---- механика противоречий ----------------------------- */

  function tryPair(S, itemId, claimAtom, toolAtom) {
    var it = item(S, itemId), st = S.opened[itemId];
    if (!it || !st) return { ok: false };
    for (var i = 0; i < (it.findings || []).length; i++) {
      var f = it.findings[i];
      if ((f.a === claimAtom && f.b === toolAtom) || (f.a === toolAtom && f.b === claimAtom)) {
        var key = f.a + '|' + f.b;
        if (st.findings.indexOf(key) !== -1) return { ok: true, already: true, finding: f };
        st.findings.push(key);
        return { ok: true, finding: f, corroborates: !!f.confirms, pivotal: !!f.pivotal };
      }
    }
    return { ok: false };
  }

  /* ============================================================
     ВЕРДИКТ — два шага, по одному вопросу за раз
     ------------------------------------------------------------
     call: 'real' | 'fake' | 'unsure'
     part: 'photo' | 'story' | 'both'   (только при call === 'fake')

     Ключевое: «фейк, но только фото» НЕ убивает заявление.
     Именно в этой разнице живёт вся идея игры.
     ============================================================ */

  function claimStands(call, part) {
    if (call === 'real') return 'full';
    if (call === 'fake' && part === 'photo') return 'full';
    if (call === 'unsure') return 'weak';       // люди колеблются, выезжают позже
    return 'no';
  }

  function grade(it, call, part) {
    var T = it.truth;

    if (T.claim === 'true') {
      if (call === 'fake' && part === 'photo') return T.photo === 'fake' ? 'right' : 'partial';
      if (call === 'real') return T.photo === 'fake' ? 'partial' : 'right';
      if (call === 'unsure') return 'wrongUnsure';
      return 'wrongFake';
    }
    if (T.claim === 'fake') {
      if (call === 'fake') {
        if (part === 'photo') return 'partial';        // поймал улику, пропустил ложь
        /* «И то и другое» на подлинной улике — это обвинение
           настоящего документа в подделке. Заявление разобрано
           верно, улика оболгана: половина работы. */
        if (part === 'both' && T.photo !== 'fake') return 'partial';
        return 'right';
      }
      if (call === 'real') return 'wrongTrue';
      return 'wrongUnsure';
    }
    /* unresolved */
    if (call === 'unsure') return 'right';
    /* Заявление проверить нельзя, но приложенная к нему улика
       поддельна — отметить это честно и не убить при этом само
       заявление тоже работа, хоть и не полная. */
    if (call === 'fake') return (part === 'photo' && T.photo === 'fake') ? 'partial' : 'wrongFake';
    return 'wrongTrue';
  }

  function applyMeters(S, it, g) {
    var d = 0;
    if (g === 'missed')          d = it.stake === 'critical' ? -7 : -4;
    else if (g === 'right')      d = 9;
    else if (g === 'partial')    d = 3;
    else if (g === 'wrongFake')  d = -18;      // ложная тревога — самая дорогая ошибка
    else if (g === 'wrongTrue')  d = -14;
    else if (g === 'wrongUnsure')d = -4;
    else if (g === 'takedown')   d = -6;
    S.meters.cred = clamp(S.meters.cred + d, 0, 100);
    return d;
  }

  /* Монеты за вердикт. Верный ход окупает проверку и немного
     сверху, ошибка забирает целую проверку. «Не знаю» там, где
     это правильный ответ, оплачивается как правильный ответ —
     иначе честная осторожность разоряла бы. */
  function applyKaya(S, g) {
    var k = kayaCfg(), d = 0;
    if (g === 'right')            d = k.right;
    else if (g === 'partial')     d = k.partial;
    else if (g === 'wrongFake' || g === 'wrongTrue' || g === 'wrongUnsure') d = k.wrong;
    else if (g === 'takedown')    d = k.wrong;
    else if (g === 'missed')      d = k.missed || 0;
    if (!d) return 0;
    earnKaya(S, d);
    return d;
  }

  /* g — оценка хода. Нужна, чтобы не штрафовать за «не знаю» там,
     где «не знаю» и есть правильный ответ: воздержаться на
     принципиально непроверяемом заявлении — это работа, а не
     нерешительность, и эскалация дежурному работает в полную силу. */
  function applyEffect(S, it, stands, g) {
    var eff = (stands === 'no') ? (it.effect && it.effect.kill) : (it.effect && it.effect.stand);
    if (!eff) return;
    var hesitant = stands === 'weak' && g !== 'right';
    var delay = hesitant ? 45 : 0;

    if (eff.routeBlock) S.routeBlocked = true;

    (function (list) {
      if (!list) return;
      var ids = list === 'all' ? Object.keys(S.villages) : list;
      ids.forEach(function (id) {
        var st = S.villages[id];
        if (!st || st.locked) return;
        if (st.evacStart === null) {
          st.evacStart = S.clock + delay;
          st.status = 'evacuating';
          /* «Мы не смогли проверить» поднимает с места не всех:
             часть остаётся ждать, пока кто-нибудь скажет прямо.
             Поэтому воздержание — честный ход, но не бесплатный. */
          st.cap = hesitant ? 0.55 : 1;
        } else {
          if (st.status === 'halted') st.status = 'evacuating';   // прогресс продолжится с того же места
          if (!hesitant) st.cap = 1;      // позже подтвердили — сомнения сняты
        }
      });
    })(eff.evacuate);

    (function (list) {
      if (!list) return;
      var ids = list === 'all' ? Object.keys(S.villages) : list;
      ids.forEach(function (id) {
        var st = S.villages[id];
        if (!st || st.locked || st.evacStart === null) return;
        st.status = 'halted';   // прогресс замирает там, где был
      });
    })(eff.halt);

    (function (list) {
      if (!list) return;
      list.forEach(function (id) { if (S.villages[id]) S.villages[id].speedup = true; });
    })(eff.speedup);
  }

  function publish(S, itemId, call, part) {
    var it = item(S, itemId);
    if (!it) return { error: 'no-item' };
    /* Раньше здесь стоял голый return null, и интерфейс не мог
       отличить «двойной клик» от «слух истёк, пока ты думал».
       Игрок видел, что вердикт просто не сработал, и считал это
       поломкой — справедливо. Теперь причина возвращается. */
    if (S.resolved[itemId]) {
      return { error: S.resolved[itemId].missed ? 'expired' : 'already' };
    }

    var st = S.opened[itemId] || { tools: {}, findings: [], senimSeen: false };
    var g = grade(it, call, part);
    var stands = claimStands(call, part);

    /* «Пошёл за Ерасылом» засчитывается только если игрок его
       вообще нанимал. Совпасть с мнением, которого ты не видел,
       — не доверие, а случайность, и на рассвете это испортило
       бы главное сравнение ночи. */
    var sawSenim = !AQ.SENIM || AQ.SENIM.hiredOn(S, itemId);
    var followedSenim = sawSenim && it.senim && it.senim.verdict === call &&
      (call !== 'fake' || !it.senim.part || it.senim.part === part);

    var r = {
      call: call, part: part || null, grade: g,
      findings: st.findings.slice(), tools: Object.keys(st.tools),
      missed: false, removed: false,
      followedSenim: !!followedSenim,
      blind: st.findings.length === 0
    };
    S.resolved[itemId] = r;

    if (call === 'fake')       { S.profile.fake++;   if (!st.findings.length) S.profile.blindFake++; }
    else if (call === 'real')  S.profile.real++;
    else                       S.profile.unsure++;
    if (r.followedSenim) S.profile.senimFollow++;
    if (st.findings.length && st.senimSeen) S.senimChecked++;

    r.credDelta = applyMeters(S, it, g);
    r.kayaDelta = applyKaya(S, g);
    r.trustMoved = applyTrust(S, it, g);
    applyEffect(S, it, stands, g);

    /* Ветвление: исход выставляет флаги, флаги пересобирают те
       акты, которые ещё не наступили. Прожитое неприкосновенно,
       а будущее у двух прохождений одной ночи расходится. */
    r.flags = AQ.SCENARIO.applySets(S, it, g);
    if (r.flags.length) r.reresolved = AQ.SCENARIO.reresolve(N(), S);

    spend(S, N().cost.verdict);
    return r;
  }

  function takedown(S, itemId) {
    var it = item(S, itemId);
    if (!it) return { error: 'no-item' };
    if (S.resolved[itemId]) {
      return { error: S.resolved[itemId].missed ? 'expired' : 'already' };
    }
    var st = S.opened[itemId] || { tools: {}, findings: [] };
    var r = { call: 'removed', part: null, grade: 'takedown', removed: true, missed: false,
              findings: st.findings.slice(), tools: Object.keys(st.tools), followedSenim: false, blind: true };
    S.resolved[itemId] = r;
    S.profile.takedown++;
    S.meters.foe = Math.max(0, S.meters.foe - 18);
    r.credDelta = applyMeters(S, it, 'takedown');
    r.kayaDelta = applyKaya(S, 'takedown');
    r.trustMoved = applyTrust(S, it, 'takedown');
    applyEffect(S, it, 'no', 'takedown');
    spend(S, N().cost.verdict);
    return r;
  }

  function outcomeKey(S, it, r) {
    if (r.removed) return it.outcomes.takedown ? 'takedown' : 'wrongFake';
    if (r.missed)  return 'missed';
    if (it.outcomes[r.grade]) return r.grade;
    if (r.grade === 'partial') return 'right';
    return 'missed';
  }

  /* ---- итоги --------------------------------------------- */

  function danaGrade(S) {
    var dam = S.resolved['aqsu_dam'];
    var aqsu = S.villages['aqsu'];
    var frac = aqsu.locked ? aqsu.saved / village('aqsu').pop : evacProgress(S, 'aqsu');

    if (!dam || dam.missed) return frac > 0.5 ? 'mixed' : 'silent';
    if (dam.removed) return 'poor';
    if (frac >= 0.98) return 'excellent';
    if (frac >= 0.7)  return 'good';
    if (frac >= 0.25) return 'mixed';
    /* Плохой финал бывает двух разных видов, и путать их нельзя:
       либо игрок сам назвал предупреждение фейком, либо ответил
       верно, а посёлок остановило его следующее решение. */
    return (dam.grade === 'right' || dam.grade === 'partial') ? 'stopped' : 'poor';
  }

  function testResult(which) {
    var S = AQ.S, block = S[which];
    var hits = 0, fa = 0, nSig = 0, nNoise = 0;
    block.order.forEach(function (h, i) {
      var said = block.answers[i];
      if (h.truth === false) { nSig++; if (said === false) hits++; }
      else { nNoise++; if (said === false) fa++; }
    });
    return AQ.SDT.analyse(hits, fa, nSig, nNoise);
  }

  return {
    reset: function (withTest, seed) { AQ.S = newState(withTest, seed); return AQ.S; },
    state: function () { return AQ.S; },
    miss: miss,
    timeLeft: timeLeft,
    spend: spend,
    tick: tick,
    clockLabel: clockLabel,
    clockAt: clockAt,
    damAt: damAt,
    damBroken: damBroken,
    kayaBalance: kayaBalance,
    kayaCfg: kayaCfg,
    canAfford: canAfford,
    spendKaya: spendKaya,
    earnKaya: earnKaya,
    queue: queue,
    item: item,
    village: village,
    waterLevel: waterLevel,
    bridgeLoad: bridgeLoad,
    hospitalFull: hospitalFull,
    evacProgress: evacProgress,
    savedNow: savedNow,
    settle: settleVillages,
    useTool: useTool,
    tryPair: tryPair,
    publish: publish,
    takedown: takedown,
    grade: grade,
    outcomeKey: outcomeKey,
    danaGrade: danaGrade,
    testResult: testResult,
    isOver: function (S) {
      if (timeLeft(S) <= 0) return true;
      return S.items.filter(function (it) { return !S.resolved[it.id]; }).length === 0;
    }
  };
})();
