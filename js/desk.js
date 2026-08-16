/* ============================================================
   AQIQAT — ОБОЛОЧКА
   ------------------------------------------------------------
   Слева карта с людьми, справа входящее. Над всем — счётчик
   спасённых, единственное число, которое игрок обязан понять
   за три секунды.

   Вердикт в два шага, по одному вопросу за раз:
     шаг 1  ПРАВДА · ФЕЙК · НЕ ЗНАЮ
     шаг 2  (только после ФЕЙК) только фото · сама новость · и то и другое
   ============================================================ */

window.AQ = window.AQ || {};

AQ.UI = (function () {

  var G = null, T = null, L = null;
  var armed = null;          // выбранный атом заявления
  var typeTimer = null;
  var draft = { itemId: null, call: null };   // call выбран, ждём уточнения

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function show(name) {
    ['menu', 'prologue', 'test', 'shift', 'dawn'].forEach(function (s) {
      var el = $('scr-' + s);
      if (el) el.classList.toggle('on', s === name);
    });
    window.scrollTo(0, 0);
  }

  function langBar(id) {
    return '<div class="langs" id="' + id + '">' + AQ.LANGS.map(function (l) {
      return '<button data-l="' + l.code + '" class="' + (AQ.lang === l.code ? 'on' : '') + '">' + l.label + '</button>';
    }).join('') + '</div>';
  }
  function bindLangs(id) {
    var bar = $(id); if (!bar) return;
    bar.querySelectorAll('button').forEach(function (b) {
      b.onclick = function () { AQ.SFX.click(); AQ.setLang(b.dataset.l); };
    });
  }

  /* ============================================================
     МЕНЮ
     ============================================================ */

  function renderMenu() {
    $('scr-menu').innerHTML =
      '<div class="menu">' +
        '<h1>' + T('title') + '</h1>' +
        '<div class="sub">' + T('subtitle') + '</div>' +
        '<div class="kaz">ақиқат · истина · truth</div>' +
        '<div class="pitch">' + esc(T('tagline')) + '</div>' +
        '<button class="go" id="btn-begin">' + T('begin') + '</button>' +
        '<button class="go2" id="btn-study">' + T('beginStudy') + '</button>' +
        '<div class="foot">' +
          langBar('lang-menu') +
          '<button id="btn-credits">' + T('credits') + '</button>' +
          '<button id="btn-sound">' + T(AQ.SFX.enabled() ? 'soundOn' : 'soundOff') + '</button>' +
          '<button id="btn-music">' + T(AQ.MUSIC.enabled() ? 'musicOn' : 'musicOff') + '</button>' +
        '</div>' +
      '</div>';

    bindLangs('lang-menu');
    $('btn-music').onclick = function () {
      var m = AQ.MUSIC.toggle();
      $('btn-music').textContent = T(m ? 'musicOn' : 'musicOff');
      AQ.SFX.click();
    };
    $('btn-begin').onclick = function () { start(false); };
    $('btn-study').onclick = function () { start(true); };
    $('btn-credits').onclick = function () {
      AQ.SFX.click(); modal(T('credits'), '', T('creditsBody'), T('close'));
    };
    $('btn-sound').onclick = function () {
      var on = AQ.SFX.toggle();
      $('btn-sound').textContent = T(on ? 'soundOn' : 'soundOff');
      if (on) AQ.SFX.click();
    };
  }

  /* Пролог объясняет цель за двадцать секунд и знакомит с
     SENIM за десять. Игра, которую надо объяснять словами
     после запуска, объяснена плохо. */
  function start(withTest, seed) {
    AQ.SFX.click(); AQ.SFX.startHum(); AQ.SFX.startRain(); AQ.MUSIC.start();
    G.reset(withTest, seed);
    AQ.SENIM.reset();
    AQ.NPC.reset();
    AQ.S.phase = 'prologue';
    AQ.SENIM.prologue(function () {
      if (withTest) { AQ.S.phase = 'pre'; renderTest('pre'); show('test'); }
      else          { AQ.S.phase = 'shift'; startShift(); }
    });
  }

  /* ============================================================
     ПРЕ / ПОСТ ТЕСТ — теперь необязательный
     ============================================================ */

  function renderTest(which) {
    var S = AQ.S, block = S[which], i = block.answers.length, total = block.order.length;

    if (i >= total) {
      if (which === 'pre') { S.phase = 'shift'; startShift(); }
      else { S.phase = 'dawn'; AQ.DAWN.render(); show('dawn'); }
      return;
    }

    var h = block.order[i], dots = '';
    for (var d = 0; d < total; d++) dots += '<i class="' + (d < i ? 'done' : '') + '"></i>';

    $('scr-test').innerHTML =
      '<div class="test">' +
        '<div class="head">' + T(which === 'pre' ? 'pretestTitle' : 'posttestTitle') + '</div>' +
        (i === 0 ? '<div class="intro">' + esc(T(which === 'pre' ? 'testIntro' : 'testIntroPost')) + '</div>' : '') +
        '<div class="counter">' + T('testProgress', { n: i + 1, t: total }) + '</div>' +
        '<div class="card">' + esc(L(h.text)) + '</div>' +
        '<div class="btns">' +
          '<button class="t" id="ans-t">' + T('isTrue') + '</button>' +
          '<button class="f" id="ans-f">' + T('isFalse') + '</button>' +
        '</div>' +
        '<div class="dots">' + dots + '</div>' +
      '</div>';

    function answer(said) { AQ.SFX.click(); block.answers.push(said); renderTest(which); }
    $('ans-t').onclick = function () { answer(true); };
    $('ans-f').onclick = function () { answer(false); };
  }

  /* ============================================================
     СМЕНА
     ============================================================ */

  function startShift() {
    var S = AQ.S;
    S.clock = 0;
    seenFlooded = {};
    phoneShown = 0;
    AQ.ALERT.reset();
    document.body.classList.remove('fx-lowtime');
    G.spend(S, 0);
    S.activeId = G.queue(S).length ? G.queue(S)[0].id : null;   // первое открыто сразу
    armed = null;
    buildShift();
    show('shift');
    startTicker();
  }

  /* Каркас строится один раз — карта не должна пересоздаваться
     на каждый клик, иначе анимация не работает. */
  function buildShift() {
    $('scr-shift').innerHTML =
      '<div class="wrap">' +
        '<div class="topbar" id="topbar"></div>' +
        '<div class="stage">' +
          '<div class="mapcol">' +
            '<div class="maparea">' +
              '<div class="mapbox" id="mapbox"></div>' +
              '<div class="phone" id="phone"></div>' +
            '</div>' +
            '<div class="queue" id="queue"></div>' +
          '</div>' +
          '<div class="workcol" id="workcol"></div>' +
        '</div>' +
      '</div>' +
      '<div class="coach" id="coach"></div>';

    /* Клик по посёлку: если про него есть слух — открываем слух,
       если нет — открываем карточку посёлка. Карта отвечает
       всегда, а не только когда «повезло». */
    AQ.MapView.mount($('mapbox'), function (vid) {
      var q = G.queue(AQ.S).filter(function (it) {
        return it.village === vid || it.village === 'all';
      });
      if (q.length) { AQ.SFX.open(); AQ.S.activeId = q[0].id; armed = null; AQ.INSPECT.close(); refresh(); }
      else AQ.INSPECT.open('village', vid);
    }, function (kind, id) {
      AQ.INSPECT.open(kind, id);
    });

    refresh();
  }

  /* Между входящими бывает пауза. Мёртвого клика быть не должно:
     если проверять нечего, время само идёт до следующего слуха, а
     карта за это время живёт — вода поднимается, люди уходят. */
  function fastForward(S) {
    if (G.queue(S).length) return false;
    var waiting = S.items.filter(function (it) { return !S.resolved[it.id] && it.arrive > S.clock; });
    if (!waiting.length) return false;
    var next = Math.min.apply(null, waiting.map(function (it) { return it.arrive; }));
    G.spend(S, Math.max(1, next - S.clock));
    var q = G.queue(S);
    if (q.length) { S.activeId = q[0].id; AQ.SFX.message(); }
    return true;
  }

  /* ============================================================
     ЧАСЫ ИДУТ САМИ
     ------------------------------------------------------------
     Ночь больше не ждёт, пока игрок надумает. Стрелка движется
     по настоящему таймеру, и это меняет саму игру: теперь
     проверить всё нельзя не потому, что так решил дизайнер, а
     потому что вода не останавливается, пока ты читаешь.

     Дельта берётся из Date.now(), а не из частоты интервала:
     вкладка в фоне засыпает, и наивный счётчик тиков потерял бы
     половину ночи.
     ============================================================ */

  var tickTimer = null, tickAt = 0;

  function startTicker() {
    stopTicker();
    tickAt = Date.now();
    tickTimer = setInterval(tickOnce, 250);
  }

  function stopTicker() {
    if (tickTimer) clearInterval(tickTimer);
    tickTimer = null;
  }

  /* Часы стоят, пока открыта модалка последствий: читать, что
     ты натворил, под уходящее время — наказание за чтение. */
  function ticking() {
    var S = AQ.S;
    if (!S || S.phase !== 'shift') return false;
    var m = $('modal');
    if (m && m.classList.contains('on')) return false;
    return true;
  }

  function tickOnce() {
    var now = Date.now();
    var real = (now - tickAt) / 1000;
    tickAt = now;
    if (!ticking() || real <= 0) return;
    /* Вкладка была свёрнута полчаса — не отматываем всю ночь
       разом, иначе игрок вернётся к готовому рассвету. */
    if (real > 3) real = 3;

    var S = AQ.S;
    var moved = G.tick(S, real * (AQ.NIGHT.pace || 0.67));
    if (!moved) return;

    if (G.isOver(S)) { endShift(); return; }
    /* Активное входящее могло истечь прямо сейчас — тогда нужен
       полный перерисов, чтобы игрок не работал с мертвецом. */
    if (S.activeId && S.resolved[S.activeId]) { expiredNotice(S.activeId); return; }
    lightRefresh();
  }

  /* Лёгкое обновление: часы, деньги, вода, очередь и карта.
     Правую колонку НЕ трогаем — иначе раскрытые комментарии
     схлопывались бы, а печать вывода Ерасыла сбивалась каждую
     секунду. */
  function lightRefresh() {
    var S = AQ.S;
    if (!S) return;
    AQ.ALERT.check(S);
    renderTop();
    AQ.MapView.update();
    AQ.INSPECT.refresh();
    renderQueue();
    renderPhone();
  }

  /* Слух умер, пока игрок с ним работал. Раньше это происходило
     молча: карточка оставалась на экране, кнопки работали, а
     вердикт не срабатывал — и выглядело как поломка игры. */
  function expiredNotice(itemId) {
    var S = AQ.S;
    var it = G.item(S, itemId);
    S.activeId = null;
    draft = { itemId: null, call: null };
    armed = null;
    AQ.SFX.reject();
    if (AQ.FX) AQ.FX.pulse('danger');
    /* Если это был последний слух ночи — не показываем окно
       поверх рассвета, просто заканчиваем смену. */
    if (G.isOver(S)) { endShift(); return; }
    renderWork();
    lightRefresh();
    modal(T('expiredTitle'), '', T('expiredBody', { h: it ? it.handle : '' }), T('continueBtn'), function () {
      if (G.isOver(S)) { endShift(); return; }
      var q = G.queue(S);
      S.activeId = q.length ? q[0].id : null;
      refresh();
    });
  }

  /* Обновление без пересборки карты. */
  var seenFlooded = {};   // чтобы сирена звучала один раз на посёлок

  function refresh() {
    var S = AQ.S;
    if (!S) return;

    var guard = 0;
    while (fastForward(S) && guard++ < 12) { /* до следующего входящего */ }
    if (G.isOver(S)) { endShift(); return; }
    /* Открытое входящее могло истечь между кадрами. */
    if (S.activeId && S.resolved[S.activeId]) S.activeId = null;
    if (!S.activeId) {
      var q = G.queue(S);
      if (q.length) S.activeId = q[0].id;
    }

    /* вода дошла до посёлка: сирена + синяя виньетка по краю */
    for (var vid in S.villages) {
      if (S.villages[vid].status === 'flooded' && !seenFlooded[vid]) {
        seenFlooded[vid] = true;
        AQ.SFX.siren();
        if (AQ.FX) AQ.FX.pulse('flood');
      }
    }
    AQ.ALERT.check(S);

    renderTop();
    AQ.MapView.update();
    AQ.INSPECT.refresh();
    renderQueue();
    renderWork();
    renderPhone();
    AQ.TUTOR.apply();
  }

  function renderTop() {
    var S = AQ.S;
    var saved = G.savedNow(S), total = AQ.MAP.totalPop;
    var pct = saved / total * 100;
    var left = G.timeLeft(S), tp = left / AQ.NIGHT.clock.length * 100;
    var water = Math.round(G.waterLevel(S) * 100);

    /* последний час: низкий пульс под всем экраном */
    var low = left <= 60 && left > 0;
    if (low && !document.body.classList.contains('fx-lowtime')) {
      document.body.classList.add('fx-lowtime');
      AQ.SFX.timePulse(true);
    } else if (!low && document.body.classList.contains('fx-lowtime')) {
      document.body.classList.remove('fx-lowtime');
      AQ.SFX.timePulse(false);
    }

    $('topbar').innerHTML =
      '<div class="brand">AQIQAT</div>' +
      '<div class="clock">' + G.clockLabel(S) + '</div>' +
      '<div class="saved">' +
        '<div class="lbl">' + T('saved') + '</div>' +
        '<div class="num"><b>' + fmtN(saved) + '</b> / ' + fmtN(total) + '</div>' +
        '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '</div>' +
      '<div class="mini kaya' + (G.kayaBalance(S) < G.kayaCfg().tool ? ' alarm' : '') + '" title="' + T('kayaHint') + '">' +
        '<span>' + T('mKaya') + '</span><b>◈ ' + G.kayaBalance(S) + '</b></div>' +
      '<div class="mini water"><span>' + T('mWater') + '</span><b>≋ ' + water + '%</b></div>' +
      '<div class="mini' + (tp < 20 ? ' alarm' : '') + '">' +
        '<span>' + T('mClock') + '</span><b>' + left + '</b></div>' +
      '<div class="mini' + (S.meters.cred < 35 ? ' alarm' : '') + '" title="' + T('credHint') + '">' +
        '<span>' + T('mCredibility') + '</span><b>' + Math.round(S.meters.cred) + '%</b></div>' +
      (S.meters.foe < 100 ? '<div class="mini' + (S.meters.foe < 60 ? ' alarm' : '') + '">' +
        '<span>' + T('mFreedom') + '</span><b>' + Math.round(S.meters.foe) + '%</b></div>' : '') +
      langBar('lang-shift');

    bindLangs('lang-shift');
  }

  function fmtN(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* ---- очередь: компактные фишки под картой --------------- */

  function renderQueue() {
    var S = AQ.S, q = G.queue(S), box = $('queue');
    if (!box) return;

    if (!q.length) { box.innerHTML = '<div class="qempty">' + T('queueEmpty') + '</div>'; return; }

    box.innerHTML = q.map(function (it) {
      var dying = (it.expire - S.clock) <= 40;
      var v = it.village === 'all' ? { name: { en: 'all villages', ru: 'все посёлки', kk: 'барлық ауыл' } }
            : it.village === 'route' ? AQ.MAP.route
            : G.village(it.village);
      return '<button class="qchip' + (S.activeId === it.id ? ' sel' : '') + (dying ? ' dying' : '') + '" data-id="' + it.id + '">' +
        '<span class="qv">' + esc(L(v.name)) + '</span>' +
        '<span class="qt">' + esc(L(it.text).slice(0, 48)) + '…</span>' +
        (dying ? '<span class="qx">' + T('expiring') + '</span>' : '') +
      '</button>';
    }).join('');

    box.querySelectorAll('.qchip').forEach(function (b) {
      b.onclick = function () { AQ.SFX.open(); AQ.S.activeId = b.dataset.id; armed = null; refresh(); };
    });
  }

  /* ---- правая колонка: входящее целиком ------------------- */

  function renderWork() {
    var S = AQ.S, box = $('workcol');
    var it = S.activeId ? G.item(S, S.activeId) : null;

    if (!it) { box.innerHTML = '<div class="card"><div class="nosel">' + esc(T('noneOpen')) + '</div></div>'; return; }

    var st = S.opened[it.id] = S.opened[it.id] || { tools: {}, atoms: [], findings: [], senimSeen: false };

    /* Вердикт идёт последним: он прилипает к низу экрана, и если
       под ним окажется ещё одна карточка, он накроет её текст. */
    box.innerHTML =
      claimCard(S, it, st) +
      toolsCard(S, it, st) +
      findsCard(S, it, st) +
      AQ.NPC.card(S, it) +
      senimCard(S, it, st) +
      verdictCard(S, it, st);

    bindClaim(); bindTools(); bindNpc(); bindSenim(); bindVerdict();
  }

  /* Короткая запись больших чисел: 41 000 → 41K. */
  function fmtK(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (n >= 10000) return Math.round(n / 1000) + 'K';
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K';
    return String(n);
  }

  /* Карточка — настоящий пост из соцсети: аватар, время, возраст
     аккаунта, реакции, просмотры, «изменено», комментарии.
     Половина сигналов манипуляции читается отсюда без единого
     инструмента — этому и учим. */
  function claimCard(S, it, st) {
    var media = it.image
      ? '<img class="media-img" src="' + esc(it.image) + '" alt="">'
      : (it.media.art ? AQ.ART.render(it.media.art, it.id, {
          time: it.social ? it.social.time : null,
          heavy: it.shares > 20000
        }) : '<div class="media-none">' + T('mediaNone') + '</div>');

    var mediaBlock = (it.media.art || it.image)
      ? '<button class="mediaw' + (it.media.kind === 'video' ? ' isvideo' : '') + (it.image ? ' raster' : '') + '" id="mediabtn" title="' + T('tapZoom') + '">' +
          media +
          (it.media.kind === 'video' ? '<span class="playbtn">▶</span>' : '') +
          '<span class="zoomhint">⤢</span>' +
        '</button>'
      : '<div class="media-none">' + T('mediaNone') + '</div>';

    var stuck = st.atoms.length > 0 && st.findings.length === 0;
    var so = it.social || {};

    var head = '<div class="pc-head">' +
      '<div class="pc-ava" style="--h:' + (so.hue || 200) + '">' + esc(so.avatar || '?') + '</div>' +
      '<div class="pc-id">' +
        '<div class="pc-name">' + esc(so.name || it.handle) +
          (so.verified ? '<span class="pc-verif" title="verified">✓</span>' : '') + '</div>' +
        '<div class="pc-sub">' + esc(it.handle) + ' · ' + esc(L(so.age)) + '</div>' +
      '</div>' +
      '<div class="pc-time">' + esc(so.time || '') + '<span class="pc-menu">⋮</span></div>' +
    '</div>';

    var fwd = so.fwd ? '<div class="pc-fwd">↪ ' + esc(L(so.fwd)) + '</div>' : '';

    var stats = '<div class="pc-stats">' +
      '<span>👍 ' + fmtK(so.likes || 0) + '</span>' +
      '<span class="hot">🔁 ' + fmtK(it.shares) + '</span>' +
      '<span>💬 ' + fmtK(so.comments || 0) + '</span>' +
      '<span class="views">👁 ' + fmtK(so.views || 0) + '</span>' +
    '</div>';

    var meta = '<div class="pc-meta">' + esc(so.time || '') +
      (so.edited ? ' · <span class="edited">' + T('cardEdited') + ' ' + esc(so.edited) + ' ✎</span>' : '') +
    '</div>';

    var comments = (so.commentList && so.commentList.length)
      ? '<details class="pc-comments"><summary>💬 ' + so.commentList.length + ' / ' + fmtK(so.comments || 0) + ' ' + T('cardComments') + '</summary>' +
          so.commentList.map(function (c) {
            return '<div class="pcc ' + c.kind + '">' +
              '<span class="pcc-who">' + esc(c.who) + '</span>' +
              '<span class="pcc-t">' + esc(L(c.text)) + '</span>' +
            '</div>';
          }).join('') +
        '</details>'
      : '';

    return '<div class="card claimcard postcard">' +
      head + fwd +
      '<div class="ctext">' + esc(L(it.text)) + '</div>' +
      mediaBlock +
      stats + meta + comments +
      '<div class="why">' + esc(L(it.why)) + '</div>' +
      '<div class="atoms">' +
        '<div class="ahint' + (stuck ? ' loud' : '') + '">' + T(stuck ? 'coachAtoms' : 'claimAtomsHint') + '</div>' +
        '<div class="atomrow' + (stuck ? ' pulse' : '') + '" id="catoms">' +
          it.claimAtoms.map(function (a) {
            return '<button class="atom' + (armed === a.id ? ' armed' : '') + '" data-a="' + a.id + '">' +
              esc(L(a.label)) + '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function bindClaim() {
    var row = $('catoms');
    if (row) row.querySelectorAll('.atom').forEach(function (b) {
      b.onclick = function () {
        AQ.SFX.hover();
        armed = (armed === b.dataset.a) ? null : b.dataset.a;
        renderWork(); AQ.TUTOR.apply();
      };
    });

    /* Лайтбокс: фото крупно + всё, что игрок на нём уже нашёл. */
    var mb = $('mediabtn');
    if (mb) mb.onclick = function () {
      AQ.SFX.open();
      var S = AQ.S, it = G.item(S, S.activeId);
      if (!it) return;
      var st = S.opened[it.id] || { findings: [] };
      var big = it.image
        ? '<img class="lb-img" src="' + esc(it.image) + '" alt="">'
        : AQ.ART.render(it.media.art, it.id, { time: it.social ? it.social.time : null, heavy: it.shares > 20000 });
      var marks = (st.findings || []).map(function (key) {
        var p = key.split('|');
        var f = (it.findings || []).filter(function (x) { return x.a === p[0] && x.b === p[1]; })[0];
        return f ? '<div class="lb-mark">◈ ' + esc(L(f.text)) + '</div>' : '';
      }).join('');
      modal(esc(it.handle), '', '', T('close'), null, null,
        '<div class="lightbox">' + big + marks + '</div>');
    };
  }

  var TOOLS = [
    { id: 'reverse', nm: 'tReverse', d: 'tReverseD' },
    { id: 'geo',     nm: 'tGeo',     d: 'tGeoD' },
    { id: 'time',    nm: 'tTime',    d: 'tTimeD' },
    { id: 'tree',    nm: 'tTree',    d: 'tTreeD' }
  ];

  function toolsCard(S, it, st) {
    /* Проверка стоит монет, а не минут. Разница принципиальная:
       время всё равно уходит и купить его нельзя, а проверку —
       можно себе позволить или нет. Вот в этом и решение. */
    var cost = G.kayaCfg().tool, poor = !G.canAfford(S, cost);

    var list = TOOLS.map(function (t) {
      var used = !!st.tools[t.id];
      return '<button class="tool' + (used ? ' done' : '') + (poor && !used ? ' poor' : '') + '" data-t="' + t.id + '" ' +
        (used || poor ? 'disabled' : '') + '>' +
        '<span class="nm">' + T(t.nm) + '</span>' +
        '<span class="c">' + (used ? '✓' : '◈ ' + cost) + '</span>' +
        '<span class="d">' + T(t.d) + '</span>' +
      '</button>';
    }).join('');

    /* Каждый инструмент возвращает картинку, а не строку:
       сплит с архивом, булавки на карте, солнце за горизонтом,
       цепочка репостов. Атомы-кнопки остаются ниже — механика
       противоречий не меняется, меняется подача. */
    function toolVisHtml(tid) {
      var def = it.tools[tid], v = def && def.vis;
      if (!v) return '';
      if (v.kind === 'split') return AQ.ART.splitVis(it.media.art, it.id, v.pct, T('tvNow'), T('tvArch'), it.image);
      if (v.kind === 'pins')  return AQ.ART.geoVis(v.match, esc(L(v.a)), v.b ? esc(L(v.b)) : '');
      if (v.kind === 'time')  return AQ.ART.timeVis(esc(L(v.label)), v.bad);
      if (v.kind === 'tree')  return AQ.ART.treeVis(esc(L(v.label)), v.hops, v.good);
      return '';
    }

    var results = TOOLS.filter(function (t) { return st.tools[t.id]; }).map(function (t) {
      var r = st.tools[t.id];
      if (r.blind) {
        return '<div class="tresult blind"><div class="th">' + T(t.nm) + ' — ' + T('toolBlind') + '</div>' +
          '<div class="note">' + esc(L(r.note)) + '</div></div>';
      }
      return '<div class="tresult"><div class="th">' + T(t.nm) + '</div>' +
        toolVisHtml(t.id) +
        '<div class="atomrow">' +
        r.atoms.map(function (a) {
          var spent = st.findings.some(function (k) { var p = k.split('|'); return p[0] === a.id || p[1] === a.id; });
          return '<button class="atom' + (spent ? ' spent' : '') + '" data-ta="' + a.id + '">' + esc(L(a.label)) + '</button>';
        }).join('') + '</div></div>';
    }).join('');

    return '<div class="card">' +
      '<h2>' + T('tools') + '</h2>' +
      (S.profile.toolUses === 0 ? '<div class="coachline">' + T('coachTools') + '</div>' : '') +
      '<div class="tools">' + list + '</div>' +
      (results ? '<div class="tres">' + results + '</div>' : '') +
    '</div>';
  }

  function bindTools() {
    var S = AQ.S, it = G.item(S, S.activeId);

    document.querySelectorAll('.tool').forEach(function (b) {
      b.onclick = function () {
        var res = G.useTool(S, it.id, b.dataset.t);
        if (res.error === 'expired') { expiredNotice(it.id); return; }
        if (res.error === 'no-kaya') { AQ.SFX.reject(); flash(b); AQ.ALERT.ribbon('kaya', T('kayaBroke')); return; }
        if (res.error) { AQ.SFX.reject(); return; }
        if (res.blind) AQ.SFX.blind(); else AQ.SFX.tool();
        AQ.SENIM.onTool(res);
        refresh();
      };
    });

    document.querySelectorAll('[data-ta]').forEach(function (b) {
      b.onclick = function () {
        if (!armed) { AQ.SFX.reject(); flash(b); return; }
        var r = G.tryPair(S, it.id, armed, b.dataset.ta);
        if (!r.ok || r.already) { AQ.SFX.reject(); flash(b); return; }
        if (r.corroborates) AQ.SFX.corroborate(); else AQ.SFX.finding();
        armed = null;
        /* Если находка опровергает вывод SENIM — он признаёт
           ошибку прямо здесь, и это самая важная сцена ночи. */
        var admitted = AQ.SENIM.onFinding(it, r);
        if (!admitted) { renderWork(); AQ.TUTOR.apply(); }
        else AQ.TUTOR.apply();
      };
    });
  }

  function flash(el) { el.classList.add('shake'); setTimeout(function () { el.classList.remove('shake'); }, 340); }

  /* Андрей и Али: ушёл — вернулся с наводкой, когда сцена визита
     отыгралась (js/npcscene.js). Пауза здесь не украшение: она
     стоит игроку игровых минут, потому что часы всё это время
     идут. */
  function bindNpc() {
    var S = AQ.S, it = G.item(S, S.activeId);
    document.querySelectorAll('.npcb').forEach(function (b) {
      b.onclick = function () {
        var r = AQ.NPC.send(S, b.dataset.npc, it);
        if (r.error === 'expired') { expiredNotice(it.id); return; }
        if (r.error === 'no-kaya') { AQ.SFX.reject(); flash(b); AQ.ALERT.ribbon('kaya', T('kayaBroke')); return; }
        if (r.error) { AQ.SFX.reject(); flash(b); return; }
        AQ.SFX.click();
        renderTop();
        b.disabled = true;
        b.classList.add('going');
        var id = it.id;
        AQ.NPCSCENE.play(r.npc, function () {
          /* Мог смениться экран, пока он ходил. */
          if (!AQ.S || AQ.S.activeId !== id) return;
          AQ.ALERT.ribbon('npc', AQ.L(r.npc.name) + ': ' + T('npcBack'));
          renderWork();
          AQ.TUTOR.apply();
        });
      };
    });
  }

  function findsCard(S, it, st) {
    if (!st.findings.length) return '';
    var rows = st.findings.map(function (key) {
      var p = key.split('|');
      var f = (it.findings || []).filter(function (x) { return x.a === p[0] && x.b === p[1]; })[0];
      if (!f) return '';
      var cls = f.pivotal ? 'piv' : f.confirms ? 'corr' : '';
      return '<div class="find ' + cls + '"><div class="k">' +
        (f.confirms ? T('corroboration') : T('contradiction')) + '</div>' +
        '<div class="x">' + esc(L(f.text)) + '</div></div>';
    }).join('');
    return '<div class="card"><h2>' + T('findings') + '<span class="n">' + st.findings.length + '</span></h2>' +
      '<div class="finds">' + rows + '</div></div>';
  }

  /* ---- SENIM ---------------------------------------------- */

  function senimCard(S, it, st) { return AQ.SENIM.card(S, it, st); }

  function bindSenim() {
    var S = AQ.S, it = G.item(S, S.activeId), st = S.opened[it.id];

    /* Пока не нанят — на карточке только кнопка. Ни процента,
       ни намёка авансом: за подсказку надо заплатить. */
    var hb = $('senim-hire');
    if (hb) {
      hb.onclick = function () {
        var r = AQ.SENIM.hire(S, it);
        if (r.error === 'no-kaya') { AQ.SFX.reject(); flash(hb); AQ.ALERT.ribbon('kaya', T('kayaBroke')); return; }
        AQ.SFX.open();
        renderTop();
        renderWork();
        AQ.TUTOR.apply();
      };
      return;
    }

    if (st.senimSeen) return;
    st.senimSeen = true; S.senimShown++;
    AQ.SENIM.typeLine(L(it.senim.line), it.senim.conf);
  }

  /* ============================================================
     ВЕРДИКТ — три кнопки, потом уточнение
     ============================================================ */

  function verdictCard(S, it, st) {
    if (draft.itemId !== it.id) draft = { itemId: it.id, call: null };

    /* Уточнение появляется только с третьего входящего: сначала
       игрок должен усвоить базовый цикл. */
    var resolvedCount = Object.keys(S.resolved).length;
    var refineOn = resolvedCount >= 2;

    if (draft.call === 'fake' && refineOn) {
      return '<div class="card vcard step2">' +
        '<h2>' + T('whatIsFake') + '</h2>' +
        '<div class="vrow">' +
          '<button class="vb photo" data-p="photo">' + T('pPhoto') + '<span>' + T('pPhotoD') + '</span></button>' +
          '<button class="vb story" data-p="story">' + T('pStory') + '<span>' + T('pStoryD') + '</span></button>' +
          '<button class="vb both"  data-p="both">'  + T('pBoth')  + '<span>' + T('pBothD')  + '</span></button>' +
        '</div>' +
        '<button class="vback" id="v-back">' + T('cancel') + '</button>' +
      '</div>';
    }

    return '<div class="card vcard">' +
      '<h2>' + T('verdict') + '</h2>' +
      '<div class="vrow main">' +
        '<button class="vb real"   data-c="real">'   + T('vReal')   + '</button>' +
        '<button class="vb fake"   data-c="fake">'   + T('vFake')   + '</button>' +
        '<button class="vb unsure" data-c="unsure">' + T('vUnsure') + '</button>' +
      '</div>' +
      (S.clock > 90 ? '<details class="more"><summary>' + T('otherOptions') + '</summary>' +
        '<button class="nukebtn" id="btn-nuke">' + T('takedown') + '</button>' +
        '<div class="nukehint">' + T('takedownCost') + '</div></details>' : '') +
    '</div>';
  }

  function bindVerdict() {
    var S = AQ.S, it = G.item(S, S.activeId);
    var refineOn = Object.keys(S.resolved).length >= 2;

    document.querySelectorAll('[data-c]').forEach(function (b) {
      b.onclick = function () {
        AQ.SFX.click();
        var call = b.dataset.c;
        if (call === 'fake' && refineOn) { draft.call = 'fake'; renderWork(); AQ.TUTOR.apply(); return; }
        commit(call, call === 'fake' ? 'both' : null);
      };
    });

    document.querySelectorAll('[data-p]').forEach(function (b) {
      b.onclick = function () { AQ.SFX.click(); commit('fake', b.dataset.p); };
    });

    var back = $('v-back');
    if (back) back.onclick = function () { AQ.SFX.click(); draft.call = null; renderWork(); };

    var nuke = $('btn-nuke');
    if (nuke) nuke.onclick = function () {
      AQ.SFX.click();
      modal(T('takedown'), '', T('takedownCost'), T('takedownConfirm'), function () {
        AQ.SFX.takedown();
        var r = G.takedown(S, it.id);
        afterVerdict(it, r);
      }, T('cancel'));
    };

    function commit(call, part) {
      AQ.SFX.stamp();
      var r = G.publish(S, it.id, call, part);
      afterVerdict(it, r);
    }
  }

  function afterVerdict(it, r) {
    var S = AQ.S;
    /* Вердикт мог не пройти: двойной клик или слух истёк, пока
       игрок собирался с мыслями. Второе игрок обязан УВИДЕТЬ —
       раньше экран просто сбрасывался, и это читалось как
       поломка. */
    if (!r || r.error) {
      draft = { itemId: null, call: null };
      if (r && r.error === 'expired') { expiredNotice(it.id); return; }
      refresh();
      return;
    }
    draft = { itemId: null, call: null };
    armed = null;
    S.activeId = null;
    G.settle(S);

    /* ПОРЯДОК ПРИНЦИПИАЛЕН: сначала отыгрывает карта, потом текст.
       Штамп с ударом → тряска → камера наезжает на посёлок →
       окна гаснут / колонна встаёт → и только теперь модалка. */
    var lbl = r.removed ? T('takedownConfirm')
      : T(r.call === 'real' ? 'vReal' : r.call === 'fake' ? 'vFake' : 'vUnsure');
    AQ.FX.stamp(lbl, r.removed ? 'removed' : r.call);
    AQ.FX.shake();

    AQ.MapView.update();
    AQ.TUTOR.advance('verdict');

    var bad = r.grade && String(r.grade).indexOf('wrong') === 0;
    setTimeout(function () { AQ.FX.focusVillage(it.village, 1400); }, 300);
    if (bad) setTimeout(function () { AQ.FX.desat(500); AQ.FX.pulse('danger'); }, 420);

    var kind = AQ.SOURCE.consider(S);
    if (kind) S.messages.push({ who: 'source', text: T('src_' + kind) });

    setTimeout(function () { consequence(it, r); }, 1500);
  }

  function consequence(it, r) {
    var S = AQ.S;
    var key = G.outcomeKey(S, it, r);
    var text = L(it.outcomes[key]) || L(it.outcomes.missed) || '';
    var d = r.credDelta || 0;
    var extra = '';

    /* Сколько людей это стоило — самое понятное, что можно
       показать сразу после вердикта. */
    var vid = it.village;
    if (vid && vid !== 'all' && vid !== 'route' && S.villages[vid]) {
      var v = G.village(vid);
      var safe = Math.round(v.pop * G.evacProgress(S, vid));
      extra += '<div class="cpeople">' + esc(L(v.name)) + ': <b>' + fmtN(safe) + '</b> / ' + fmtN(v.pop) + '</div>';
    }

    /* Раньше здесь висело голое «−14» — число без адресата,
       которое ничего не объясняло. Теперь видно, КТО перестал
       слушать и что это значит для эвакуации. */
    var moved = (r.trustMoved || []).filter(function (m) { return m.delta < 0; });
    if (moved.length) {
      var main = moved.filter(function (m) { return m.target; })[0] || moved[0];
      var mv = G.village(main.id);
      extra += '<div class="ctrust">' +
        esc(T('cTrustLost', { v: mv ? L(mv.name) : main.id, n: Math.abs(main.delta) })) +
        (moved.length > 1 ? ' ' + esc(T('cTrustOthers')) : '') +
      '</div>';
      extra += '<div class="cwhy">' + esc(T('cTrustWhy')) + '</div>';
    }

    if (r.kayaDelta) {
      extra += '<div class="ckaya ' + (r.kayaDelta > 0 ? 'up' : 'down') + '">' +
        (r.kayaDelta > 0 ? '+' : '') + r.kayaDelta + ' KAYA</div>';
    }
    if (d) extra += '<div class="cred ' + (d > 0 ? 'up' : 'down') + '">' + T('mCredibility') + ' ' + (d > 0 ? '+' : '') + d + '</div>';

    modal(T('consequence'), '', text, T('continueBtn'), function () {
      if (G.isOver(S)) { endShift(); return; }
      var q = G.queue(S);
      S.activeId = q.length ? q[0].id : null;
      refresh();
    }, null, extra);
  }

  /* Телефон поверх карты. Дана — живой человек, а не строка
     интерфейса: её сообщения приходят с «печатает…» и звуком. */
  var phoneShown = 0;

  function renderPhone() {
    var S = AQ.S, box = $('phone');
    if (!box) return;
    if (!S.messages.length) { box.innerHTML = ''; return; }

    /* Только последнее сообщение: стопка пузырей закрывала бы
       Сарыой. История ночи всё равно разбирается на рассвете. */
    var msgs = S.messages.slice(-1);
    var baseIdx = S.messages.length - msgs.length;

    box.innerHTML = msgs.map(function (m, i) {
      var idx = baseIdx + i;
      var who = m.who === 'dana' ? T('danaName') : m.who === 'aigerim' ? T('aigerimName') : T('sourceName');
      var fresh = idx >= phoneShown;
      return '<div class="pmsg ' + m.who + (fresh ? ' typing' : '') + '" data-idx="' + idx + '">' +
        '<div class="pwho">' + esc(who) + (m.time ? ' · ' + m.time : '') + '</div>' +
        '<div class="pb">' + (fresh
          ? '<span class="tdots" aria-label="' + T('phoneTyping') + '"><i></i><i></i><i></i></span>'
          : esc(m.text)) + '</div>' +
      '</div>';
    }).join('');

    msgs.forEach(function (m, i) {
      var idx = baseIdx + i;
      if (idx < phoneShown) return;
      var el = box.querySelector('.pmsg[data-idx="' + idx + '"]');
      setTimeout(function () {
        if (!el || !el.isConnected) return;
        el.classList.remove('typing');
        el.querySelector('.pb').textContent = m.text;
      }, 850 + i * 400);
    });
    phoneShown = S.messages.length;
  }

  /* ---- конец смены ---------------------------------------- */

  function endShift() {
    var S = AQ.S;
    if (S.phase === 'post' || S.phase === 'dawn') return;
    stopTicker();
    /* Ленты ЧП живут своей жизнью и могли остаться висеть над
       рассветом, сдвигая страницу вниз. Ночь кончилась — их
       больше нет. */
    AQ.ALERT.reset();
    S.items.forEach(function (it) { G.miss(S, it); });
    S.clock = AQ.NIGHT.clock.length;
    G.settle(S);
    AQ.SFX.dawn();
    AQ.MUSIC.fadeToDawn();
    AQ.FX.resetCamera();
    document.body.classList.remove('fx-lowtime');

    if (S.withTest) { S.phase = 'post'; renderTest('post'); show('test'); }
    else { S.phase = 'dawn'; AQ.DAWN.render(); show('dawn'); }
  }

  /* ---- модалка -------------------------------------------- */

  function modal(kicker, title, body, okLabel, onOk, cancelLabel, extra) {
    var m = $('modal');
    m.innerHTML = '<div class="box">' +
      (kicker ? '<div class="k">' + esc(kicker) + '</div>' : '') +
      (title ? '<h3>' + esc(title) + '</h3>' : '') +
      '<p>' + esc(body) + '</p>' + (extra || '') +
      '<div><button class="ok" id="m-ok">' + esc(okLabel) + '</button>' +
      (cancelLabel ? '<button class="alt" id="m-cancel">' + esc(cancelLabel) + '</button>' : '') + '</div>' +
    '</div>';
    m.classList.add('on');
    $('m-ok').onclick = function () { AQ.SFX.click(); m.classList.remove('on'); if (onOk) onOk(); };
    var c = $('m-cancel');
    if (c) c.onclick = function () { AQ.SFX.click(); m.classList.remove('on'); };
  }

  /* ---- быстрый переход для съёмки -------------------------- */

  function devJump() {
    var h = (location.hash || '').replace('#', '');
    if (['desk', 'trap', 'late', 'dawn'].indexOf(h) === -1) return false;

    G.reset(h === 'dawn');
    var S = AQ.S;
    S.phase = 'shift'; S.tutorialStep = 99;
    seenFlooded = {}; phoneShown = 0;
    G.spend(S, 0);

    if (h === 'trap') { G.spend(S, 56); S.activeId = 'aqsu_dam'; }
    if (h === 'late') { G.spend(S, 170); S.activeId = 'akim_deepfake'; }

    if (h === 'dawn') {
      S.pre.answers = S.pre.order.map(function (x, i) { return i % 3 === 0 ? !x.truth : x.truth; });
      var n = 0;
      S.items.forEach(function (it) {
        if (S.resolved[it.id]) return;
        n++;
        if (n % 4 === 0) return;
        var right = n % 3 !== 0;
        G.publish(S, it.id, right ? (it.truth.claim === 'true' ? 'real' : it.truth.claim === 'fake' ? 'fake' : 'unsure') : 'fake',
                  right ? null : 'both');
      });
      S.items.forEach(function (it) { G.miss(S, it); });
      S.clock = AQ.NIGHT.clock.length; G.settle(S);
      S.senimShown = 6; S.senimChecked = 3;
      S.post.answers = S.post.order.map(function (x, i) { return i % 5 === 0 ? !x.truth : x.truth; });
      S.phase = 'dawn'; AQ.DAWN.render(); show('dawn');
      return true;
    }

    buildShift(); show('shift');
    startTicker();
    return true;
  }

  /* ============================================================ */

  return {
    init: function () {
      G = AQ.Game; T = AQ.T; L = AQ.L;

      AQ.onLangChange = function () {
        var S = AQ.S;
        if (!S || S.phase === 'menu') { renderMenu(); return; }
        if (S.phase === 'pre') renderTest('pre');
        else if (S.phase === 'post') renderTest('post');
        else if (S.phase === 'dawn') AQ.DAWN.render();
        else buildShift();
      };
      AQ.onMessage = function () { AQ.SFX.message(); };

      if (!AQ._hashBound) {
        AQ._hashBound = true;
        window.addEventListener('hashchange', function () {
          clearInterval(typeTimer); stopTicker(); G.reset(); AQ.UI.init();
        });
      }

      if (devJump()) return;
      renderMenu(); show('menu');
    },
    refresh: refresh,
    renderWork: renderWork,
    show: show,
    modal: modal,
    /* «Сыграть ту же ночь»: те же входящие, другие решения. */
    startWithSeed: function (seed) { start(false, seed); }
  };
})();
