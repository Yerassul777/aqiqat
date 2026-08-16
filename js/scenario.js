/* ============================================================
   AQIQAT — СЦЕНАРИЙ: акты и варианты
   ------------------------------------------------------------
   Ночь состоит из АКТОВ. Акт — это драматическая функция:
   «первое входящее, которое может перекрыть дорогу», «ловушка
   про дамбу», «дипфейк, который останавливает всех». Функция
   акта не меняется никогда — на ней держится баланс.

   А вот ВАРИАНТ акта меняется от ночи к ночи: другой источник,
   другая улика, другое фото, иногда другой правильный ответ.
   Шесть актов по четыре варианта дают десятки ночей, и игрок
   больше не может сказать «я знаю эту миссию».

   ПРАВИЛО ЗЕРКАЛЬНОГО РЫЧАГА — то, чем защищён баланс:
   на актах массовой эвакуации stand и kill спроектированы так,
   что ВЕРНЫЙ ход всегда поднимает людей. Проигрывает только
   ошибка. Поэтому вариант может переворачивать правду, не
   ломая при этом достижимость ста процентов.

   Выбор варианта — чистая функция (сид, акт, флаги). Никакого
   состояния генератора: одна и та же ночь при одном сиде
   собирается одинаково, а когда решения игрока меняют флаги,
   ещё не наступившие акты пересобираются сами.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.SCENARIO = (function () {

  /* ---- детерминированный шум ------------------------------ */

  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Флаги в устойчивую строку: порядок добавления не должен
     влиять на то, какой вариант выпадет. */
  function flagKey(flags) {
    if (!flags) return '';
    return Object.keys(flags).filter(function (k) { return flags[k]; }).sort().join(',');
  }

  /* ---- совместимость со старой формой ---------------------
     Ночь, написанная как плоский items[], молча превращается в
     акты с одним вариантом. Так night01 продолжает работать,
     пока варианты дописываются по одному.                   */

  var HEADER = ['arrive', 'expire', 'village', 'stake', 'lever'];

  function ensureActs(night) {
    if (night.acts) return night.acts;
    night.acts = (night.items || []).map(function (it) {
      var act = { id: it.id, variants: [] };
      HEADER.forEach(function (k) { if (it[k] !== undefined) act[k] = it[k]; });
      if (night.levers && night.levers[it.id]) act.lever = night.levers[it.id];

      var v = {};
      for (var k in it) if (HEADER.indexOf(k) === -1 && k !== 'id') v[k] = it[k];
      v.vid = 'base';
      act.variants.push(v);
      return act;
    });
    return night.acts;
  }

  function act(night, id) {
    var acts = ensureActs(night);
    for (var i = 0; i < acts.length; i++) if (acts[i].id === id) return acts[i];
    return null;
  }

  /* Дописать варианты к акту. Так content/variants01.js
     обогащает ночь, не трогая базовый файл. */
  function addVariants(night, actId, list) {
    var a = act(night, actId);
    if (!a) return false;
    list.forEach(function (v) { a.variants.push(v); });
    return true;
  }

  /* ---- выбор варианта ------------------------------------- */

  function eligible(v, flags) {
    var f = flags || {};
    if (v.requires && v.requires.some(function (k) { return !f[k]; })) return false;
    if (v.excludes && v.excludes.some(function (k) { return !!f[k]; })) return false;
    return true;
  }

  /* Чистая функция: (сид, акт, флаги) → вариант. Пересобрать
     акт после смены флагов можно в любой момент, результат
     воспроизводим и не зависит от порядка вызовов. */
  function pick(a, seed, flags) {
    var pool = a.variants.filter(function (v) { return eligible(v, flags); });
    if (!pool.length) pool = [a.variants[0]];

    var rnd = mulberry32(hashStr(seed + '|' + a.id + '|' + flagKey(flags)));
    var total = pool.reduce(function (s, v) { return s + (v.weight || 1); }, 0);
    var roll = rnd() * total;
    for (var i = 0; i < pool.length; i++) {
      roll -= (pool[i].weight || 1);
      if (roll <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  /* Шапка акта + вариант = входящее в точности той формы,
     которую весь остальной движок уже умеет обрабатывать. */
  /* Время публикации поста и время правки.
     ------------------------------------------------------------
     Раньше они стояли в контенте абсолютными строками и разъезжались
     с часами: пост, попавший на стол в 23:22, был помечен «01:48».
     Игрок это замечает за минуту и перестаёт верить всему экрану.

     Правильная модель простая: пост сначала ходит по сети и только
     потом доходит до дежурного. Значит время публикации ВСЕГДА чуть
     раньше момента, когда входящее появилось в очереди, а правка —
     между публикацией и этим моментом. Сдвиг детерминирован по акту
     и варианту: одна и та же ночь выглядит одинаково. */
  function stamps(it) {
    var so = it.social;
    if (!so || it.arrive === undefined || !AQ.Game) return;
    var r = mulberry32(hashStr('t|' + it.id + '|' + it.vid));
    var lead = 5 + Math.floor(r() * 14);              // 5–18 минут в сети
    so.time = AQ.Game.clockAt(it.arrive - lead);
    if (so.edited) {
      /* Правка обязана лежать между публикацией и приходом к нам —
         иначе «изменено» показывает будущее. */
      var gap = Math.max(1, Math.floor(lead * 0.55));
      so.edited = AQ.Game.clockAt(it.arrive - lead + gap);
    }
  }

  function materialise(a, v) {
    var it = JSON.parse(JSON.stringify(v));
    HEADER.forEach(function (k) { if (a[k] !== undefined) it[k] = a[k]; });
    it.id = a.id;
    it.vid = v.vid || 'base';
    stamps(it);
    return it;
  }

  /* ---- сборка ночи ---------------------------------------- */

  function resolve(night, seed, flags) {
    return ensureActs(night).map(function (a) {
      return materialise(a, pick(a, seed, flags));
    });
  }

  /* Пересобрать только те акты, которые ЕЩЁ НЕ НАСТУПИЛИ и не
     решены. Отсюда берётся ветвление: ошибка в первом акте
     меняет то, каким придёт пятый. Уже прожитое неприкосновенно. */
  function reresolve(night, S) {
    var changed = [];
    ensureActs(night).forEach(function (a, i) {
      var cur = S.items[i];
      if (!cur || cur.id !== a.id) return;
      if (S.resolved[a.id]) return;
      if (S.clock >= (a.arrive || 0)) return;

      var v = pick(a, S.seed, S.flags);
      if ((v.vid || 'base') === cur.vid) return;
      S.items[i] = materialise(a, v);
      changed.push(a.id);
    });
    return changed;
  }

  /* Флаги, которые вариант выставляет по факту исхода:
     sets: { right: ['bridge_open'], wrongTrue: ['panic_high'] } */
  function applySets(S, it, gradeKey) {
    if (!it.sets) return [];
    var list = it.sets[gradeKey] || [];
    list.forEach(function (f) { S.flags[f] = true; });
    return list;
  }

  return {
    hashStr: hashStr,
    mulberry32: mulberry32,
    ensureActs: ensureActs,
    act: act,
    addVariants: addVariants,
    resolve: resolve,
    reresolve: reresolve,
    applySets: applySets,
    /* нужен тестам: перебрать все варианты акта поимённо */
    variantsOf: function (night, actId) {
      var a = act(night, actId);
      return a ? a.variants.map(function (v) { return v.vid || 'base'; }) : [];
    },
    materialiseVid: function (night, actId, vid) {
      var a = act(night, actId);
      if (!a) return null;
      for (var i = 0; i < a.variants.length; i++) {
        if ((a.variants[i].vid || 'base') === vid) return materialise(a, a.variants[i]);
      }
      return null;
    }
  };
})();
