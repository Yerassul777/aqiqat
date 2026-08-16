/* ============================================================
   AQIQAT — ИНСПЕКТОР КАРТЫ
   ------------------------------------------------------------
   Карта, по которой нельзя кликнуть, — это фон. Здесь она
   становится местом, куда игрок смотрит: посёлок, мост, дамба,
   больница, школа-убежище и Петропавл отвечают карточкой.

   Ничего нового не симулируется ради красоты. Всё, что тут
   показано, уже управляет игрой: доверие решает, как быстро
   выходят люди; паника замедляет выход; загрузка моста
   создаёт затор; койки в больнице отменяют ускорение.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.INSPECT = (function () {

  var openKey = null;

  function T(k, v) { return AQ.T(k, v); }
  function L(o) { return AQ.L(o); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmtN(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  function box() {
    var b = document.getElementById('inspect');
    if (!b) {
      b = document.createElement('div');
      b.id = 'inspect';
      var host = document.querySelector('.maparea') || document.body;
      host.appendChild(b);
    }
    return b;
  }

  function row(label, value, cls) {
    return '<div class="i-row ' + (cls || '') + '"><span class="k">' + label + '</span>' +
           '<span class="v">' + value + '</span></div>';
  }

  function bar(pct, cls) {
    return '<span class="i-bar ' + (cls || '') + '"><i style="width:' + Math.max(0, Math.min(100, pct)) + '%"></i></span>';
  }

  /* ---- содержимое карточек -------------------------------- */

  function panicWord(p) {
    return p >= 70 ? T('panicHigh') : p >= 35 ? T('panicMid') : T('panicLow');
  }

  function villageCard(S, id) {
    var v = AQ.Game.village(id), st = S.villages[id];
    if (!v || !st) return '';
    var out = Math.round(st.locked ? st.saved : v.pop * AQ.Game.evacProgress(S, id));
    var left = v.floodAt - S.clock;
    var statusKey = 'vs_' + st.status;

    return '<div class="i-head"><span class="i-title">' + esc(L(v.name)) + '</span>' +
             '<span class="i-tag s-' + st.status + '">' + T(statusKey) + '</span></div>' +
      row(T('iPopulation'), fmtN(v.pop)) +
      row(T('iEvacuated'), '<b>' + fmtN(out) + '</b> / ' + fmtN(v.pop) + bar(out / v.pop * 100, 'good')) +
      row(T('iTrust'), Math.round(st.trust) + '%' + bar(st.trust, st.trust < 40 ? 'bad' : ''), st.trust < 40 ? 'warn' : '') +
      row(T('iPanic'), panicWord(st.panic || 0) + bar(st.panic || 0, (st.panic || 0) >= 70 ? 'bad' : 'warn')) +
      (st.locked
        ? row(T('iWater'), st.status === 'flooded' ? T('iWaterHere') : T('iSafeNow'))
        : row(T('iWater'), left > 0 ? T('iWaterIn', { n: left }) : T('iWaterHere'), left < 60 ? 'warn' : ''));
  }

  function bridgeCard(S) {
    var load = AQ.Game.bridgeLoad(S);
    var cap = S.routeBlocked ? 0 : Math.max(35, 100 - Math.max(0, load - 2) * 22);
    var stateKey = S.routeBlocked ? 'brBlocked' : (load >= 4 ? 'brJammed' : load > 0 ? 'brBusy' : 'brClear');

    return '<div class="i-head"><span class="i-title">' + esc(L(AQ.MAP.route.name)) + '</span>' +
             '<span class="i-tag ' + (S.routeBlocked ? 's-flooded' : load >= 4 ? 's-halted' : 's-evacuating') + '">' +
             T(stateKey) + '</span></div>' +
      row(T('iCapacity'), cap + '%' + bar(cap, cap < 50 ? 'bad' : ''), cap < 50 ? 'warn' : '') +
      row(T('iColumns'), load + ' / 6') +
      row(T('iChecked'), T('iMinAgo', { n: Math.max(1, S.clock % 41) })) +
      '<div class="i-note">' + T(S.routeBlocked ? 'brNoteBlocked' : load >= 4 ? 'brNoteJam' : 'brNoteOk') + '</div>';
  }

  function damCard(S) {
    var broken = AQ.Game.damBroken(S);
    var lvl = Math.round(AQ.Game.waterLevel(S) * 100);
    return '<div class="i-head"><span class="i-title">' + esc(L(AQ.MAP.dam.name)) + '</span>' +
             '<span class="i-tag ' + (broken ? 's-flooded' : 's-evacuating') + '">' +
             T(broken ? 'damBroken' : 'damHolding') + '</span></div>' +
      row(T('iGauge'), (broken ? '+2.1 ' : '+0.4 ') + T('iMetres')) +
      row(T('iWaterLevel'), lvl + '%' + bar(lvl, lvl > 60 ? 'bad' : '')) +
      '<div class="i-note">' + T(broken ? 'damNoteBroken' : 'damNoteHolding') + '</div>';
  }

  function landmarkCard(S, id) {
    var m = null;
    AQ.MAP.landmarks.forEach(function (x) { if (x.id === id) m = x; });
    if (!m) return '';

    if (m.kind === 'hospital') {
      var h = S.hospital || { beds: 213, taken: 0 };
      var free = Math.max(0, Math.round((1 - h.taken / h.beds) * 100));
      return '<div class="i-head"><span class="i-title">' + esc(L(m.name)) + '</span>' +
               '<span class="i-tag ' + (free < 15 ? 's-flooded' : 's-evacuating') + '">' +
               T(free < 15 ? 'hospFull' : 'hospOpen') + '</span></div>' +
        row(T('iBeds'), h.beds) +
        row(T('iFree'), free + '%' + bar(free, free < 15 ? 'bad' : 'good')) +
        row(T('iLastMsg'), AQ.Game.clockLabel(S)) +
        '<div class="i-note">' + T(free < 15 ? 'hospNoteFull' : 'hospNoteOpen') + '</div>';
    }

    var saved = AQ.Game.savedNow(S);
    return '<div class="i-head"><span class="i-title">' + esc(L(m.name)) + '</span></div>' +
      row(T('iReceived'), fmtN(saved)) +
      '<div class="i-note">' + T('schoolNote') + '</div>';
  }

  function safeCard(S) {
    var saved = AQ.Game.savedNow(S), total = AQ.MAP.totalPop;
    return '<div class="i-head"><span class="i-title">' + esc(L(AQ.MAP.safeZone.name)) + '</span>' +
             '<span class="i-tag s-evacuated">' + T('iSafeZone') + '</span></div>' +
      row(T('iReceived'), '<b>' + fmtN(saved) + '</b> / ' + fmtN(total) + bar(saved / total * 100, 'good')) +
      '<div class="i-note">' + esc(L(AQ.MAP.safeZone.note)) + '</div>';
  }

  /* ---- открытие ------------------------------------------- */

  function render(kind, id) {
    var S = AQ.S;
    if (!S) return;
    var body =
      kind === 'village'  ? villageCard(S, id) :
      kind === 'bridge'   ? bridgeCard(S) :
      kind === 'dam'      ? damCard(S) :
      kind === 'landmark' ? landmarkCard(S, id) :
      kind === 'safe'     ? safeCard(S) : '';
    if (!body) return;

    var b = box();
    b.innerHTML = '<button class="i-close" id="i-close" aria-label="close">×</button>' + body;
    b.className = 'on';
    var c = document.getElementById('i-close');
    if (c) c.onclick = function () { AQ.SFX.click(); close(); };
  }

  function close() {
    openKey = null;
    var b = document.getElementById('inspect');
    if (b) b.className = '';
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openKey) close();
  });

  return {
    open: function (kind, id) {
      var key = kind + ':' + id;
      if (openKey === key) { close(); return; }   // второй клик закрывает
      openKey = key;
      AQ.SFX.open();
      render(kind, id);
    },
    /* панель живёт вместе с картой: время идёт, цифры меняются */
    refresh: function () {
      if (!openKey) return;
      var p = openKey.split(':');
      render(p[0], p[1]);
    },
    close: close,
    isOpen: function () { return !!openKey; }
  };
})();
