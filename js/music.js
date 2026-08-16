/* ============================================================
   AQIQAT — МУЗЫКА
   ------------------------------------------------------------
   Кинематографичный эмбиент, ля минор, всё синтезируется — ни
   одного аудиофайла. Никаких мелодий: давление, а не тема.

   Всё держится на одном числе — НАПРЯЖЕНИИ:

     0.30·времяНочи + 0.28·уровеньВоды
   + 0.24·средняяПаника + 0.18·частотаОшибок

   Оно сглажено шестью секундами интерполяции, поэтому никогда
   не дёргается. Слои включаются по порогам с гистерезисом,
   чтобы не мигать на границе, а темп растёт с 72 до 96.

   Ноты ставятся планировщиком с забеганием вперёд (lookahead):
   каждые 25 мс мы записываем в расписание всё, что должно
   прозвучать в ближайшие 120 мс. Таймер на каждую ноту дал бы
   слышимую дрожь.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.MUSIC = (function () {

  var ctx = null, bus = null;
  var on = true, running = false;
  var tension = 0, target = 0;
  var layers = {};
  var sched = null, nextNote = 0, step = 0;

  try { on = localStorage.getItem('aqiqat_music') !== '0'; } catch (e) {}

  /* Ля минор. Всё строится от 55 Гц. */
  var A1 = 55, A2 = 110, C3 = 130.81, E3 = 164.81, A3 = 220, B3f = 233.08;

  var LOOKAHEAD = 0.12, TICK = 25;

  /* Пороги входа и выхода расходятся на 0.06 — это и есть
     гистерезис, из-за которого слой не мигает на границе. */
  var LAYERS = [
    { id: 'sub',     inAt: -1,   outAt: -1 },
    { id: 'pad',     inAt: 0.10, outAt: 0.04 },
    { id: 'pulse',   inAt: 0.35, outAt: 0.29 },
    { id: 'perc',    inAt: 0.55, outAt: 0.49 },
    { id: 'press',   inAt: 0.78, outAt: 0.72 }
  ];

  function now() { return ctx ? ctx.currentTime : 0; }
  function bpm() { return 72 + 24 * tension; }

  /* ---- сборка ---------------------------------------------- */

  function init() {
    if (ctx) return true;
    if (!AQ.SFX || !AQ.SFX.context) return false;
    ctx = AQ.SFX.context();
    if (!ctx) return false;
    bus = ctx.createGain();
    bus.gain.value = 0;
    bus.connect(AQ.SFX.musicBus ? AQ.SFX.musicBus() : ctx.destination);
    buildLayers();
    return true;
  }

  function gain(v) { var g = ctx.createGain(); g.gain.value = v; g.connect(bus); return g; }

  function buildLayers() {
    /* СУБ — дыхание под всем. Две расстроенные синусоиды. */
    var subG = gain(0);
    [A1, A1 * 1.005].forEach(function (f) {
      var o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = f;
      o.connect(subG); o.start();
    });
    var lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.07; lg.gain.value = 0.05;
    lfo.connect(lg); lg.connect(subG.gain); lfo.start();
    layers.sub = { g: subG, max: 0.16, on: false };

    /* ПЭД — трезвучие Am пилой через lowpass с медленным LFO. */
    var padG = gain(0);
    var padF = ctx.createBiquadFilter();
    padF.type = 'lowpass'; padF.frequency.value = 320; padF.Q.value = 0.7;
    padF.connect(padG);
    [A2, C3, E3].forEach(function (f, i) {
      var o = ctx.createOscillator();
      o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = (i - 1) * 6;
      var og = ctx.createGain(); og.gain.value = 0.1;
      o.connect(og); og.connect(padF); o.start();
    });
    var pl = ctx.createOscillator(), plg = ctx.createGain();
    pl.frequency.value = 0.045; plg.gain.value = 150;
    pl.connect(plg); plg.connect(padF.frequency); pl.start();
    layers.pad = { g: padG, max: 0.1, on: false, filter: padF };

    /* ДАВЛЕНИЕ — малая секунда на длинной атаке. Дискомфорт. */
    var prG = gain(0);
    [A3, B3f].forEach(function (f) {
      var o = ctx.createOscillator();
      o.type = 'triangle'; o.frequency.value = f;
      var og = ctx.createGain(); og.gain.value = 0.5;
      o.connect(og); og.connect(prG); o.start();
    });
    layers.press = { g: prG, max: 0.045, on: false };

    /* ПУЛЬС и ПЕРКУССИЯ звучат нотами из планировщика. */
    layers.pulse = { g: gain(0), max: 0.09, on: false };
    layers.perc  = { g: gain(0), max: 0.11, on: false };
  }

  /* ---- ноты ------------------------------------------------ */

  function pluck(t, freq, dur, vol, dest) {
    var o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = freq;
    f.type = 'lowpass';
    f.frequency.setValueAtTime(400 + 2200 * tension, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f); f.connect(g); g.connect(dest);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function thud(t, freq, dur, vol, dest) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq * 2.2, t);
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.07);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function rim(t, vol, dest) {
    var len = Math.floor(ctx.sampleRate * 0.05);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    var src = ctx.createBufferSource(); src.buffer = buf;
    var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2100; f.Q.value = 2;
    var g = ctx.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(dest);
    src.start(t);
  }

  /* Восьмые: пульс на каждой, кик на сильную, рим на третью. */
  var PULSE_NOTES = [A2, A2, C3, A2, E3, A2, C3, A2];

  function scheduleStep(t) {
    var i = step % 8;
    if (layers.pulse.on) {
      pluck(t, PULSE_NOTES[i], 0.28, 0.5, layers.pulse.g);
    }
    if (layers.perc.on) {
      if (i === 0) thud(t, 48, 0.32, 0.6, layers.perc.g);
      if (i === 4) rim(t, 0.35, layers.perc.g);
    }
    step++;
  }

  function pump() {
    if (!running) return;
    var eighth = 60 / bpm() / 2;
    while (nextNote < now() + LOOKAHEAD) {
      if (nextNote < now()) nextNote = now() + 0.01;
      scheduleStep(nextNote);
      nextNote += eighth;
    }
  }

  /* ---- напряжение ------------------------------------------ */

  function measure() {
    var S = AQ.S;
    if (!S || S.phase !== 'shift') return 0;
    var G = AQ.Game;

    var time = Math.min(1, S.clock / AQ.NIGHT.clock.length);
    var water = G.waterLevel(S);

    var pSum = 0, n = 0;
    for (var k in S.villages) { pSum += (S.villages[k].panic || 0); n++; }
    var panic = n ? pSum / n / 100 : 0;

    var decided = Object.keys(S.resolved).length;
    var wrong = 0;
    for (var id in S.resolved) {
      var r = S.resolved[id];
      if (r.missed || r.removed || (r.grade && String(r.grade).indexOf('wrong') === 0)) wrong++;
    }
    var err = decided ? wrong / decided : 0;

    return Math.max(0, Math.min(1, 0.30 * time + 0.28 * water + 0.24 * panic + 0.18 * err));
  }

  function updateLayers() {
    LAYERS.forEach(function (spec) {
      var L = layers[spec.id];
      if (!L) return;
      var want = spec.inAt < 0 ? true : (L.on ? tension > spec.outAt : tension > spec.inAt);
      if (want !== L.on) L.on = want;

      /* Громкость слоя растёт вместе с напряжением, но не с нуля:
         включившийся слой должен быть слышен сразу. */
      var lvl = want ? L.max * (0.55 + 0.45 * tension) : 0;
      L.g.gain.setTargetAtTime(lvl, now(), 1.6);
    });

    /* Пэд открывается по частоте среза — это и есть «плотнеет». */
    if (layers.pad && layers.pad.filter) {
      layers.pad.filter.frequency.setTargetAtTime(280 + 900 * tension, now(), 2.2);
    }
  }

  var slew = null;

  return {

    enabled: function () { return on; },

    toggle: function () {
      on = !on;
      try { localStorage.setItem('aqiqat_music', on ? '1' : '0'); } catch (e) {}
      if (on) AQ.MUSIC.start(); else AQ.MUSIC.stop();
      return on;
    },

    start: function () {
      if (!on || running || !init()) return;
      if (ctx.state === 'suspended') ctx.resume();
      running = true;
      step = 0; nextNote = now() + 0.1;
      bus.gain.cancelScheduledValues(now());
      bus.gain.setValueAtTime(bus.gain.value, now());
      bus.gain.linearRampToValueAtTime(1, now() + 3);
      sched = setInterval(pump, TICK);

      /* Медленная интерполяция к цели: за шесть секунд, поэтому
         музыка никогда не дёргается на скачке состояния. */
      slew = setInterval(function () {
        target = measure();
        tension += (target - tension) * 0.06;
        updateLayers();
      }, 360);
    },

    stop: function () {
      running = false;
      clearInterval(sched); clearInterval(slew);
      if (!ctx || !bus) return;
      bus.gain.cancelScheduledValues(now());
      bus.gain.setValueAtTime(bus.gain.value, now());
      bus.gain.linearRampToValueAtTime(0, now() + 1.4);
    },

    /* Рассвет: всё уходит за три секунды, кроме суба. */
    fadeToDawn: function () {
      if (!running || !ctx) return;
      ['pad', 'pulse', 'perc', 'press'].forEach(function (id) {
        if (layers[id]) { layers[id].on = false; layers[id].g.gain.setTargetAtTime(0, now(), 0.9); }
      });
      clearInterval(sched); clearInterval(slew);
      if (layers.sub) layers.sub.g.gain.setTargetAtTime(0, now() + 2, 1.2);
      setTimeout(function () { AQ.MUSIC.stop(); }, 4200);
    },

    tension: function () { return tension; }
  };
})();
