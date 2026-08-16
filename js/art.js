/* ============================================================
   AQIQAT — ГРАФИКА
   ------------------------------------------------------------
   Сцены рисуются процедурно в SVG. Раньше здесь были
   абстрактные полоски, и живой игрок принял их за
   незагрузившуюся картинку — справедливо. Теперь каждая сцена
   обязана читаться с первого взгляда: узнаваемые дома, люди,
   лодки, документ с печатью и подписью.

   Если у входящего задано поле image — рисуется настоящий
   файл, а это остаётся запасным вариантом. Подмена одного на
   другое не требует изменений в коде.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.ART = (function () {

  var W = 340, H = 200;

  function rnd(seed) {
    var s = seed % 2147483647; if (s <= 0) s += 2147483646;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  function hash(str) {
    var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h) || 7;
  }

  /* Человек — самая важная деталь: она мгновенно превращает
     набор фигур в сцену. */
  function person(x, y, s, fill) {
    s = s || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" fill="' + (fill || '#0d1116') + '">' +
      '<circle cx="0" cy="-9" r="4.2"/>' +
      '<path d="M-4.4 -4 h8.8 a2 2 0 0 1 2 2 v9 a2 2 0 0 1 -2 2 h-8.8 a2 2 0 0 1 -2 -2 v-9 a2 2 0 0 1 2 -2 z"/>' +
      '<rect x="-3.6" y="8" width="2.6" height="8" rx="1"/>' +
      '<rect x="1" y="8" width="2.6" height="8" rx="1"/>' +
    '</g>';
  }

  function house(x, y, w, h, roofH, wall, roof) {
    return '<g>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + wall + '"/>' +
      '<path d="M' + (x - 5) + ' ' + y + ' L' + (x + w / 2) + ' ' + (y - roofH) + ' L' + (x + w + 5) + ' ' + y + ' Z" fill="' + roof + '"/>' +
    '</g>';
  }

  function water(y, r, light) {
    var s = '<rect y="' + y + '" width="' + W + '" height="' + (H - y) + '" fill="#173845"/>';
    for (var i = 0; i < 26; i++) {
      var yy = y + 4 + r() * (H - y - 6);
      s += '<rect x="' + (r() * W).toFixed(0) + '" y="' + yy.toFixed(0) + '" width="' +
        (16 + r() * 74).toFixed(0) + '" height="1.6" rx="0.8" fill="' + (light || '#4e93a8') +
        '" opacity="' + (0.12 + r() * 0.32).toFixed(2) + '"/>';
    }
    return s;
  }

  function nightSky() {
    return '<rect width="' + W + '" height="' + H + '" fill="#0e1620"/>' +
      '<rect width="' + W + '" height="86" fill="#16222e"/>';
  }

  /* ---- сцены ---------------------------------------------- */

  var SCENES = {

    /* Обрушенный мост: виден разрыв пролёта и фары на том берегу. */
    bridge: function (r) {
      var s = nightSky();
      s += water(112, r);
      // опоры
      s += '<rect x="60" y="74" width="16" height="42" fill="#1b232c"/>';
      s += '<rect x="230" y="74" width="16" height="42" fill="#1b232c"/>';
      // дорожное полотно с разрывом
      s += '<path d="M0 72 L64 72 L118 96 L142 116" stroke="#2b3540" stroke-width="11" fill="none" stroke-linecap="round"/>';
      s += '<path d="M340 70 L238 70 L196 92" stroke="#2b3540" stroke-width="11" fill="none" stroke-linecap="round"/>';
      // ограждение
      s += '<path d="M0 65 L62 65 M340 63 L240 63" stroke="#3c4855" stroke-width="2"/>';
      // машина с фарами на дальнем краю
      s += '<rect x="276" y="55" width="30" height="11" rx="3" fill="#232d38"/>';
      s += '<rect x="283" y="49" width="16" height="7" rx="2" fill="#232d38"/>';
      s += '<circle cx="277" cy="63" r="2.6" fill="#ffd98a"/>';
      s += '<path d="M275 63 L232 74 L232 54 Z" fill="#ffd98a" opacity=".14"/>';
      // люди на краю обрыва
      s += person(52, 68, 0.85, '#0b0f14');
      s += person(40, 68, 0.8, '#0b0f14');
      return s;
    },

    /* Затопленные дома по крышу и люди на крышах. */
    flood: function (r) {
      var s = '<rect width="' + W + '" height="' + H + '" fill="#10202a"/>';
      // небо и деревья на горизонте (та самая летняя листва)
      s += '<rect width="' + W + '" height="58" fill="#1c2b2f"/>';
      var veg = 'M0 58';
      for (var x = 0; x <= W; x += 20) veg += ' Q' + (x + 10) + ' ' + (40 + r() * 10) + ' ' + (x + 20) + ' 58';
      s += '<path d="' + veg + ' L' + W + ' 58 L0 58 Z" fill="#1d3826"/>';
      s += water(58, r, '#5aa3b8');
      // дома, торчащие из воды по конёк
      var spots = [[16, 118, 62], [104, 132, 74], [206, 122, 66], [284, 142, 60]];
      spots.forEach(function (p, i) {
        var x = p[0], y = p[1], w = p[2];
        // видимая часть стены под коньком
        s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="10" fill="#2a2620"/>';
        s += '<path d="M' + (x - 6) + ' ' + y + ' L' + (x + w / 2) + ' ' + (y - 26) + ' L' + (x + w + 6) + ' ' + y + ' Z" fill="#3a3128"/>';
        // конёк
        s += '<rect x="' + (x - 6) + '" y="' + (y - 1) + '" width="' + (w + 12) + '" height="2.4" fill="#4a3f33"/>';
        // ватерлиния вплотную
        s += '<rect x="' + (x - 10) + '" y="' + (y + 8) + '" width="' + (w + 20) + '" height="2.6" rx="1.3" fill="#6fb3c6" opacity=".55"/>';
        if (i === 1) { s += person(x + w / 2 - 8, y - 22, 0.8, '#141a20'); s += person(x + w / 2 + 6, y - 20, 0.7, '#141a20'); }
      });
      return s;
    },

    /* Спасение: лодка, фонарь, семья на крыше, мокрый снег. */
    rescue: function (r) {
      var s = nightSky();
      // голые ветки — мартовская улика
      s += '<path d="M0 0 L34 40 M34 40 L18 62 M34 40 L62 52 M62 52 L58 72" stroke="#1a2028" stroke-width="2.6" fill="none"/>';
      s += water(120, r);
      // конус света
      s += '<path d="M244 44 L330 132 L162 148 Z" fill="#ffeec2" opacity=".10"/>';
      // крыша с семьёй
      s += '<path d="M18 152 L88 100 L158 152 Z" fill="#241f1a"/>';
      s += '<rect x="14" y="150" width="148" height="3" fill="#3d332a"/>';
      s += person(72, 96, 0.9, '#101519');
      s += person(92, 100, 0.72, '#101519');
      s += person(106, 102, 0.6, '#101519');
      // лодка
      s += '<path d="M196 150 L300 150 L288 166 L208 166 Z" fill="#1d2c36"/>';
      s += '<rect x="196" y="147" width="104" height="3" rx="1.5" fill="#2e4插"/>'.replace('#2e4插', '#2e454f');
      s += person(232, 138, 0.85, '#123039');
      s += person(262, 140, 0.8, '#123039');
      s += '<circle cx="244" cy="44" r="4" fill="#fff2cf"/>';
      // мокрый снег
      for (var j = 0; j < 46; j++) {
        s += '<rect x="' + (r() * W).toFixed(0) + '" y="' + (r() * H).toFixed(0) +
          '" width="1.2" height="' + (3 + r() * 6).toFixed(0) + '" rx="0.6" fill="#d6e9f2" opacity="' +
          (0.14 + r() * 0.3).toFixed(2) + '" transform="rotate(14 170 100)"/>';
      }
      return s;
    },

    /* Видеообращение: человек за столом, флаг, окно с ДНЕВНЫМ светом. */
    portrait: function (r) {
      var s = '<rect width="' + W + '" height="' + H + '" fill="#191c21"/>';
      // окно — ключевая улика
      s += '<rect x="238" y="22" width="82" height="70" fill="#7ea3ba"/>';
      s += '<rect x="238" y="22" width="82" height="70" fill="none" stroke="#2c333c" stroke-width="4"/>';
      s += '<line x1="279" y1="22" x2="279" y2="92" stroke="#2c333c" stroke-width="3"/>';
      s += '<line x1="238" y1="57" x2="320" y2="57" stroke="#2c333c" stroke-width="3"/>';
      // флаг не с той стороны
      s += '<rect x="26" y="16" width="4.5" height="96" fill="#2f3740"/>';
      s += '<path d="M30.5 20 L82 30 L82 58 L30.5 48 Z" fill="#1f5f78"/>';
      s += '<circle cx="54" cy="38" r="6" fill="#e8c86a" opacity=".8"/>';
      // стол
      s += '<rect y="152" width="' + W + '" height="48" fill="#241d17"/>';
      s += '<rect y="150" width="' + W + '" height="4" fill="#3a2f24"/>';
      // фигура
      s += '<path d="M108 152 q52 -34 104 0 z" fill="#232a32"/>';
      s += '<rect x="132" y="118" width="56" height="34" fill="#232a32"/>';
      s += '<circle cx="160" cy="98" r="26" fill="#3a4149"/>';
      s += '<rect x="150" y="118" width="20" height="12" fill="#1b2129"/>';
      // артефакт генерации — смазанная челюсть
      s += '<path d="M136 106 Q160 128 184 106" stroke="#454e58" stroke-width="4" fill="none" opacity=".55"/>';
      // нижняя плашка
      s += '<rect y="176" width="' + W + '" height="24" fill="#0d1116" opacity=".9"/>';
      s += '<rect x="14" y="184" width="130" height="4" rx="2" fill="#48525d"/>';
      s += '<rect x="14" y="191" width="80" height="3" rx="1.5" fill="#333c46"/>';
      return s;
    },

    /* Официальный документ: шапка, герб, печать, подпись. */
    notice: function (r) {
      var s = '<rect width="' + W + '" height="' + H + '" fill="#d9d5cb"/>';
      s += '<rect x="14" y="10" width="' + (W - 28) + '" height="' + (H - 20) + '" fill="#f6f3ec"/>';
      // герб
      s += '<circle cx="44" cy="38" r="13" fill="none" stroke="#7c7666" stroke-width="2"/>';
      s += '<circle cx="44" cy="38" r="6" fill="#a49c88"/>';
      // заголовок
      s += '<rect x="66" y="30" width="150" height="6" rx="3" fill="#4a463c"/>';
      s += '<rect x="66" y="41" width="96" height="4" rx="2" fill="#8d8674"/>';
      s += '<line x1="26" y1="60" x2="' + (W - 26) + '" y2="60" stroke="#b3ac9b" stroke-width="1.4"/>';
      // тело
      var y = 74;
      for (var i = 0; i < 6; i++) {
        s += '<rect x="26" y="' + y + '" width="' + (150 + r() * 140).toFixed(0) + '" height="4" rx="2" fill="#6b6558" opacity="' + (0.55 + r() * 0.35).toFixed(2) + '"/>';
        y += 13;
      }
      // печать
      s += '<circle cx="' + (W - 66) + '" cy="' + (y + 18) + '" r="24" fill="none" stroke="#7a2f3a" stroke-width="2.4" opacity=".7"/>';
      s += '<circle cx="' + (W - 66) + '" cy="' + (y + 18) + '" r="17" fill="none" stroke="#7a2f3a" stroke-width="1.4" opacity=".55"/>';
      s += '<rect x="' + (W - 86) + '" y="' + (y + 15) + '" width="40" height="5" fill="#7a2f3a" opacity=".55"/>';
      // подпись
      s += '<path d="M30 ' + (y + 20) + ' q16 -14 30 0 t28 -6 t22 8" stroke="#37436b" stroke-width="2.2" fill="none"/>';
      s += '<rect x="26" y="' + (y + 32) + '" width="70" height="3" rx="1.5" fill="#9a9384"/>';
      return s;
    },

    /* Тревожная «внутренняя записка» — тот же документ, но красный. */
    alert: function (r) {
      var s = SCENES.notice(r);
      s += '<rect x="14" y="10" width="' + (W - 28) + '" height="' + (H - 20) + '" fill="#8e1f2b" opacity=".10"/>';
      s += '<rect x="' + (W / 2 - 62) + '" y="16" width="124" height="26" rx="3" fill="#8e1f2b" opacity=".9"/>';
      s += '<rect x="' + (W / 2 - 44) + '" y="26" width="88" height="6" rx="3" fill="#f4e6e6"/>';
      return s;
    },

    /* График водомера. */
    chart: function (r) {
      var s = '<rect width="' + W + '" height="' + H + '" fill="#0f151c"/>';
      for (var g = 0; g < 6; g++) {
        s += '<line x1="28" y1="' + (28 + g * 27) + '" x2="' + (W - 22) + '" y2="' + (28 + g * 27) + '" stroke="#1d2733" stroke-width="1"/>';
      }
      var pts = [], n = 28;
      for (var i = 0; i < n; i++) {
        var x = 30 + i * ((W - 56) / (n - 1));
        var t = i / (n - 1);
        pts.push(x.toFixed(1) + ',' + (162 - Math.sin(t * Math.PI) * 104 - r() * 4).toFixed(1));
      }
      s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#45ded0" stroke-width="2.6"/>';
      s += '<line x1="' + (30 + (W - 56) / 2) + '" y1="24" x2="' + (30 + (W - 56) / 2) + '" y2="172" stroke="#f5b23d" stroke-width="1.2" stroke-dasharray="4 4" opacity=".75"/>';
      s += '<rect x="28" y="174" width="' + (W - 50) + '" height="1.4" fill="#2c3846"/>';
      return s;
    }
  };

  /* ---- деградация -----------------------------------------
     Фото в соцсети — не иллюстрация, а скриншот скриншота:
     зерно, виньетка, наклон в полградуса, таймстамп камеры.
     Чем больше репостов пережила картинка, тем она грязнее. */

  function degradeLayers(fid, heavy) {
    var s = '';
    s += '<rect width="' + W + '" height="' + H + '" filter="url(#' + fid + 'n)" opacity="' + (heavy ? '.4' : '.24') + '"/>';
    s += '<rect width="' + W + '" height="' + H + '" fill="url(#' + fid + 'v)"/>';
    if (heavy) {
      /* полосы пережатого видео */
      s += '<rect y="64" width="' + W + '" height="7" fill="#88a" opacity=".05"/>';
      s += '<rect y="128" width="' + W + '" height="5" fill="#000" opacity=".08"/>';
    }
    return s;
  }

  function degradeDefs(fid) {
    return '<filter id="' + fid + 'n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>' +
      '<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.55 0.55 0.55 0 0"/></filter>' +
      '<radialGradient id="' + fid + 'v" cx="0.5" cy="0.5" r="0.75">' +
        '<stop offset="0.55" stop-color="#000" stop-opacity="0"/>' +
        '<stop offset="1" stop-color="#000" stop-opacity="0.5"/>' +
      '</radialGradient>' +
      '<filter id="' + fid + 's"><feColorMatrix type="matrix" values="0.5 0.4 0.15 0 0.06  0.35 0.45 0.12 0 0.05  0.24 0.3 0.1 0 0.02  0 0 0 1 0"/></filter>';
  }

  return {
    /* Тот же силуэт человека и тот же дом, что и в сценах улик —
       переиспользуются в анимации визита Андрея/Али, чтобы не
       заводить второй визуальный язык для одной игры. */
    person: person,
    house: house,

    render: function (id, seedStr, opts) {
      if (!id || !SCENES[id]) return '';
      opts = opts || {};
      var seed = hash(String(seedStr || id));
      var fid = 'dg' + seed;
      var r = rnd(seed);
      var tilt = ((seed % 2 ? 1 : -1) * 0.5).toFixed(2);
      return '<svg class="media-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" role="img">' +
        '<defs>' + degradeDefs(fid) + '</defs>' +
        '<g transform="rotate(' + tilt + ' ' + (W / 2) + ' ' + (H / 2) + ') scale(1.03) translate(-5,-3)">' +
          SCENES[id](r) +
        '</g>' +
        degradeLayers(fid, !!opts.heavy) +
        (opts.time
          ? '<text x="' + (W - 8) + '" y="' + (H - 8) + '" text-anchor="end" ' +
            'font-family="ui-monospace,monospace" font-size="9" fill="#ffd98a" opacity=".8">' + opts.time + '</text>'
          : '') +
        '<rect width="' + W + '" height="' + H + '" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="2"/>' +
      '</svg>';
    },

    /* ---- визуальные артефакты инструментов ------------------
       Каждая проверка возвращает картинку, а не строку.
       Атомы-кнопки остаются ниже — механика не меняется. ---- */

    /* Обратный поиск: твой кадр | архивная копия в сепии.
       Если у входящего есть растровое фото — сравниваем его же,
       а не процедурную сцену. */
    splitVis: function (artId, seedStr, pct, labelNow, labelArch, imgUrl) {
      if (!imgUrl && (!artId || !SCENES[artId])) return '';
      var seed = hash(String(seedStr || artId || imgUrl));
      var fid = 'sp' + seed;
      var mini = imgUrl
        ? function () { return '<image href="' + imgUrl + '" x="0" y="0" width="' + W + '" height="' + H + '" preserveAspectRatio="xMidYMid slice"/>'; }
        : function () { return '<g>' + SCENES[artId](rnd(seed)) + '</g>'; };
      return '<svg class="tvis" viewBox="0 0 ' + W + ' 118" preserveAspectRatio="xMidYMid meet">' +
        '<defs>' + degradeDefs(fid) + '</defs>' +
        '<g transform="scale(0.485)"><g transform="scale(1,1.16)">' + mini() + '</g></g>' +
        '<g transform="translate(175,0) scale(0.485)"><g transform="scale(1,1.16)" filter="url(#' + fid + 's)">' + mini() + '</g></g>' +
        '<rect x="165" width="4" height="118" fill="#060a12"/>' +
        '<rect x="4" y="4" width="52" height="13" rx="2" fill="#060a12" opacity=".78"/>' +
        '<text x="9" y="13.6" font-family="ui-monospace,monospace" font-size="8.4" fill="#8fd4e8">' + labelNow + '</text>' +
        '<rect x="173" y="4" width="92" height="13" rx="2" fill="#060a12" opacity=".78"/>' +
        '<text x="178" y="13.6" font-family="ui-monospace,monospace" font-size="8.4" fill="#f5b23d">' + labelArch + '</text>' +
        '<rect x="124" y="48" width="92" height="22" rx="11" fill="#060a12" opacity=".92"/>' +
        '<rect x="124" y="48" width="92" height="22" rx="11" fill="none" stroke="#4fd0e8" stroke-width="1.2" opacity=".7"/>' +
        '<text x="170" y="63" text-anchor="middle" font-family="ui-monospace,monospace" font-size="11.4" font-weight="700" fill="#4fd0e8">' + pct + '</text>' +
      '</svg>';
    },

    /* Геолокация: две булавки — «заявлено» и «на самом деле». */
    geoVis: function (match, labelA, labelB) {
      var s = '<svg class="tvis" viewBox="0 0 340 96" preserveAspectRatio="xMidYMid meet">' +
        '<rect width="340" height="96" fill="#0b1424"/>' +
        '<path d="M -4 88 C 60 74, 120 66, 200 46 C 260 32, 300 24, 344 12" stroke="#1d4f66" stroke-width="7" fill="none" opacity=".8"/>' +
        '<path d="M 20 20 q 30 8 60 2 M 220 80 q 40 -6 80 -10 M 120 30 q 26 4 40 0" stroke="#16304a" stroke-width="1.2" fill="none"/>';
      function pin(x, y, color, label, anchor) {
        return '<path d="M ' + x + ' ' + y + ' c -7 -12 -7 -19 0 -19 c 7 0 7 7 0 19 z" fill="' + color + '"/>' +
          '<circle cx="' + x + '" cy="' + (y - 13) + '" r="3" fill="#060a12"/>' +
          '<rect x="' + (anchor === 'end' ? x - 4 - label.length * 6.4 : x + 4) + '" y="' + (y - 38) + '" width="' + (label.length * 6.4 + 8) + '" height="14" rx="2" fill="#060a12" opacity=".85"/>' +
          '<text x="' + (anchor === 'end' ? x - label.length * 6.4 : x + 8) + '" y="' + (y - 27.6) + '" font-family="ui-monospace,monospace" font-size="9.4" fill="' + color + '">' + label + '</text>';
      }
      if (match) {
        s += pin(170, 62, '#5ec98a', labelA, 'start');
      } else {
        s += '<path d="M 96 58 L 258 40" stroke="#e05663" stroke-width="1" stroke-dasharray="4 3" opacity=".7"/>';
        s += pin(96, 62, '#e05663', labelA, 'start');
        s += pin(258, 44, '#4fd0e8', labelB, 'end');
      }
      return s + '</svg>';
    },

    /* Время: где должно быть солнце — и что на фото. */
    timeVis: function (label, contradiction) {
      return '<svg class="tvis" viewBox="0 0 340 72" preserveAspectRatio="xMidYMid meet">' +
        '<rect width="340" height="72" fill="#0b1424"/>' +
        '<line x1="16" y1="52" x2="324" y2="52" stroke="#2a3a52" stroke-width="1.4"/>' +
        '<path d="M 60 52 A 110 110 0 0 1 280 52" stroke="#2a3a52" stroke-width="1" stroke-dasharray="3 4" fill="none"/>' +
        '<circle cx="170" cy="64" r="7" fill="#f5b23d" opacity=".9"/>' +
        '<line x1="160" y1="74" x2="180" y2="54" stroke="' + (contradiction ? '#e05663' : '#5ec98a') + '" stroke-width="2"/>' +
        '<line x1="180" y1="74" x2="160" y2="54" stroke="' + (contradiction ? '#e05663' : '#5ec98a') + '" stroke-width="' + (contradiction ? 2 : 0) + '"/>' +
        '<circle cx="292" cy="20" r="6" fill="#d7e0ec" opacity=".85"/>' +
        '<circle cx="294.5" cy="18.5" r="5.4" fill="#0b1424"/>' +
        '<rect x="12" y="8" width="' + (label.length * 6.6 + 10) + '" height="15" rx="2" fill="#060a12" opacity=".85"/>' +
        '<text x="17" y="19" font-family="ui-monospace,monospace" font-size="9.6" fill="' + (contradiction ? '#e05663' : '#8fd4e8') + '">' + label + '</text>' +
      '</svg>';
    },

    /* Дерево источника: цепочка репостов, нулевой пациент.
       good=true — источник настоящий, подсветка зелёная. */
    treeVis: function (zeroLabel, hops, good) {
      var c = good ? '#5ec98a' : '#e05663';
      var bg = good ? '#12281c' : '#241626';
      var s = '<svg class="tvis" viewBox="0 0 340 84" preserveAspectRatio="xMidYMid meet">' +
        '<rect width="340" height="84" fill="#0b1424"/>';
      var xs = [46, 118, 190, 262, 316];
      var n = Math.min(hops || 4, 4);
      for (var i = 0; i < n; i++) {
        s += '<line x1="' + (xs[i] + 10) + '" y1="42" x2="' + (xs[i + 1] - 10) + '" y2="42" stroke="#2a3a52" stroke-width="1.4"/>';
        s += '<path d="M ' + (xs[i + 1] - 14) + ' 38 l 5 4 l -5 4" stroke="#2a3a52" stroke-width="1.4" fill="none"/>';
      }
      for (var j = n; j >= 1; j--) {
        s += '<circle cx="' + xs[j] + '" cy="42" r="7" fill="#16304a" stroke="#2a3a52" stroke-width="1.2"/>';
      }
      s += '<circle cx="' + xs[0] + '" cy="42" r="10" fill="' + bg + '" stroke="' + c + '" stroke-width="2"/>';
      s += '<text x="' + xs[0] + '" y="45.6" text-anchor="middle" font-family="ui-monospace,monospace" font-size="10" font-weight="700" fill="' + c + '">0</text>';
      s += '<rect x="12" y="60" width="' + (zeroLabel.length * 6.6 + 10) + '" height="15" rx="2" fill="#060a12" opacity=".85"/>';
      s += '<text x="17" y="71" font-family="ui-monospace,monospace" font-size="9.6" fill="' + (good ? '#5ec98a' : '#f5b23d') + '">' + zeroLabel + '</text>';
      return s + '</svg>';
    }
  };
})();
