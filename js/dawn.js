/* ============================================================
   AQIQAT — РАССВЕТ
   ------------------------------------------------------------
   Порядок намеренный:
     1. Сколько людей вышло — крупно, первым делом
     2. Посёлок за посёлком, кто уехал и кто нет
     3. Разбор вердиктов
     4. Дана — последствия как человек, а не как счёт
     5. SENIM — чем была та цифра на самом деле
     6. Кнопка удаления — чего стоила свобода слова
     7. d′ и c — только тем, кто проходил тест
   ============================================================ */

window.AQ = window.AQ || {};

AQ.DAWN = (function () {

  var T = null, L = null, G = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function fmtN(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* ---- 1. счёт в людях и рекорд, одной строкой -------------
     Раньше это были два отдельных блока, и оба показывали одно и
     то же число разными словами. Теперь итог читается за один
     взгляд: сколько вывезено, лучше или хуже прошлого раза, и
     сколько это заняло.                                       */

  function headline(S, res) {
    var saved = G.savedNow(S), total = AQ.MAP.totalPop;
    var pct = saved / total;
    var note = pct >= 0.995 ? T('dawnPerfect') : T('dawnBad');
    var run = res && res.run, prev = res && res.prev;

    var cmp = '';
    if (res) {
      if (res.beaten && prev)  cmp = '<span class="d-beat">▲ ' + esc(T('recBeaten', { n: fmtN(run.saved - prev.saved) })) + '</span>';
      else if (prev)           cmp = '<span class="d-miss">' + esc(T('recShort', { n: fmtN(prev.saved - run.saved) })) + '</span>';
      else                     cmp = '<span class="d-first">' + esc(T('recFirst')) + '</span>';
    }

    return '<div class="dtop">' +
      '<div class="dkick">' + T('dawnTitle') + '</div>' +
      '<div class="dbig"><b>' + fmtN(saved) + '</b><span>/ ' + fmtN(total) + '</span></div>' +
      '<div class="dsub">' + esc(T('saved')) + ' · ' + esc(note) + '</div>' +
      '<div class="dbar"><i style="width:' + (pct * 100) + '%"></i></div>' +
      (res ? '<div class="drec">' + cmp +
        '<span class="d-meta">' + T('recRuns') + ' ' + res.runs +
        ' · ' + T('recBest') + ' ' + fmtN(res.beaten || !prev ? run.saved : prev.saved) +
        ' · ' + run.minutes + ' ' + T('minutes') + '</span></div>' : '') +
    '</div>';
  }

  /* ---- 2. разбор: что было, что ты сказал, чего это стоило --
     Раньше это были ДВЕ секции: отдельно список посёлков и
     отдельно разбор вердиктов — и они не были связаны, хотя
     говорят об одном. Теперь одна таблица: строка на входящее, и
     сразу видно, скольким людям это стоило.

     Здесь же чинится «наполовину»: игрок сказал ПРАВДА, было
     ПРАВДА — и получил половину, потому что оценка складывается
     из ДВУХ вопросов, а показывали только один. Теперь видно
     оба, и рядом одной строкой сказано, чего не хватило.     */

  function verdictLabel(r) {
    var callLabel = { real: 'vReal', fake: 'vFake', unsure: 'vUnsure' };
    if (r.removed) return T('takedown');
    if (r.missed || !r.call) return '—';
    var s = callLabel[r.call] ? T(callLabel[r.call]) : '—';
    if (r.call === 'fake') {
      var p = r.part === 'photo' ? 'pPhoto' : r.part === 'story' ? 'pStory' : 'pBoth';
      s += ' · ' + T(p).toLowerCase();
    }
    return s;
  }

  /* Что было на самом деле — ОБА ответа, потому что оценка
     считается по обоим. */
  function truthLabel(it) {
    var claimKey = { 'true': 'wasTrue', 'fake': 'wasFake', 'unresolved': 'wasUnres' };
    var s = T(claimKey[it.truth.claim]);
    if (it.truth.photo === 'fake') s += ' · ' + T('photoWasFake');
    else if (it.truth.photo === 'real') s += ' · ' + T('photoWasReal');
    return s;
  }

  /* Почему не полный балл. Одна фраза, ровно на тот случай,
     который выпал. */
  function whyPartial(it, r) {
    var Tr = it.truth;
    if (r.grade !== 'partial') return '';
    if (Tr.claim === 'true' && r.call === 'real' && Tr.photo === 'fake') return T('whyPhotoMissed');
    if (Tr.claim === 'true' && r.call === 'fake' && r.part === 'photo') return T('whyPhotoOk');
    if (Tr.claim === 'fake' && r.call === 'fake' && r.part === 'photo') return T('whyStoryMissed');
    if (Tr.claim === 'fake' && r.call === 'fake' && r.part === 'both') return T('whyPhotoBlamed');
    if (Tr.claim === 'unresolved') return T('whyUnresolvable');
    return T('whyHalf');
  }

  function ledger(S) {
    var rows = S.items.map(function (it, i) {
      var r = S.resolved[it.id] || { missed: true };
      var cls, label;

      if (r.removed)      { cls = 'bad'; label = T('rRemoved'); }
      else if (r.missed)  { cls = 'gone'; label = T('rMissed'); }
      else if (r.grade === 'right')   { cls = 'ok';  label = T('rCorrect'); }
      else if (r.grade === 'partial') { cls = 'mid'; label = T('rPartial'); }
      else                            { cls = 'bad'; label = T('rWrong'); }

      /* Цена в людях — только там, где акт вообще касался
         конкретного посёлка. */
      var people = '';
      var vid = it.village;
      if (vid && vid !== 'all' && vid !== 'route' && S.villages[vid]) {
        var v = G.village(vid);
        var st = S.villages[vid];
        var safe = Math.round(st.locked ? st.saved : v.pop * G.evacProgress(S, vid));
        var pct = safe / v.pop;
        people = '<div class="lp ' + (pct >= 0.98 ? 'ok' : pct >= 0.5 ? 'mid' : 'bad') + '">' +
          esc(L(v.name)) + ' <b>' + fmtN(safe) + '</b>/' + fmtN(v.pop) + '</div>';
      }

      var why = whyPartial(it, r);

      return '<div class="lrow ' + cls + '" style="animation-delay:' + (i * 45) + 'ms">' +
        '<div class="lmain">' +
          '<div class="t">' + esc(L(it.text).slice(0, 64)) + (L(it.text).length > 64 ? '…' : '') + '</div>' +
          '<div class="m">' +
            '<span class="ls">' + T('youSaid') + ' ' + esc(verdictLabel(r)) + '</span>' +
            '<span class="lw">' + T('itWas') + ' ' + esc(truthLabel(it)) + '</span>' +
          '</div>' +
          (why ? '<div class="lhalf">' + esc(why) + '</div>' : '') +
        '</div>' +
        people +
        '<div class="v">' + label + '</div>' +
      '</div>';
    }).join('');

    return '<div class="dsect dledger"><h3>' + T('reveal') + '</h3><div class="ledger">' + rows + '</div></div>';
  }

  /* ---- 3. Дана и Ерасыл, рядом ---------------------------- */

  function human(S) {
    var decided = S.profile.fake + S.profile.real + S.profile.unsure;
    var followed = decided ? Math.round(S.profile.senimFollow / decided * 100) : 0;
    var rightCount = 0;
    S.items.forEach(function (it) {
      var tc = it.truth.claim === 'true' ? 'real' : it.truth.claim === 'fake' ? 'fake' : 'unsure';
      if (it.senim.verdict === tc) rightCount++;
    });
    var acc = Math.round(rightCount / S.items.length * 100);

    return '<div class="dsect dpair">' +
      '<div class="dana">' +
        '<div class="dana-who">' + T('danaName') + '</div>' +
        '<div class="dana-msg">' + esc(L(AQ.NIGHT.danaEndings[G.danaGrade(S)])) + '</div>' +
      '</div>' +
      '<div class="ybox">' +
        '<div class="yb-h">' + T('senimName') + '</div>' +
        '<div class="yb-n">' +
          '<span><i>' + T('senimYouFollowed') + '</i><b>' + followed + '%</b></span>' +
          '<span><i>' + T('senimItWasRight') + '</i><b class="' + (acc < followed - 20 ? 'bad' : '') + '">' + acc + '%</b></span>' +
        '</div>' +
        (Math.abs(followed - acc) > 20
          ? '<div class="yb-t">' + esc(T('senimGap', { gap: Math.abs(followed - acc) })) + '</div>' : '') +
      '</div>' +
    '</div>';
  }

  /* ---- какая это была ночь --------------------------------
     Игрок должен уйти с мыслью «а в другой раз будет иначе».
     Поэтому здесь прямо перечислено, какие варианты выпали, и
     сколько всего ночей умеет собрать игра.                 */

  function nightCard(S) {
    var acts = AQ.SCENARIO.ensureActs(AQ.NIGHT);
    var total = acts.reduce(function (n, a) { return n * a.variants.length; }, 1);

    var rows = S.items.map(function (it) {
      var a = AQ.SCENARIO.act(AQ.NIGHT, it.id);
      var n = a ? a.variants.length : 1;
      return '<div class="nv-row">' +
        '<span class="nv-t">' + esc(L(it.text).slice(0, 46)) + '…</span>' +
        '<span class="nv-v">' + esc(it.vid) + '</span>' +
        '<span class="nv-n">1 / ' + n + '</span>' +
      '</div>';
    }).join('');

    return '<div class="nightbox">' +
        '<div class="nv-list">' + rows + '</div>' +
        '<p class="nv-note">' + esc(T('nightNote', { total: fmtN(total) })) + '</p>' +
        '<div class="nv-seed">' +
          '<span>' + T('nightSeed') + '</span><code>' + esc(S.seed) + '</code>' +
          '<button class="nv-again" id="btn-sameseed">' + T('nightSame') + '</button>' +
        '</div>' +
      '</div>';
  }

  /* ---- 6. кнопка ------------------------------------------ */

  function freedom(S) {
    var n = S.profile.takedown;
    var body = n === 0 ? T('foeNone') : T('foeSome', { n: n, foe: Math.round(S.meters.foe) });
    return '<h4>' + T('foeTitle') + '</h4><div class="callout">' + esc(body) + '</div>';
  }

  /* ---- 7. d′ — только для тех, кто проходил тест ---------- */

  function debrief(S) {
    if (!S.withTest) return '';
    var pre = G.testResult('pre'), post = G.testResult('post');
    var dD = post.d - pre.d, cD = post.c - pre.c;

    var dCls = dD > 0.3 ? 'up' : dD < -0.3 ? 'down' : 'flat';
    var dTag = dD > 0.3 ? T('sharper') : dD < -0.3 ? T('duller') : T('unchanged');
    var cCls = Math.abs(cD) > 0.3 ? 'down' : 'flat';
    var cTag = cD > 0.3 ? T('moreSkeptic') : cD < -0.3 ? T('lessSkeptic') : T('unchanged');

    var verdict, vCls;
    if (dD < 0.25 && cD > 0.3)        { verdict = 'verdictCynic';    vCls = 'cynic'; }
    else if (dD >= 0.35 && cD <= 0.3) { verdict = 'verdictReal';     vCls = 'real'; }
    else if (cD < -0.3 && dD < 0.25)  { verdict = 'verdictGullible'; vCls = ''; }
    else                              { verdict = 'verdictFlat';     vCls = ''; }

    return '<h4>' + T('debriefTitle') + '</h4>' +
      '<div class="sdt">' +
        box('dPrime', 'dPrimeD', pre.d, post.d, dCls, dTag) +
        box('bias', 'biasD', pre.c, post.c, cCls, cTag) +
      '</div>' +
      '<div class="callout ' + vCls + '">' + esc(T(verdict)) + '</div>';
  }

  /* ---- всё техническое — за одним кликом -------------------
     Сид, выпавшие варианты, свобода слова и математика d′ важны
     для повторной игры и для заявки, но не для того, чтобы
     понять итог ночи. Поэтому они свёрнуты и не занимают
     экран. */

  function details(S) {
    return '<details class="dmore">' +
      '<summary>' + T('dawnMore') + '</summary>' +
      '<div class="dmore-in">' +
        '<h4>' + T('nightTitle') + '</h4>' + nightCard(S) +
        freedom(S) +
        debrief(S) +
      '</div>' +
    '</details>';
  }

  function box(labelKey, descKey, before, after, cls, tag) {
    return '<div class="sdtbox ' + cls + '">' +
      '<div class="l">' + T(labelKey) + '</div>' +
      '<div class="d">' + T(descKey) + '</div>' +
      '<div class="nums"><span class="n1">' + before.toFixed(2) + '</span>' +
      '<span class="ar">→</span><span class="n2">' + after.toFixed(2) + '</span></div>' +
      '<div class="tag">' + T('before') + ' → ' + T('after') + ' · ' + tag + '</div>' +
    '</div>';
  }

  /* ---- выгрузка для плейтестов ---------------------------- */

  function resultLine(S) {
    var out = [
      'DeepTruth night01',
      'lang=' + AQ.lang,
      'saved=' + G.savedNow(S) + '/' + AQ.MAP.totalPop,
      'credibility=' + Math.round(S.meters.cred),
      'freedom=' + Math.round(S.meters.foe),
      'takedowns=' + S.profile.takedown,
      'senim_followed=' + S.profile.senimFollow,
      'tools=' + S.profile.toolUses,
      'fake=' + S.profile.fake,
      'real=' + S.profile.real,
      'unsure=' + S.profile.unsure,
      'dam=' + (S.resolved['aqsu_dam'] ? (S.resolved['aqsu_dam'].grade || 'missed') : 'missed'),
      'source=' + (S.injected.join('+') || '-'),
      'dana=' + G.danaGrade(S),
      /* Сид и выпавшие варианты — иначе результаты плейтестов
         с разных ночей нельзя сравнивать между собой. */
      'seed=' + S.seed,
      'variants=' + S.items.map(function (it) { return it.id + ':' + it.vid; }).join(','),
      'minutes=' + Math.round((Date.now() - S.startedAt) / 60000)
    ];
    if (S.withTest) {
      var pre = G.testResult('pre'), post = G.testResult('post');
      out.splice(2, 0,
        'dprime_pre=' + pre.d.toFixed(3), 'dprime_post=' + post.d.toFixed(3),
        'c_pre=' + pre.c.toFixed(3), 'c_post=' + post.c.toFixed(3));
    }
    return out.join('\t');
  }

  /* ============================================================ */

  return {
    render: function () {
      T = AQ.T; L = AQ.L; G = AQ.Game;
      var S = AQ.S;

      /* Забег записывается один раз: смена языка перерисовывает
         рассвет, а второй записи быть не должно. */
      if (!S._recorded) S._recorded = AQ.RECORDS.commit(S);

      document.getElementById('scr-dawn').innerHTML =
        '<div class="dawn">' +
          headline(S, S._recorded) +
          ledger(S) +
          human(S) +
          details(S) +
          '<div class="again">' +
            '<button id="btn-again">' + T('replay') + '</button>' +
            '<button class="copy" id="btn-copy">' + T('shareResult') + '</button>' +
            '<div class="h">' + esc(T('replayHint')) + '</div>' +
          '</div>' +
        '</div>';

      document.getElementById('btn-again').onclick = function () {
        AQ.SFX.click(); AQ.Game.reset(); AQ.S.phase = 'menu'; AQ.UI.init();
      };

      /* «Та же ночь» — чтобы можно было решить иначе и увидеть,
         что было бы. Это и есть главный повод сыграть второй раз. */
      var same = document.getElementById('btn-sameseed');
      if (same) same.onclick = function () {
        AQ.SFX.click();
        var seed = S.seed;
        AQ.Game.reset(false, seed);
        AQ.S.phase = 'menu';
        AQ.UI.init();
        AQ.UI.startWithSeed(seed);
      };

      document.getElementById('btn-copy').onclick = function () {
        var line = resultLine(S), btn = document.getElementById('btn-copy');
        function ok() { btn.textContent = T('copied'); AQ.SFX.finding(); }
        if (navigator.clipboard) navigator.clipboard.writeText(line).then(ok, function () { fb(line, ok); });
        else fb(line, ok);
      };

      function fb(text, cb) {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); cb(); } catch (e) {}
        document.body.removeChild(ta);
      }
    },
    resultLine: resultLine
  };
})();
