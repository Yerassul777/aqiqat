/* ============================================================
   AQIQAT — РЕКОРДЫ
   ------------------------------------------------------------
   Единственное, что переживает закрытую вкладку. Ночь каждый
   раз другая, поэтому сравнивать имеет смысл не сюжет, а работу:
   сколько слухов ты успел разобрать и скольким людям это стоило
   жизни.

   Хранилище может быть недоступно — file://, приватное окно,
   отключённые куки. Тогда игра просто работает без рекордов, и
   ни одна строка кода выше об этом не знает.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.RECORDS = (function () {

  var KEY = 'aqiqat_runs';
  var MAX = 25;                 // больше в списке всё равно не читается

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var v = JSON.parse(raw);
      return Object.prototype.toString.call(v) === '[object Array]' ? v : [];
    } catch (e) { return []; }
  }

  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); }
    catch (e) { /* нет хранилища — рекордов просто не будет */ }
  }

  /* Счёт забега. Люди первичны: игра про то, скольких вывели, а
     не про то, сколько кликов сделано. Точность — второй ключ,
     она разводит два забега с одинаковым числом спасённых. */
  function score(run) {
    return run.saved * 1000 + run.right * 10 + run.accuracy;
  }

  function summarise(S) {
    var G = AQ.Game;
    var right = 0, wrong = 0, missed = 0, decided = 0;
    S.items.forEach(function (it) {
      var r = S.resolved[it.id];
      if (!r) return;
      if (r.missed) { missed++; return; }
      decided++;
      if (r.grade === 'right' || r.grade === 'partial') right++;
      else wrong++;
    });

    return {
      ts: Date.now(),
      seed: S.seed,
      saved: G.savedNow(S),
      total: AQ.MAP.totalPop,
      right: right,
      wrong: wrong,
      missed: missed,
      decided: decided,
      acts: S.items.length,
      accuracy: decided ? Math.round(right / decided * 100) : 0,
      kaya: G.kayaBalance(S),
      /* Докуда добрался: сколько актов ночи вообще попало в руки.
         Быстрый игрок доходит до последних, медленный — нет. */
      reached: S.items.filter(function (it) { return S.resolved[it.id]; }).length,
      minutes: Math.round((Date.now() - S.startedAt) / 60000 * 10) / 10
    };
  }

  function best(list) {
    var l = list || read();
    if (!l.length) return null;
    return l.slice().sort(function (a, b) { return score(b) - score(a); })[0];
  }

  return {
    read: read,
    score: score,
    best: best,

    /* Возвращает и сам забег, и прежний рекорд — чтобы рассвет
       мог сказать «побит» до того, как новый забег в список
       попадёт и станет рекордом сам себе. */
    commit: function (S) {
      var run = summarise(S);
      var prev = best();
      var list = read();
      list.unshift(run);
      write(list);
      return {
        run: run,
        prev: prev,
        beaten: !prev || score(run) > score(prev),
        runs: list.length
      };
    },

    clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };
})();
