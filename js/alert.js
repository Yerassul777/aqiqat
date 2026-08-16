/* ============================================================
   AQIQAT — ЧП
   ------------------------------------------------------------
   Настоящий кризис ломает порядок на экране. Интерфейс, в
   котором всё аккуратно разложено по карточкам от 23:00 до
   05:00, врёт об этой ночи.

   Здесь три вещи:
     · лента ЧП, которая вклинивается поверх всего
     · уровень кризиса на <body>, от которого мигают фонари и
       проступают красные зоны
     · всплеск сообщений, встряхивающий очередь
   ============================================================ */

window.AQ = window.AQ || {};

AQ.ALERT = (function () {

  var seen = {};
  var crisis = -1;

  function T(k, v) { return AQ.T(k, v); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function rail() {
    var r = document.getElementById('alerts');
    if (!r) {
      r = document.createElement('div');
      r.id = 'alerts';
      document.body.appendChild(r);
    }
    return r;
  }

  /* ---- лента ---------------------------------------------- */

  function ribbon(kind, text, ms) {
    var r = rail();
    var el = document.createElement('div');
    el.className = 'ribbon ' + (kind || 'emergency');
    el.innerHTML = '<span class="rb-mark">' +
      (kind === 'senim' ? '◉' : kind === 'flood' ? '≋' :
       kind === 'kaya' ? '◈' : kind === 'npc' ? '⌂' : '🚨') + '</span>' +
      '<span class="rb-t">' + esc(text) + '</span>';
    r.appendChild(el);

    requestAnimationFrame(function () { el.classList.add('in'); push(); });
    if (kind === 'senim' || kind === 'npc') AQ.SFX.message();
    else if (kind === 'kaya') AQ.SFX.reject();
    else AQ.SFX.urgent();

    setTimeout(function () { el.classList.remove('in'); }, ms || 4500);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      push();
    }, (ms || 4500) + 700);
  }

  /* Лента не закрывает счётчик спасённых, а раздвигает под себя
     страницу: единственное число, которое обязано читаться
     всегда, обязано читаться и во время ЧП. */
  function push() {
    var r = document.getElementById('alerts');
    var h = r ? r.offsetHeight : 0;
    document.body.style.paddingTop = h ? h + 'px' : '';
  }

  /* ---- уровень кризиса ------------------------------------ */

  function setCrisis(level) {
    if (level === crisis) return;
    crisis = level;
    document.body.dataset.crisis = String(level);
  }

  /* ---- проверка состояния --------------------------------- */

  function check(S) {
    if (!S || S.phase !== 'shift') return;

    /* Уровень кризиса берём из того же напряжения, что и музыка:
       экран и звук обязаны говорить об одном и том же. */
    var t = AQ.MUSIC ? AQ.MUSIC.tension() : 0;
    setCrisis(t > 0.72 ? 3 : t > 0.48 ? 2 : t > 0.24 ? 1 : 0);

    /* Посёлок ушёл под воду. */
    for (var id in S.villages) {
      var st = S.villages[id];
      if (st.status === 'flooded' && !seen['fl_' + id]) {
        seen['fl_' + id] = true;
        var v = AQ.Game.village(id);
        ribbon('flood', T('alertFlooded', { v: AQ.L(v.name) }).toUpperCase());
      }
      /* Доверие провалилось — посёлок перестал слушать. */
      if (st.trust < 30 && !seen['tr_' + id]) {
        seen['tr_' + id] = true;
        var vv = AQ.Game.village(id);
        ribbon('emergency', T('alertTrustLost', { v: AQ.L(vv.name) }).toUpperCase());
      }
    }

    /* Затор на единственной переправе. */
    if (AQ.Game.bridgeLoad(S) >= 4 && !seen.jam) {
      seen.jam = true;
      ribbon('emergency', T('alertJam').toUpperCase());
    }

    /* Дамба. */
    if (AQ.Game.damBroken(S) && !seen.dam) {
      seen.dam = true;
      ribbon('emergency', T('alertDam').toUpperCase(), 5200);
    }

    /* Больница переполнена. */
    if (AQ.Game.hospitalFull(S) && !seen.hosp) {
      seen.hosp = true;
      ribbon('emergency', T('alertHospital').toUpperCase());
    }

    /* Последние сорок минут. */
    var left = AQ.Game.timeLeft(S);
    if (left <= 40 && left > 0 && !seen.last) {
      seen.last = true;
      ribbon('emergency', T('alertLastHour', { n: left }).toUpperCase());
    }
  }

  /* Всплеск сообщений: очередь дёргается, лента говорит сколько. */
  function burst(n) {
    ribbon('senim', T('alertBurst', { n: n }).toUpperCase(), 3400);
    var q = document.getElementById('queue');
    if (!q) return;
    q.classList.remove('shook');
    void q.offsetWidth;
    q.classList.add('shook');
  }

  return {
    ribbon: ribbon,
    burst: burst,
    check: check,
    reset: function () {
      seen = {}; crisis = -1;
      document.body.dataset.crisis = '0';
      document.body.style.paddingTop = '';
      var r = document.getElementById('alerts');
      if (r) r.innerHTML = '';
    }
  };
})();
