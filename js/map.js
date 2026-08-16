/* ============================================================
   AQIQAT — КАРТА
   ------------------------------------------------------------
   Не граф, а место. Стилизованная тактическая карта в духе
   Rebel Inc: рельеф, река, дороги, скопления домиков с тёплыми
   окнами, дамба, мост, туман. Иконки и атмосфера, не реализм.

   Правило палитры: ТЁПЛЫЙ ЦВЕТ = ЖИВЫЕ ЛЮДИ. Окна горят, пока
   в посёлке кто-то есть. Эвакуация — окна гаснут по одному.
   Затопление — гаснут разом, и на воде остаётся красный отсвет.

   Вокруг каждого посёлка — дуга доверия: насколько тебе там
   верят. Она тает от ошибок и решает, как быстро люди выходят.
   Карта — симуляция доверия, а не индикатор очков.

   Вся сцена лежит в <g id="mworld">: камера (js/fx.js) наезжает
   на посёлок простым CSS-трансформом этой группы.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.MapView = (function () {

  var W = 100, H = 68;
  var el = null;
  var geoCache = {};       // маршруты эвакуации: точки + длины
  var houseCache = {};     // раскладка домиков по посёлкам

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function rnd(seed) {
    var s = seed % 2147483647; if (s <= 0) s += 2147483646;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  function hash(str) {
    var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h) || 7;
  }

  function village(id) {
    for (var i = 0; i < AQ.MAP.villages.length; i++) if (AQ.MAP.villages[i].id === id) return AQ.MAP.villages[i];
    return null;
  }

  /* ---- геометрия маршрутов -------------------------------- */

  function routeGeom(id) {
    if (geoCache[id]) return geoCache[id];
    var pts = AQ.MAP.evacRoutes[id];
    var cum = [0], total = 0;
    for (var i = 1; i < pts.length; i++) {
      var dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
      total += Math.sqrt(dx * dx + dy * dy);
      cum.push(total);
    }
    return (geoCache[id] = { pts: pts, cum: cum, total: total });
  }

  function pointAt(id, t) {
    var g = routeGeom(id);
    var d = Math.max(0, Math.min(1, t)) * g.total;
    for (var i = 1; i < g.cum.length; i++) {
      if (d <= g.cum[i]) {
        var f = (d - g.cum[i - 1]) / ((g.cum[i] - g.cum[i - 1]) || 1);
        return {
          x: g.pts[i - 1][0] + (g.pts[i][0] - g.pts[i - 1][0]) * f,
          y: g.pts[i - 1][1] + (g.pts[i][1] - g.pts[i - 1][1]) * f
        };
      }
    }
    var last = g.pts[g.pts.length - 1];
    return { x: last[0], y: last[1] };
  }

  /* ---- раскладка домиков ---------------------------------- */

  function clusterRadius(pop) { return 2.1 + Math.sqrt(pop) * 0.075; }

  /* Посёлок — не россыпь одинаковых коробок, а маленький город:
     администрация, школа, магазины, жильё двух видов, а в
     крупных посёлках ещё и больница. Улицы прокладываются по
     ближайшим соседям, на перекрёстках стоят фонари, у обочин —
     редкие машины. Всё детерминировано по seed: посёлок из ночи
     в ночь выглядит одинаково. */
  function blocks(v) {
    if (houseCache[v.id]) return houseCache[v.id];
    var n = Math.max(7, Math.min(22, Math.round(v.pop / 58)));
    var r = rnd(hash(v.id));
    var rx = clusterRadius(v.pop), ry = rx * 0.72;
    var out = [];
    var guard = 0;
    while (out.length < n && guard++ < 500) {
      var a = r() * Math.PI * 2, d = Math.sqrt(r());
      var x = Math.cos(a) * d * rx, y = Math.sin(a) * d * ry;
      var ok = true;
      for (var i = 0; i < out.length; i++) {
        var dx = out[i].x - x, dy = out[i].y - y;
        if (dx * dx + dy * dy < 1.3) { ok = false; break; }
      }
      if (ok) out.push({ x: x, y: y, rot: (r() - 0.5) * 20, s: 0.85 + r() * 0.3 });
    }

    /* Роли: самое близкое к центру здание — администрация,
       следующее — школа, в крупных посёлках дальше больница. */
    out.sort(function (a, b) { return (a.x * a.x + a.y * a.y) - (b.x * b.x + b.y * b.y); });
    var roles = ['admin', 'school'];
    if (v.pop >= 800) roles.push('clinic');
    roles.push('shop');
    if (v.pop >= 600) roles.push('shop');
    out.forEach(function (h, i) {
      h.kind = roles[i] || (r() < 0.42 ? 'flat' : 'house');
    });

    /* Улицы: цепочка по ближайшему непосещённому соседу. */
    var left = out.slice(), chain = [left.shift()];
    while (left.length) {
      var last = chain[chain.length - 1], bi = 0, bd = 1e9;
      left.forEach(function (p, i) {
        var dx = p.x - last.x, dy = p.y - last.y, dd = dx * dx + dy * dy;
        if (dd < bd) { bd = dd; bi = i; }
      });
      chain.push(left.splice(bi, 1)[0]);
    }
    var streets = [];
    for (var s = 0; s + 1 < chain.length; s++) {
      streets.push([chain[s].x, chain[s].y, chain[s + 1].x, chain[s + 1].y]);
    }

    /* Фонари на каждом третьем узле, машины у каждого пятого. */
    var lamps = [], cars = [];
    chain.forEach(function (p, i) {
      if (i % 3 === 1) lamps.push({ x: p.x + 0.55, y: p.y - 0.7 });
      if (i % 5 === 2) cars.push({ x: p.x - 0.8, y: p.y + 0.7, rot: (r() - 0.5) * 50 });
    });

    /* Порядок, в котором гаснут окна. */
    var order = out.map(function (_, i) { return i; });
    for (var j = order.length - 1; j > 0; j--) {
      var k = Math.floor(r() * (j + 1)), t = order[j]; order[j] = order[k]; order[k] = t;
    }
    out.forEach(function (h, i) { h.off = order.indexOf(i); });

    return (houseCache[v.id] = { list: out, streets: streets, lamps: lamps, cars: cars });
  }

  function houses(v) { return blocks(v).list; }

  /* Семь силуэтов. Каждый — несколько примитивов, но с первого
     взгляда читается, что это школа, а что жилой дом. */
  function buildingSvg(kind) {
    switch (kind) {
      case 'admin':
        return '<rect class="hwall" x="-1.15" y="-0.6" width="2.3" height="1.2"/>' +
               '<rect class="hroof flat" x="-1.3" y="-0.75" width="2.6" height="0.2"/>' +
               '<path class="hmast" d="M 0 -0.75 V -1.5"/><path class="hflag" d="M 0 -1.5 L 0.6 -1.35 L 0 -1.2 Z"/>' +
               '<rect class="hwin" x="-0.75" y="-0.35" width="0.42" height="0.42"/>' +
               '<rect class="hwin" x="0.32" y="-0.35" width="0.42" height="0.42"/>';
      case 'school':
        return '<rect class="hwall" x="-1.35" y="-0.5" width="2.7" height="1.1"/>' +
               '<rect class="hroof flat" x="-1.45" y="-0.62" width="2.9" height="0.16"/>' +
               '<rect class="hwin" x="-1.05" y="-0.3" width="0.34" height="0.36"/>' +
               '<rect class="hwin" x="-0.35" y="-0.3" width="0.34" height="0.36"/>' +
               '<rect class="hwin" x="0.35" y="-0.3" width="0.34" height="0.36"/>';
      case 'clinic':
        return '<rect class="hwall" x="-1" y="-0.55" width="2" height="1.15"/>' +
               '<rect class="hroof flat" x="-1.1" y="-0.68" width="2.2" height="0.18"/>' +
               '<path class="hcross" d="M -0.28 -0.1 H 0.28 M 0 -0.38 V 0.18"/>' +
               '<rect class="hwin" x="0.5" y="-0.3" width="0.3" height="0.34"/>';
      case 'shop':
        return '<rect class="hwall" x="-0.85" y="-0.35" width="1.7" height="0.95"/>' +
               '<rect class="hawn" x="-1" y="-0.42" width="2" height="0.22" rx=".08"/>' +
               '<rect class="hwin wide" x="-0.6" y="-0.12" width="1.2" height="0.4"/>';
      case 'flat':
        return '<rect class="hwall" x="-1" y="-0.9" width="2" height="1.5"/>' +
               '<rect class="hroof flat" x="-1.1" y="-1.02" width="2.2" height="0.16"/>' +
               '<rect class="hwin" x="-0.68" y="-0.7" width="0.34" height="0.32"/>' +
               '<rect class="hwin" x="0.34" y="-0.7" width="0.34" height="0.32"/>' +
               '<rect class="hwin" x="-0.68" y="-0.2" width="0.34" height="0.32"/>' +
               '<rect class="hwin" x="0.34" y="-0.2" width="0.34" height="0.32"/>';
      default:  /* house */
        return '<rect class="hwall" x="-0.8" y="-0.45" width="1.6" height="1.05"/>' +
               '<path class="hroof" d="M -1 -0.45 L 0 -1.15 L 1 -0.45 Z"/>' +
               '<rect class="hwin" x="-0.3" y="-0.22" width="0.6" height="0.5"/>';
    }
  }

  /* ---- статические слои ----------------------------------- */

  function terrain() {
    /* Высокий берег у Петропавла светлее, низины у реки темнее.
       Горизонтали как на топокарте — карта, а не заливка. */
    var s = '<rect class="mground" width="' + W + '" height="' + H + '"/>';
    s += '<path class="mhigh" d="M 58 0 L 104 0 L 104 22 C 92 16, 80 18, 68 10 C 63 6, 60 3, 58 0 Z"/>';
    var contours = [
      'M -2 60 C 18 54, 30 48, 44 41 C 58 34, 66 28, 80 20',
      'M -2 54 C 16 49, 28 43, 42 36 C 55 30, 64 24, 78 16',
      'M 4 68 C 22 62, 34 56, 48 49 C 60 43, 70 37, 84 28',
      'M -2 47 C 14 43, 26 37, 40 31'
    ];
    contours.forEach(function (d) { s += '<path class="mcontour" d="' + d + '"/>'; });
    /* редкие штрихи полей */
    var r = rnd(20260812);
    for (var i = 0; i < 26; i++) {
      var x = r() * W, y = r() * H;
      // не рисуем поля в реке и на высоком берегу
      s += '<line class="mfield" x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) +
        '" x2="' + (x + 1.6 + r() * 1.4).toFixed(1) + '" y2="' + (y - 0.4).toFixed(1) + '"/>';
    }
    return s;
  }

  function waterLayers() {
    var d = AQ.MAP.river;
    return '<path class="mflood-glow" id="mfloodglow" d="' + d + '"/>' +
      '<path class="mflood-edge" id="mfloodedge" d="' + d + '"/>' +
      '<path class="mflood" id="mflood" d="' + d + '"/>' +
      '<path class="mriver-hl" d="' + d + '"/>';
  }

  function damObj() {
    /* Дамба поперёк реки выше Ақсу. Ломается видимо. */
    return '<g class="mdam" id="mdam">' +
      '<line class="dam-wall" x1="44.6" y1="41.0" x2="47.4" y2="45.0"/>' +
      '<line class="dam-top"  x1="44.6" y1="41.0" x2="47.4" y2="45.0"/>' +
      '<g class="dam-break">' +
        '<path class="dam-burst" d="M 46 43 q 3 1.2 5.5 0.4 q -2.5 2 -5.5 1.4 Z"/>' +
        '<line class="dam-crack" x1="45.6" y1="42.4" x2="46.4" y2="43.6"/>' +
      '</g>' +
      '<text class="mv-tag" x="43.2" y="47.6">' + esc(AQ.L(AQ.MAP.dam.name)) + '</text>' +
    '</g>';
  }

  function bridgeObj() {
    /* Мост М-36 — там, где трасса физически пересекает реку. */
    var b = AQ.MAP.bridgeDeck;
    var midX = (b.x1 + b.x2) / 2, midY = (b.y1 + b.y2) / 2;
    /* перила — параллельные линии со сдвигом поперёк настила */
    var dx = b.x2 - b.x1, dy = b.y2 - b.y1;
    var len = Math.sqrt(dx * dx + dy * dy);
    var nx = -dy / len * 0.75, ny = dx / len * 0.75;
    return '<g class="mbridge" id="mbridge">' +
      '<line class="br-deck" x1="' + b.x1 + '" y1="' + b.y1 + '" x2="' + b.x2 + '" y2="' + b.y2 + '"/>' +
      '<line class="br-rail" x1="' + (b.x1 + nx) + '" y1="' + (b.y1 + ny) + '" x2="' + (b.x2 + nx) + '" y2="' + (b.y2 + ny) + '"/>' +
      '<line class="br-rail" x1="' + (b.x1 - nx) + '" y1="' + (b.y1 - ny) + '" x2="' + (b.x2 - nx) + '" y2="' + (b.y2 - ny) + '"/>' +
      '<text class="mv-tag" x="' + (midX + 5.5) + '" y="' + (midY + 1) + '">' + esc(AQ.L(AQ.MAP.route.name)) + '</text>' +
      '<text class="br-blocked" x="' + (midX - 0.8) + '" y="' + (midY + 1.2) + '">✕</text>' +
      '<g class="mjam" id="mjam">' +
        [0, 1, 2, 3, 4].map(function (i) {
          return '<circle r=".5" cx="' + (59.4 + (i % 3) * 1.3) + '" cy="' + (36.6 + Math.floor(i / 3) * 1.2) + '"/>';
        }).join('') +
      '</g>' +
    '</g>';
  }

  function landmarks() {
    return AQ.MAP.landmarks.map(function (m) {
      var icon = m.kind === 'hospital'
        ? '<rect x="-1" y="-1" width="2" height="2" rx=".35" class="lm-box"/>' +
          '<path d="M -0.5 0 H 0.5 M 0 -0.5 V 0.5" class="lm-cross"/>'
        : '<rect x="-1.1" y="-0.8" width="2.2" height="1.6" rx=".25" class="lm-box"/>' +
          '<path d="M -1.3 -0.8 L 0 -1.5 L 1.3 -0.8" class="lm-roof"/>';
      return '<g class="mlm" data-lm="' + m.id + '" transform="translate(' + m.x + ',' + m.y + ')">' +
        '<circle class="lm-hit" r="2.2"/>' + icon +
        '<text class="mv-tag" y="2.6">' + esc(AQ.L(m.name)) + '</text></g>';
    }).join('');
  }

  function roads() {
    return AQ.MAP.roads.map(function (line) {
      var d = 'M ' + line.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L ');
      return '<path class="mroad-base" d="' + d + '"/><path class="mroad" d="' + d + '"/>';
    }).join('');
  }

  function safeZone() {
    var safe = AQ.MAP.safeZone;
    var b = '';
    /* Петропавл — городок из зданий покрупнее, с горящими окнами */
    var blds = [[-3.4, 0.4, 2.1, 1.7], [-1, -0.6, 1.7, 2.6], [1, 0.2, 2.4, 1.9], [-2.6, -1.9, 1.8, 1.3], [0.4, -2.2, 1.6, 1.4]];
    blds.forEach(function (p) {
      b += '<rect class="city-b" x="' + p[0] + '" y="' + p[1] + '" width="' + p[2] + '" height="' + p[3] + '" rx=".2"/>';
      b += '<rect class="city-w" x="' + (p[0] + p[2] * 0.28) + '" y="' + (p[1] + p[3] * 0.3) + '" width=".42" height=".42"/>';
      b += '<rect class="city-w" x="' + (p[0] + p[2] * 0.62) + '" y="' + (p[1] + p[3] * 0.55) + '" width=".42" height=".42"/>';
    });
    return '<circle class="msafe-glow" cx="' + safe.x + '" cy="' + safe.y + '" r="10" fill="url(#safeg)"/>' +
      '<g class="msafe" transform="translate(' + safe.x + ',' + safe.y + ')">' + b +
        '<text class="msafe-name" y="4.6">' + esc(AQ.L(safe.name)) + '</text>' +
        '<text class="msafe-note" y="6.9">' + esc(AQ.L(safe.note)) + '</text>' +
      '</g>';
  }

  function fog() {
    return '<g class="mfogs">' +
      '<ellipse class="mfog f1" cx="30" cy="52" rx="16" ry="5"/>' +
      '<ellipse class="mfog f2" cx="62" cy="44" rx="13" ry="4"/>' +
      '<ellipse class="mfog f3" cx="18" cy="30" rx="10" ry="3.6"/>' +
    '</g>';
  }

  function villageGroup(v) {
    var b = blocks(v);
    var rx = clusterRadius(v.pop);
    var ringR = rx + 1.6;
    var C = (2 * Math.PI * ringR).toFixed(2);

    var streetSvg = '<g class="mstreets">' + b.streets.map(function (s) {
      return '<line x1="' + s[0].toFixed(2) + '" y1="' + s[1].toFixed(2) +
             '" x2="' + s[2].toFixed(2) + '" y2="' + s[3].toFixed(2) + '"/>';
    }).join('') + '</g>';

    var lampSvg = '<g class="mlamps">' + b.lamps.map(function (l) {
      return '<circle class="lamp-glow" cx="' + l.x.toFixed(2) + '" cy="' + l.y.toFixed(2) + '" r="0.9"/>' +
             '<circle class="lamp-dot"  cx="' + l.x.toFixed(2) + '" cy="' + l.y.toFixed(2) + '" r="0.16"/>';
    }).join('') + '</g>';

    var carSvg = '<g class="mcars">' + b.cars.map(function (c) {
      return '<rect x="' + (c.x - 0.28).toFixed(2) + '" y="' + (c.y - 0.14).toFixed(2) +
             '" width="0.56" height="0.28" rx="0.1" transform="rotate(' + c.rot.toFixed(0) +
             ' ' + c.x.toFixed(2) + ' ' + c.y.toFixed(2) + ')"/>';
    }).join('') + '</g>';

    var houseSvg = b.list.map(function (h, i) {
      return '<g class="mhouse k-' + h.kind + '" data-i="' + i + '" transform="translate(' +
        h.x.toFixed(2) + ',' + h.y.toFixed(2) + ') rotate(' + h.rot.toFixed(1) +
        ') scale(' + h.s.toFixed(2) + ')">' + buildingSvg(h.kind) + '</g>';
    }).join('');

    return '<g class="mvil" data-v="' + v.id + '" transform="translate(' + v.x + ',' + v.y + ')">' +
      '<circle class="mv-hit" r="' + (ringR + 1.2) + '"/>' +
      '<ellipse class="mv-floodzone" rx="' + (rx + 1.8) + '" ry="' + (rx * 0.78 + 1.5) + '"/>' +
      '<circle class="mv-ring" r="' + ringR + '"/>' +
      '<circle class="mv-trust" r="' + ringR + '" stroke-dasharray="0 ' + C + '" data-c="' + C + '"/>' +
      streetSvg + lampSvg + carSvg + houseSvg +
      '<text class="mv-badge" y="' + (-rx - 1.6) + '"></text>' +
      '<text class="mv-name" y="' + (rx + 2.8) + '">' + esc(AQ.L(v.name)) + '</text>' +
      '<text class="mv-pop" y="' + (rx + 5.2) + '"></text>' +
    '</g>';
  }

  function dotCount(v) { return Math.max(4, Math.min(14, Math.round(v.pop / 90))); }

  function peds() {
    return AQ.MAP.villages.map(function (v) {
      var n = dotCount(v), s = '';
      for (var i = 0; i < n; i++) {
        s += '<circle class="mped" data-v="' + v.id + '" data-i="' + i + '" r="0.5" cx="' + v.x + '" cy="' + v.y + '"/>';
      }
      return s;
    }).join('');
  }

  /* ---- сборка --------------------------------------------- */

  function build() {
    return '<svg class="mapsvg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">' +
      '<defs>' +
        '<radialGradient id="safeg">' +
          '<stop offset="0" stop-color="#5ec98a" stop-opacity=".22"/>' +
          '<stop offset="1" stop-color="#5ec98a" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<filter id="fogblur" x="-40%" y="-40%" width="180%" height="180%">' +
          '<feGaussianBlur stdDeviation="2.2"/>' +
        '</filter>' +
        '<filter id="glow" x="-80%" y="-80%" width="260%" height="260%">' +
          '<feGaussianBlur stdDeviation="0.7"/>' +
        '</filter>' +
      '</defs>' +
      '<g class="mworld" id="mworld">' +
        terrain() +
        waterLayers() +
        roads() +
        damObj() +
        bridgeObj() +
        landmarks() +
        safeZone() +
        peds() +
        AQ.MAP.villages.map(villageGroup).join('') +
        fog() +
      '</g>' +
    '</svg>';
  }

  /* ---- обновление ----------------------------------------- */

  var BADGE = { evacuated: '✓', halted: '⏸', flooded: '≋' };

  function update() {
    var S = AQ.S;
    if (!S || !el) return;
    var G = AQ.Game;

    /* Вода: река раздувается от русла наружу. Максимум подобран
       так, чтобы разлив подступал к Петропавлу на высоком берегу,
       но не накрывал его. Дальние посёлки топит не русло, а
       собственная зона разлива (mv-floodzone). */
    var lvl = G.waterLevel(S);
    var wWater = (2.4 + lvl * 8).toFixed(2);
    var wEdge  = (2.4 + lvl * 8 + 1.2).toFixed(2);
    var wGlow  = (2.4 + lvl * 8 + 3.5).toFixed(2);
    var f = el.querySelector('#mflood');
    var fe = el.querySelector('#mfloodedge');
    var fg = el.querySelector('#mfloodglow');
    if (f)  f.style.strokeWidth = wWater;
    if (fe) fe.style.strokeWidth = wEdge;
    if (fg) fg.style.strokeWidth = wGlow;

    /* Дамбу прорывает ровно тогда, когда об этом приходит слух.
       Карта и лента новостей обязаны рассказывать одно и то же:
       если в посте написано «прорвало», игрок должен увидеть это
       на карте — и наоборот. */
    var dam = el.querySelector('#mdam');
    if (dam) dam.classList.toggle('broken', G.damBroken(S));

    /* мост: перекрыт слухом / затор */
    var bridge = el.querySelector('#mbridge');
    if (bridge) bridge.classList.toggle('blocked', !!S.routeBlocked);
    var jam = el.querySelector('#mjam');
    if (jam) jam.classList.toggle('on', G.bridgeLoad(S) >= 4);

    AQ.MAP.villages.forEach(function (v) {
      var st = S.villages[v.id];
      var g = el.querySelector('.mvil[data-v="' + v.id + '"]');
      if (!g) return;

      g.setAttribute('class', 'mvil s-' + st.status + (st.pending ? ' pending' : ''));

      /* дуга доверия */
      var tr = g.querySelector('.mv-trust');
      if (tr) {
        var C = parseFloat(tr.dataset.c);
        tr.setAttribute('stroke-dasharray', (C * st.trust / 100).toFixed(2) + ' ' + C);
      }

      /* окна: гаснут по мере выхода людей */
      var hs = houses(v);
      var prog = G.evacProgress(S, v.id);
      var dark = st.status === 'flooded' || st.status === 'evacuated'
        ? hs.length
        : Math.round(prog * hs.length);
      hs.forEach(function (h, i) {
        var hg = g.querySelector('.mhouse[data-i="' + i + '"]');
        if (hg) hg.classList.toggle('dark', h.off < dark);
      });

      /* бейдж состояния */
      var badge = g.querySelector('.mv-badge');
      if (badge) badge.textContent = BADGE[st.status] || '';

      var pop = g.querySelector('.mv-pop');
      if (pop) {
        pop.textContent = st.status === 'flooded'
          ? Math.round(st.saved) + '/' + v.pop
          : (st.status === 'evacuated' ? '✓ ' + v.pop : String(v.pop));
      }

      /* люди по дорогам */
      var n = dotCount(v);
      for (var i = 0; i < n; i++) {
        var d = el.querySelector('.mped[data-v="' + v.id + '"][data-i="' + i + '"]');
        if (!d) continue;
        var t = Math.max(0, Math.min(1, prog * (1 + (i / n) * 0.55) - (i / n) * 0.42));
        var p;
        if (t >= 0.99) {
          /* дошли — расселяются в Петропавле, а не стоят в одной точке */
          p = { x: 82.7 + (i % 4) * 0.9, y: 14.4 + Math.floor(i / 4) * 0.85 };
        } else {
          p = pointAt(v.id, t);
        }
        d.setAttribute('cx', p.x.toFixed(2));
        d.setAttribute('cy', p.y.toFixed(2));
        d.setAttribute('class', 'mped' + (t >= 0.99 ? ' safe' : '') +
          (st.status === 'flooded' && t < 0.99 ? ' lost' : '') +
          (st.status === 'halted' && t < 0.99 && t > 0 ? ' stalled' : ''));
      }
    });
  }

  /* ============================================================
     КАМЕРА
     ------------------------------------------------------------
     Единственный владелец трансформа мира. Раньше в него писал
     напрямую AQ.FX, и с появлением пользовательского зума они
     бы подрались. Теперь наезд после вердикта — это временная
     камера, которая возвращается туда, где её оставил игрок, а
     не в положение по умолчанию.

     Уровень детализации задаётся атрибутом на контейнере, всё
     остальное решает CSS: ни одного вычисления в кадре.
     ============================================================ */

  var cam = { k: 1, cx: W / 2, cy: H / 2 };   // где игрок оставил камеру
  var camTimer = null, tempCam = false;

  function clampCam(c) {
    c.k = Math.max(1, Math.min(3.2, c.k));
    /* край мира не должен заезжать внутрь кадра */
    var halfW = W / (2 * c.k), halfH = H / (2 * c.k);
    c.cx = Math.max(halfW, Math.min(W - halfW, c.cx));
    c.cy = Math.max(halfH, Math.min(H - halfH, c.cy));
    return c;
  }

  function applyCam(c, dur) {
    var world = el && el.querySelector('#mworld');
    if (!world) return;
    var tx = W / 2 - c.k * c.cx, ty = H / 2 - c.k * c.cy;
    world.style.transitionDuration = (dur == null ? 1.05 : dur) + 's';
    world.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + c.k.toFixed(3) + ')';
    if (el) {
      el.dataset.lod = c.k < 1.5 ? '1' : (c.k < 2.4 ? '2' : '3');
      /* Подписи не должны расти вместе с миром: их размер
         делится на масштаб камеры и остаётся читаемым. */
      el.style.setProperty('--camk', c.k.toFixed(3));
    }
  }

  var camera = {
    get: function () { return { k: cam.k, cx: cam.cx, cy: cam.cy }; },

    set: function (k, cx, cy, dur) {
      cam.k = k;
      if (cx != null) cam.cx = cx;
      if (cy != null) cam.cy = cy;
      clampCam(cam);
      tempCam = false;
      clearTimeout(camTimer);
      applyCam(cam, dur);
    },

    nudge: function (dk, ox, oy) {
      var next = { k: cam.k * dk, cx: cam.cx, cy: cam.cy };
      /* зум к точке под курсором, а не к центру кадра */
      if (ox != null) {
        next.cx = ox + (cam.cx - ox) / dk;
        next.cy = oy + (cam.cy - oy) / dk;
      }
      clampCam(next);
      cam = next;
      tempCam = false;
      clearTimeout(camTimer);
      applyCam(cam, 0.28);
    },

    pan: function (dx, dy) {
      cam.cx -= dx / cam.k; cam.cy -= dy / cam.k;
      clampCam(cam);
      applyCam(cam, 0);
    },

    reset: function () { camera.set(1, W / 2, H / 2, 0.7); },

    /* Наезд после вердикта: показать последствие и вернуться. */
    focus: function (vid, holdMs) {
      var p = (vid === 'all' || vid === 'route' || !vid)
        ? { x: 63, y: 27 } : (village(vid) || { x: W / 2, y: H / 2 });
      var k = Math.max(cam.k, (vid === 'all' || vid === 'route') ? 1.6 : 2.2);
      tempCam = true;
      clearTimeout(camTimer);
      applyCam(clampCam({ k: k, cx: p.x, cy: p.y }), 0.9);
      if (el) el.dataset.lod = k < 1.5 ? '1' : (k < 2.4 ? '2' : '3');
      camTimer = setTimeout(function () {
        if (!tempCam) return;
        tempCam = false;
        applyCam(cam, 1.0);
      }, holdMs || 1500);
    },

    restore: function () {
      clearTimeout(camTimer);
      if (!tempCam) return;
      tempCam = false;
      applyCam(cam, 0.6);
    }
  };

  /* ---- ввод ------------------------------------------------ */

  function bindInput() {
    var svg = el.querySelector('.mapsvg');
    if (!svg) return;

    /* Зума колесом здесь нет намеренно. Колесо в игре обязано
       означать одно и то же везде — прокрутку той панели, над
       которой курсор. Как только оно начинает менять масштаб
       карты, экран перестаёт вести себя как приложение и
       становится веб-страницей. Приближение живёт на кнопках
       + − ⌂, и там ему и место. */

    /* перетаскивание доступно только когда есть куда двигать */
    var drag = null;
    svg.addEventListener('pointerdown', function (ev) {
      if (cam.k <= 1.01) return;
      drag = { x: ev.clientX, y: ev.clientY, moved: 0 };
      svg.setPointerCapture(ev.pointerId);
    });
    svg.addEventListener('pointermove', function (ev) {
      if (!drag) return;
      var r = svg.getBoundingClientRect();
      var dx = (ev.clientX - drag.x) / r.width * W;
      var dy = (ev.clientY - drag.y) / r.height * H;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      drag.x = ev.clientX; drag.y = ev.clientY;
      camera.pan(dx, dy);
    });
    function endDrag(ev) {
      if (!drag) return;
      var moved = drag.moved; drag = null;
      try { svg.releasePointerCapture(ev.pointerId); } catch (e) {}
      /* если игрок таскал карту, клик по объекту не засчитываем */
      if (moved > 1.5) svg.dataset.dragged = '1';
      else delete svg.dataset.dragged;
    }
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);
  }

  function zoomBar() {
    return '<div class="mapzoom">' +
      '<button data-z="in"  title="+">+</button>' +
      '<button data-z="out" title="−">−</button>' +
      '<button data-z="home" title="⌂">⌂</button>' +
    '</div>';
  }

  /* ---- монтаж --------------------------------------------- */

  return {
    mount: function (container, onVillageClick, onInspect) {
      el = container;
      el.innerHTML = build() + zoomBar();
      el.dataset.lod = '1';
      cam = { k: 1, cx: W / 2, cy: H / 2 };
      tempCam = false;

      function dragged() {
        var svg = el.querySelector('.mapsvg');
        return svg && svg.dataset.dragged === '1';
      }

      el.querySelectorAll('.mvil').forEach(function (g) {
        g.addEventListener('click', function () {
          if (dragged()) return;
          if (onVillageClick) onVillageClick(g.dataset.v);
        });
      });

      /* Кликабельные объекты: мост, дамба, больница, школа,
         Петропавл. Каждый открывает свою карточку. */
      [['#mbridge', 'bridge', 'm36'], ['#mdam', 'dam', 'dam'], ['.msafe', 'safe', 'petropavl']]
        .forEach(function (spec) {
          var node = el.querySelector(spec[0]);
          if (!node) return;
          node.classList.add('clickable');
          node.addEventListener('click', function (ev) {
            ev.stopPropagation();
            if (dragged()) return;
            if (onInspect) onInspect(spec[1], spec[2]);
          });
        });
      el.querySelectorAll('.mlm').forEach(function (node) {
        node.classList.add('clickable');
        node.addEventListener('click', function (ev) {
          ev.stopPropagation();
          if (dragged()) return;
          if (onInspect) onInspect('landmark', node.dataset.lm);
        });
      });

      el.querySelectorAll('.mapzoom button').forEach(function (b) {
        b.onclick = function () {
          AQ.SFX.click();
          if (b.dataset.z === 'in') camera.nudge(1.35);
          else if (b.dataset.z === 'out') camera.nudge(1 / 1.35);
          else camera.reset();
        };
      });

      bindInput();
      applyCam(cam, 0);
      update();
    },
    update: update,
    camera: camera,
    /* нужен обучению: где физически лежит посёлок на экране */
    nodeFor: function (id) { return el ? el.querySelector('.mvil[data-v="' + id + '"]') : null; },
    world: function () { return el ? el.querySelector('#mworld') : null; },
    villagePos: function (id) { var v = village(id); return v ? { x: v.x, y: v.y } : null; },
    size: { w: W, h: H }
  };
})();
