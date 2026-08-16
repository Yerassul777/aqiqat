/* ============================================================
   AQIQAT — ОБУЧЕНИЕ
   ------------------------------------------------------------
   Первые полторы минуты ведут за руку. В каждый момент
   доступно ровно одно действие, остальное затемнено и не
   нажимается. Стрелка + одна фраза без терминов.

   Шаг не хранится счётчиком, а ВЫВОДИТСЯ из состояния игры.
   Поэтому обучение невозможно «сломать»: куда бы игрок ни
   ткнул, следующая подсказка всегда осмысленна.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.TUTOR = (function () {

  var T = function (k, v) { return AQ.T(k, v); };

  function done(S) { return S.tutorialStep >= 99; }

  /* Куда вести игрока на этом входящем. Раньше здесь стояли
     жёстко прописанные c_place и reverse — то есть атомы ровно
     одного варианта. Теперь ночь собирается из вариантов, и
     цель выводится из данных: берём первую находку входящего и
     показываем ту пару, которая её действительно даёт. */
  function firstPair(it) {
    var f = (it.findings || [])[0];
    if (!f) return null;

    var claimIds = it.claimAtoms.map(function (a) { return a.id; });
    var claimAtom = claimIds.indexOf(f.a) !== -1 ? f.a : f.b;
    var toolAtom  = (claimAtom === f.a) ? f.b : f.a;

    var toolId = null;
    Object.keys(it.tools).forEach(function (t) {
      (it.tools[t].atoms || []).forEach(function (a) { if (a.id === toolAtom) toolId = t; });
    });
    if (!toolId) return null;
    return { claimAtom: claimAtom, toolAtom: toolAtom, toolId: toolId };
  }

  /* Обучение проходят один раз в жизни, а не в каждом заходе.
     Игрок, который вернулся бить рекорд, уже знает, куда жать, и
     подсказка поверх второго слуха только отнимает у него
     секунды, которых теперь и так не хватает. */
  function finish(S) {
    S.tutorialStep = 99;
    try { localStorage.setItem('aqiqat_tutorial_seen', '1'); } catch (e) {}
  }

  /* Какая подсказка уместна прямо сейчас. */
  function compute(S) {
    var resolved = Object.keys(S.resolved).length;
    if (resolved >= 2) { finish(S); return null; }

    var it = S.activeId ? AQ.Game.item(S, S.activeId) : null;

    /* Ничего не открыто — покажи, что кликать. */
    if (!it) return { key: 'tut_open', sel: '.qchip', place: 'above' };

    var st = S.opened[it.id] || { tools: {}, findings: [] };

    /* --- второе входящее: один урок, без ведения по шагам --- */
    if (resolved === 1) {
      return { key: 'tut_confirm', sel: '.vb.real', place: 'above', once: true };
    }

    /* --- первое входящее: полный проход --- */
    var pair = firstPair(it);
    if (!pair) return { key: 'tut_decide', sel: '.vrow.main', place: 'above' };

    if (!st.tools[pair.toolId]) {
      return { key: 'tut_tool', sel: '.tool[data-t="' + pair.toolId + '"]', place: 'above' };
    }
    if (!st.findings.length) {
      /* Атом заявления ещё не выбран — тыкаем в него; выбран — в улику. */
      var armed = document.querySelector('#catoms .atom.armed');
      return armed
        ? { key: 'tut_link2', sel: '[data-ta="' + pair.toolAtom + '"]', place: 'above' }
        : { key: 'tut_link1', sel: '#catoms .atom[data-a="' + pair.claimAtom + '"]', place: 'above' };
    }
    return { key: 'tut_decide', sel: '.vrow.main', place: 'above' };
  }

  function clear() {
    document.querySelectorAll('.tut-dim').forEach(function (e) { e.classList.remove('tut-dim'); });
    document.querySelectorAll('.tut-focus').forEach(function (e) { e.classList.remove('tut-focus'); });
    var c = document.getElementById('coach');
    if (c) { c.className = ''; c.innerHTML = ''; }
    AQ._coachRelayout = null;
  }

  /* Пузырь привязан к элементу, поэтому при прокрутке и смене
     размера окна его надо переставлять. */
  (function () {
    function relayout() { if (AQ._coachRelayout) AQ._coachRelayout(); }
    window.addEventListener('resize', relayout);
    window.addEventListener('scroll', relayout, { passive: true });
  })();

  /* Пузырь position:fixed, поэтому координаты берём прямо из
     getBoundingClientRect без поправки на прокрутку. Раньше он
     был absolute внутри .wrap и уезжал в угол, накрывая счётчик. */
  function place(bubble, target) {
    if (!target) { bubble.className = 'on center'; return; }
    var r = target.getBoundingClientRect();
    var bw = bubble.offsetWidth, bh = bubble.offsetHeight;

    var top = r.top - bh - 14;
    var below = false;
    if (top < 8) { top = r.bottom + 14; below = true; }

    var left = r.left + r.width / 2 - bw / 2;
    left = Math.max(10, Math.min(window.innerWidth - bw - 10, left));

    bubble.classList.toggle('below', below);
    bubble.style.top = Math.round(top) + 'px';
    bubble.style.left = Math.round(left) + 'px';
    /* хвостик указывает на середину цели, а не на середину пузыря */
    var tail = Math.max(12, Math.min(bw - 12, r.left + r.width / 2 - left));
    bubble.style.setProperty('--tail', Math.round(tail) + 'px');
  }

  return {
    apply: function () {
      var S = AQ.S;
      clear();
      if (!S || done(S)) return;

      var step = compute(S);
      if (!step) return;

      /* Затемняем всё, кроме карточки с целью.
         Карточку заявления не трогаем никогда: это то самое, что
         игрок обязан прочитать, чтобы вообще понять задачу. */
      var target = document.querySelector(step.sel);
      var keep = target ? target.closest('.card') : null;
      document.querySelectorAll('.workcol .card, .queue').forEach(function (c) {
        if (c !== keep && !c.classList.contains('claimcard')) c.classList.add('tut-dim');
      });
      if (target) target.classList.add('tut-focus');

      var bubble = document.getElementById('coach');
      if (!bubble) return;
      bubble.innerHTML =
        '<div class="ctext">' + T(step.key) + '</div>' +
        '<button class="cskip" id="tut-skip">' + T('tutSkip') + '</button>';
      bubble.className = 'on';

      /* Замер только в следующем кадре: сразу после вставки DOM
         прямоугольники ещё нулевые, и пузырь улетал в угол экрана,
         накрывая счётчик спасённых. */
      requestAnimationFrame(function () { place(bubble, target); });
      AQ._coachRelayout = function () { place(bubble, target); };

      var skip = document.getElementById('tut-skip');
      if (skip) skip.onclick = function () {
        AQ.SFX.click();
        finish(AQ.S);
        clear();
        AQ.UI.refresh();
      };
    },

    /* Вызывается после вердикта — на втором входящем обучение
       заканчивается само. */
    advance: function () {
      var S = AQ.S;
      if (!S || done(S)) return;
      if (Object.keys(S.resolved).length >= 2) finish(S);
    },

    clear: clear
  };
})();
