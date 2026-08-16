/* ============================================================
   AQIQAT — СЦЕНА ВИЗИТА (Андрей / Али)
   ------------------------------------------------------------
   Раньше отправка человека была надписью на кнопке и паузой.
   Плейтест показал: пауза без картинки читается как зависание,
   а не как «он туда идёт». Здесь та же самая двухсекундная
   пауза получает тело: силуэт доходит до двери, стучит, две
   реплики из точек (что говорят — не важно, важно что говорят),
   прощание, уход. Ни слова диалога не показывается — это
   осознанно: наводка приходит потом, текстом, в карточке.

   Рисуется тем же SVG-языком, что и улики (js/art.js), чтобы
   не заводить второй визуальный стиль ради одной анимации.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.NPCSCENE = (function () {

  function T(k, v) { return AQ.T(k, v); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var GROUND = 142, WALK_FROM = 20, WALK_TO = 232, DOOR_X = 250, ANCHOR_Y = GROUND - 16;

  function scene() {
    var s = '<rect width="340" height="170" fill="#0c131c"/>';
    s += '<rect width="340" height="96" fill="#141f2a"/>';
    /* дальние крыши — тот же приём, что в сценах улик: горизонт
       не пустой, но и не отвлекает */
    s += '<path d="M0 92 L26 74 L52 92 M120 92 L150 68 L182 92 M280 92 L306 76 L332 92" ' +
      'stroke="#1c2934" stroke-width="2" fill="none" opacity=".6"/>';
    s += '<rect y="' + GROUND + '" width="340" height="' + (170 - GROUND) + '" fill="#0a1016"/>';
    s += '<line x1="0" y1="' + GROUND + '" x2="340" y2="' + GROUND + '" stroke="#1b2a36" stroke-width="1.4"/>';
    s += AQ.ART.house(210, 92, 100, 50, 32, '#241d17', '#3a2f24');
    /* окно — тлеет ровно, независимо от сюжета сцены */
    s += '<rect x="228" y="104" width="16" height="12" fill="#ffd98a" opacity=".16"/>';
    /* дверь: тёмный проём + световая накладка, которая включается,
       когда открывают */
    s += '<rect x="' + DOOR_X + '" y="112" width="22" height="30" fill="#120d09"/>';
    s += '<rect class="npcs-doorlit" x="' + DOOR_X + '" y="112" width="22" height="30" fill="#ffd98a" opacity="0"/>';
    /* житель — силуэт против света дверного проёма */
    s += '<g class="npcs-resident" transform="translate(261,' + ANCHOR_Y + ')">' +
      AQ.ART.person(0, 0, 0.8, '#160f09') + '</g>';
    /* гость: два вложенных узла — внешний двигает и разворачивает,
       внутренний покачивает при ходьбе (transition и animation
       не должны спорить за одно и то же CSS-свойство) */
    s += '<g class="npcs-walker">' +
      '<g class="npcs-bob">' + AQ.ART.person(0, 0, 1, '#0d1116') + '</g></g>';
    /* кольца стука рисуются позже поверх сцены */
    s += '<g class="npcs-rings"></g>';
    return '<svg class="npcs-svg" viewBox="0 0 340 170" preserveAspectRatio="xMidYMid meet">' + s + '</svg>';
  }

  function ring(svg) {
    var r = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    r.setAttribute('cx', DOOR_X); r.setAttribute('cy', ANCHOR_Y + 4); r.setAttribute('r', 3);
    r.setAttribute('class', 'npcs-ring');
    svg.querySelector('.npcs-rings').appendChild(r);
    setTimeout(function () { r.remove(); }, 520);
  }

  /* Отыграть визит и вызвать onDone, когда сцена закрылась.
     npc — запись из AQ.NPCS ({id, name, role}). */
  function play(npc, onDone) {
    var stage = document.getElementById('npcstage');
    if (!stage) { onDone && onDone(); return; }
    stage.innerHTML =
      '<div class="npcs-box">' +
        '<div class="npcs-who">' + esc(AQ.L(npc.name)) + '</div>' +
        '<div class="npcs-frame">' + scene() +
          '<div class="tdots npcs-say npcs-say-a"><i></i><i></i><i></i></div>' +
          '<div class="tdots npcs-say npcs-say-b"><i></i><i></i><i></i></div>' +
        '</div>' +
        '<div class="npcs-cap"></div>' +
      '</div>';
    stage.classList.add('on');

    var svg = stage.querySelector('.npcs-svg');
    var walker = stage.querySelector('.npcs-walker');
    var resident = stage.querySelector('.npcs-resident');
    var door = stage.querySelector('.npcs-doorlit');
    var sayA = stage.querySelector('.npcs-say-a');
    var sayB = stage.querySelector('.npcs-say-b');
    var cap = stage.querySelector('.npcs-cap');
    var timers = [];
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

    cap.textContent = T('npcKnockingCap');

    at(0,    function () { walker.classList.add('at-door'); });
    at(580,  function () { walker.classList.add('knock'); AQ.SFX && AQ.SFX.click && AQ.SFX.click(); ring(svg); });
    at(740,  function () { AQ.SFX && AQ.SFX.click && AQ.SFX.click(); ring(svg); });
    at(760,  function () { walker.classList.remove('knock'); });
    at(830,  function () { door.style.opacity = '.85'; resident.classList.add('show'); sayA.classList.add('show'); });
    at(1100, function () { sayA.classList.remove('show'); sayB.classList.add('show'); });
    at(1370, function () { sayB.classList.remove('show'); sayA.classList.add('show'); });
    at(1640, function () { sayA.classList.remove('show'); sayB.classList.add('show'); });
    at(1910, function () {
      sayB.classList.remove('show'); cap.textContent = T('npcLeavingCap');
      resident.classList.remove('show'); door.style.opacity = '0'; walker.classList.add('wave');
    });
    at(2180, function () {
      walker.classList.remove('wave'); walker.classList.remove('at-door'); walker.classList.add('leaving');
    });
    at(2680, function () { stage.classList.remove('on'); });
    at(2830, function () {
      stage.innerHTML = '';
      timers = [];
      if (onDone) onDone();
    });

    return {
      cancel: function () {
        timers.forEach(clearTimeout);
        stage.classList.remove('on');
        stage.innerHTML = '';
      }
    };
  }

  return { play: play, DURATION: 2830 };
})();
