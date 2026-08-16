/* ============================================================
   AQIQAT — ЭФФЕКТЫ
   ------------------------------------------------------------
   Кинематографичная обратная связь. Порядок принципиален:
   СНАЧАЛА отыгрывает карта, ПОТОМ появляется текст.

     штамп → тряска → камера наезжает на посёлок →
     окна гаснут → и только теперь модалка с последствием.

   Всё на CSS-переходах и классах: ни канвы, ни библиотек.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.FX = (function () {

  var camTimer = null;

  function layer() {
    var f = document.getElementById('fx');
    if (!f) {
      f = document.createElement('div');
      f.id = 'fx';
      document.body.appendChild(f);
    }
    return f;
  }

  function vig() {
    var v = document.getElementById('vignette');
    if (!v) {
      v = document.createElement('div');
      v.id = 'vignette';
      document.body.appendChild(v);
    }
    return v;
  }

  return {

    /* Штамп вердикта: падает на карточку с ударом. */
    stamp: function (label, kind) {
      var f = layer();
      var el = document.createElement('div');
      el.className = 'fxstamp ' + (kind || '');
      el.textContent = label;
      f.appendChild(el);
      requestAnimationFrame(function () { el.classList.add('hit'); });
      setTimeout(function () { el.classList.add('gone'); }, 950);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1400);
    },

    /* Тряска экрана — 3 пикселя, 0.3 секунды. */
    shake: function () {
      document.body.classList.remove('fx-shake');
      void document.body.offsetWidth;          // перезапуск анимации
      document.body.classList.add('fx-shake');
      setTimeout(function () { document.body.classList.remove('fx-shake'); }, 420);
    },

    /* Камера наезжает на посёлок и возвращается туда, где её
       оставил игрок. Единственный владелец трансформа — карта,
       поэтому наезд и пользовательский зум не дерутся. */
    focusVillage: function (vid, holdMs) {
      if (AQ.MapView && AQ.MapView.camera) AQ.MapView.camera.focus(vid, holdMs);
    },

    resetCamera: function () {
      if (AQ.MapView && AQ.MapView.camera) AQ.MapView.camera.restore();
    },

    /* Ошибка: мир на мгновение теряет цвет. */
    desat: function (ms) {
      document.body.classList.add('fx-desat');
      setTimeout(function () { document.body.classList.remove('fx-desat'); }, ms || 500);
    },

    /* Вода дошла до посёлка: синяя виньетка пульсирует по краю.
       kind: 'flood' | 'danger' */
    pulse: function (kind) {
      var v = vig();
      v.className = 'on ' + (kind || 'flood');
      setTimeout(function () { v.className = ''; }, 2400);
    },

    /* Время на исходе: низкий пульс под всем экраном. */
    lowTime: function (on) {
      document.body.classList.toggle('fx-lowtime', !!on);
    }
  };
})();
