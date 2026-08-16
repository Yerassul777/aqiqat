/* ============================================================
   AQIQAT — AUDIO
   ------------------------------------------------------------
   Весь звук синтезируется через WebAudio. Ни одного файла:
   ноль веса, ноль лицензий, ноль зависимостей.

   Палитра намеренно скупая — ночь, лампа, старый терминал.
   Ничего мелодического: комната, а не саундтрек.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.SFX = (function () {

  var ctx = null, master = null, hum = null, rain = null, on = true;
  var thunderTimer = null, pulseTimer = null;

  try { on = localStorage.getItem('aqiqat_sound') !== '0'; } catch (e) {}

  function init() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    return true;
  }

  function now() { return ctx.currentTime; }

  /* Короткий тон с огибающей. */
  function tone(freq, dur, type, vol, detune) {
    if (!on || !init()) return;
    if (ctx.state === 'suspended') ctx.resume();
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    if (detune) o.detune.value = detune;
    g.gain.setValueAtTime(0, now());
    g.gain.linearRampToValueAtTime(vol || 0.12, now() + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now() + dur);
    o.connect(g); g.connect(master);
    o.start(now()); o.stop(now() + dur + 0.02);
  }

  /* Шумовой всплеск — бумага, щелчки, помехи. */
  function noise(dur, filterFreq, vol, type) {
    if (!on || !init()) return;
    if (ctx.state === 'suspended') ctx.resume();
    var len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = ctx.createBufferSource(); src.buffer = buf;
    var f = ctx.createBiquadFilter();
    f.type = type || 'bandpass';
    f.frequency.value = filterFreq || 1400;
    f.Q.value = 0.9;
    var g = ctx.createGain(); g.gain.value = vol || 0.1;
    src.connect(f); f.connect(g); g.connect(master);
    src.start();
  }

  /* Отдельная шина для музыки: эффекты обязаны быть слышны
     поверх неё, поэтому у музыки свой узел и своя громкость. */
  var music = null;
  function musicBus() {
    if (!init()) return null;
    if (!music) {
      music = ctx.createGain();
      music.gain.value = 0.62;
      music.connect(master);
    }
    return music;
  }

  var API = {

    enabled: function () { return on; },

    /* Музыка живёт в том же AudioContext: два контекста на
       странице — это два разных представления о времени. */
    context: function () { return init() ? ctx : null; },
    musicBus: musicBus,

    toggle: function () {
      on = !on;
      try { localStorage.setItem('aqiqat_sound', on ? '1' : '0'); } catch (e) {}
      if (!on) { API.stopHum(); API.stopRain(); API.timePulse(false); }
      else API.startHum();
      return on;
    },

    /* --- атмосфера ------------------------------------------ */

    /* Дождь по окну: фильтрованный шум с медленной модуляцией.
       Плюс редкий дальний гром — раз в полторы-три минуты. */
    startRain: function () {
      if (!on || !init() || rain) return;
      if (ctx.state === 'suspended') ctx.resume();
      var len = ctx.sampleRate * 2;
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      var src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      var f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 4200; f.Q.value = 0.4;
      var g = ctx.createGain(); g.gain.value = 0;
      g.gain.linearRampToValueAtTime(0.016, now() + 4);
      var lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 0.11; lg.gain.value = 0.006;
      lfo.connect(lg); lg.connect(g.gain);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(); lfo.start();
      rain = { src: src, g: g, lfo: lfo };

      function thunder() {
        if (!rain) return;
        API.thunder();
        thunderTimer = setTimeout(thunder, 90000 + Math.random() * 90000);
      }
      thunderTimer = setTimeout(thunder, 45000 + Math.random() * 60000);
    },

    stopRain: function () {
      clearTimeout(thunderTimer);
      if (!rain) return;
      try {
        rain.g.gain.linearRampToValueAtTime(0, now() + 1.2);
        rain.src.stop(now() + 1.4); rain.lfo.stop(now() + 1.4);
      } catch (e) {}
      rain = null;
    },

    /* Дальний гром: низкий шум с долгим хвостом. */
    thunder: function () {
      if (!on || !init()) return;
      var len = Math.floor(ctx.sampleRate * 2.6);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        var t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * (0.4 + 0.6 * Math.sin(t * 9));
      }
      var src = ctx.createBufferSource(); src.buffer = buf;
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 130;
      var g = ctx.createGain(); g.gain.value = 0.4;
      src.connect(f); f.connect(g); g.connect(master);
      src.start();
    },

    /* Щелчок гаснущего окна — крошечный, тёплый. */
    windowOff: function () { noise(0.03, 1900, 0.05); tone(392, 0.06, 'sine', 0.03); },

    /* Дальняя сирена: вода дошла до посёлка. */
    siren: function () {
      if (!on || !init()) return;
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(560, now());
      o.frequency.linearRampToValueAtTime(760, now() + 0.7);
      o.frequency.linearRampToValueAtTime(560, now() + 1.4);
      o.frequency.linearRampToValueAtTime(760, now() + 2.1);
      g.gain.setValueAtTime(0, now());
      g.gain.linearRampToValueAtTime(0.028, now() + 0.3);
      g.gain.linearRampToValueAtTime(0.0001, now() + 2.6);
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
      o.connect(f); f.connect(g); g.connect(master);
      o.start(); o.stop(now() + 2.7);
    },

    /* Низкий пульс уходящего времени. Включается на последнем часе. */
    timePulse: function (active) {
      clearInterval(pulseTimer);
      pulseTimer = null;
      if (!active || !on) return;
      pulseTimer = setInterval(function () {
        tone(48, 0.5, 'sine', 0.07);
      }, 2400);
    },

    /* Тихий гул лампы и терминала. Идёт всю смену. */
    startHum: function () {
      if (!on || !init() || hum) return;
      if (ctx.state === 'suspended') ctx.resume();
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sine'; o.frequency.value = 51;
      o2.type = 'sine'; o2.frequency.value = 102.6;
      f.type = 'lowpass'; f.frequency.value = 220;
      g.gain.value = 0;
      g.gain.linearRampToValueAtTime(0.05, now() + 2.5);
      o.connect(f); o2.connect(f); f.connect(g); g.connect(master);
      o.start(); o2.start();
      hum = { o: o, o2: o2, g: g };
    },

    stopHum: function () {
      if (!hum) return;
      try {
        hum.g.gain.linearRampToValueAtTime(0, now() + 0.8);
        hum.o.stop(now() + 1); hum.o2.stop(now() + 1);
      } catch (e) {}
      hum = null;
    },

    /* --- интерфейс ---------------------------------------- */

    click:    function () { noise(0.035, 2600, 0.07); },
    open:     function () { noise(0.16, 900, 0.09, 'lowpass'); tone(180, 0.1, 'sine', 0.05); },
    hover:    function () { tone(1800, 0.03, 'sine', 0.018); },

    /* Инструмент отработал — короткий сканирующий свип. */
    tool: function () {
      if (!on || !init()) return;
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(320, now());
      o.frequency.exponentialRampToValueAtTime(1250, now() + 0.28);
      g.gain.setValueAtTime(0.05, now());
      g.gain.exponentialRampToValueAtTime(0.0001, now() + 0.32);
      var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 4;
      o.connect(f); f.connect(g); g.connect(master);
      o.start(); o.stop(now() + 0.34);
    },

    /* Инструмент ничего не дал. Глухо. */
    blind: function () { tone(140, 0.22, 'sine', 0.07); noise(0.1, 400, 0.05, 'lowpass'); },

    /* Найдено противоречие — щелчок замка. */
    finding: function () {
      noise(0.04, 3200, 0.1);
      tone(880, 0.09, 'triangle', 0.09);
      setTimeout(function () { tone(1320, 0.12, 'triangle', 0.07); }, 55);
    },

    /* Найдено подтверждение — теплее, ниже. */
    corroborate: function () {
      tone(523, 0.14, 'sine', 0.08);
      setTimeout(function () { tone(784, 0.18, 'sine', 0.06); }, 70);
    },

    /* Пара не сошлась. */
    reject: function () { tone(196, 0.14, 'square', 0.045); },

    /* Штамп вердикта. */
    stamp: function () {
      noise(0.07, 260, 0.24, 'lowpass');
      tone(96, 0.16, 'sine', 0.14);
    },

    /* Кнопка сноса — резкий обрыв, ничего человеческого. */
    takedown: function () {
      noise(0.05, 5000, 0.16, 'highpass');
      tone(1400, 0.04, 'square', 0.1);
      setTimeout(function () { tone(70, 0.5, 'sine', 0.16); }, 60);
    },

    /* Новое сообщение от человека. */
    message: function () { tone(1046, 0.07, 'sine', 0.05); setTimeout(function () { tone(1568, 0.09, 'sine', 0.04); }, 80); },

    /* SENIM печатает. */
    type: function () { noise(0.012, 3800, 0.022); },

    /* Смена акта — низкий сдвиг. */
    act: function () { tone(64, 0.9, 'sine', 0.12); noise(0.5, 300, 0.04, 'lowpass'); },

    /* Время на исходе. */
    urgent: function () { tone(220, 0.12, 'square', 0.05); setTimeout(function () { tone(220, 0.12, 'square', 0.05); }, 190); },

    /* Рассвет — гул и дождь уходят, остаётся тишина. */
    dawn: function () {
      API.stopHum();
      API.stopRain();
      API.timePulse(false);
      if (!on || !init()) return;
      tone(261.6, 2.2, 'sine', 0.07);
      setTimeout(function () { tone(392, 2.4, 'sine', 0.05); }, 400);
      setTimeout(function () { tone(523.3, 3.0, 'sine', 0.04); }, 900);
    }
  };

  return API;
})();
