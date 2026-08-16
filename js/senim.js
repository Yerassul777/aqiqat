/* ============================================================
   AQIQAT — ЕРАСЫЛ
   ------------------------------------------------------------
   Раньше это был блок с процентом, потом персонаж без имени.
   Теперь у него есть имя, вторая неделя стажа и цена.

   Ерасыл — младший ассистент службы. Он НЕ выносит вердикт: он
   идёт в архив, вытаскивает оттуда статью по теме и строит
   мнение из неё. Отсюда всё остальное:

     · его мнение ровно настолько хорошее, насколько ему повезло
       со статьёй, и он сам это проговаривает каждый раз;
     · рядом со статьёй ВСЕГДА видна репутация автора — это
       честная зацепка, по которой можно решить, стоит ли
       вообще читать дальше;
     · иногда он приносит не ту статью. Редко, но приносит.

   Он стоит монет, и это меняет его роль в игре. Бесплатную
   подсказку читают не глядя. За платную начинают спрашивать:
   а точно ли она мне сейчас нужна?

   Самая важная сцена здесь прежняя — та, где игрок находит
   улику, опровергающую его мнение, и Ерасыл говорит «я
   ошибся». Тезис игры в этот момент не написан в титрах, а
   происходит на экране.

   Внутренние имена (AQ.SENIM, S.senim, #senimcard) оставлены
   как были: переименовывать их — чистый риск ради нуля пользы,
   персонаж узнаётся по тексту, а не по имени переменной.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.SENIM = (function () {

  var el = null;               // контейнер панели
  var typeTimer = null;
  var lastSaid = 0;            // кулдаун: он не должен тараторить

  function T(k, v) { return AQ.T(k, v); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---- состояние ------------------------------------------ */

  function ensure(S) {
    if (!S.senim) {
      S.senim = { state: 'idle', admitted: {}, shown: 0, followed: 0, line: null, note: null,
                  /* по каким входящим он уже нанят */
                  hired: {} };
    }
    if (!S.senim.hired) S.senim.hired = {};
    return S.senim;
  }

  function hiredOn(S, itemId) { return !!ensure(S).hired[itemId]; }

  function cost(it) {
    var c = it && it.senim && it.senim.cost;
    return c || (AQ.NIGHT.kaya && AQ.NIGHT.kaya.assist) || 20;
  }

  /* Нанять его на конкретное входящее. Деньги списываются один
     раз: перечитывать уже принесённую статью бесплатно. */
  function hire(S, it) {
    if (hiredOn(S, it.id)) return { already: true };
    var c = cost(it);
    if (!AQ.Game.canAfford(S, c)) return { error: 'no-kaya' };
    AQ.Game.spendKaya(S, c);
    ensure(S).hired[it.id] = true;
    return { ok: true, paid: c };
  }

  /* Точность падает по ходу ночи: чем плотнее информационная
     среда, тем хуже машина отличает координированную кампанию
     от массовой ошибки людей. Цифра видна игроку всё время. */
  function accuracy(S) {
    var done = Object.keys(S.resolved || {}).length;
    var a = 91 - done * 4.2;
    if (S.flags && S.flags.coordinated) a -= 7;
    if (S.flags && S.flags.panic_high) a -= 3;
    return Math.max(58, Math.round(a));
  }

  /* ---- аватар: диафрагма ---------------------------------- */

  function avatar(state, size) {
    var s = size || 44;
    var blades = '';
    for (var i = 0; i < 6; i++) {
      var a = i * 60;
      blades += '<path class="sa-blade" transform="rotate(' + a + ' 50 50)" ' +
        'd="M 50 14 L 76 30 L 66 46 L 50 38 Z"/>';
    }
    return '<svg class="senim-eye s-' + state + '" viewBox="0 0 100 100" width="' + s + '" height="' + s + '" aria-hidden="true">' +
      '<circle class="sa-ground" cx="50" cy="50" r="46"/>' +
      '<circle class="sa-ring" cx="50" cy="50" r="42"/>' +
      '<g class="sa-blades">' + blades + '</g>' +
      '<circle class="sa-iris" cx="50" cy="50" r="17"/>' +
      '<circle class="sa-pupil" cx="50" cy="50" r="7"/>' +
      '<rect class="sa-scan" x="4" y="46" width="92" height="8"/>' +
      '<line class="sa-slit" x1="26" y1="50" x2="74" y2="50"/>' +
    '</svg>';
  }

  /* ---- панель --------------------------------------------- */

  /* Шапка одна и та же в обоих состояниях: имя, должность и —
     только когда он уже что-то сказал — его уверенность. */
  function head(S, it, state, hired) {
    return '<div class="sh">' +
      '<div class="senim-ava" id="senim-ava">' + avatar(state) + '</div>' +
      '<div class="senim-id">' +
        '<div class="nm">' + T('senimName') + '</div>' +
        '<div class="sub">' + T('senimFull') + '</div>' +
      '</div>' +
      (hired ? '<div class="conf">' +
        '<span class="l">' + T('trustIndex') + '</span>' +
        '<span class="v">' + it.senim.conf + '%</span>' +
      '</div>' : '') +
    '</div>';
  }

  /* Статья. Репутация автора стоит ПЕРЕД текстом намеренно:
     игрок должен успеть решить, с каким доверием читать, до
     того как текст его убедит. Так работает и настоящая
     медиаграмотность. */
  /* Когда статья написана. Раньше здесь стояло абсолютное время
     из контента — и статья про прорыв дамбы оказывалась
     датирована часом позже, чем идут часы игрока: Ерасыл приносил
     новость из будущего. Теперь дата считается от момента, когда
     пришло само входящее: `after` — минуты после него. Абсолютная
     `date` остаётся только там, где материал осмысленно старый
     (архив, вечерний брифинг до паводка). */
  function articleDate(it, a) {
    if (a.after !== undefined && it && it.arrive !== undefined) {
      return AQ.Game.clockAt(it.arrive + a.after);
    }
    return a.date || '—';
  }

  function articleHtml(it, a) {
    if (!a) return '';
    var rep = a.reputation || 'mixed';
    var repKey = rep === 'good' ? 'repGood' : rep === 'bad' ? 'repBad' : 'repMixed';

    var meta = '<div class="art-meta">' +
      '<span class="am"><i>' + T('artDate') + '</i>' + esc(articleDate(it, a)) + '</span>' +
      (a.city ? '<span class="am"><i>' + T('artCity') + '</i>' + esc(AQ.L(a.city)) + '</span>' : '') +
    '</div>';

    return '<div class="senim-art rep-' + rep + '">' +
      '<div class="art-k">' + T('senimFound') + '</div>' +
      '<div class="art-head">' +
        '<div class="art-src">' + esc(AQ.L(a.source)) + '</div>' +
        '<div class="art-rep">' + T(repKey) + '</div>' +
      '</div>' +
      meta +
      '<div class="art-body">' + esc(AQ.L(a.text)) + '</div>' +
    '</div>';
  }

  function card(S, it, st) {
    var sn = ensure(S);
    var state = sn.state || 'idle';
    var hired = hiredOn(S, it.id);

    /* Пока не нанят — он просто сидит без дела, и видно только
       цену. Никакого процента, никакой подсказки авансом. */
    if (!hired) {
      var c = cost(it);
      var broke = !AQ.Game.canAfford(S, c);
      return '<div class="card senim idle st-idle" id="senimcard">' +
        head(S, it, 'idle', false) +
        '<div class="senim-hire">' +
          '<div class="hire-t">' + T('senimHireTitle') + '</div>' +
          '<div class="hire-p">' + esc(T('senimHirePitch')) + '</div>' +
          '<button class="hire-b' + (broke ? ' poor' : '') + '" id="senim-hire"' + (broke ? ' disabled' : '') + '>' +
            T('senimHireBtn') + '<span class="hb-c">◈ ' + c + '</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    }

    var acc = accuracy(S);
    return '<div class="card senim' + (it.senim.conf >= 88 ? ' hot' : '') + ' st-' + state + '" id="senimcard">' +
      head(S, it, state, true) +
      articleHtml(it, it.senim.article) +
      '<div class="art-k op">' + T('senimOpinion') + '</div>' +
      '<div class="line" id="senimline">' + (st.senimSeen ? esc(AQ.L(it.senim.line)) : '<span class="cursor"></span>') + '</div>' +
      '<div class="senim-caveat">' + esc(T('senimCaveat')) + '</div>' +
      (sn.note ? '<div class="senim-note" id="senimnote">' + esc(sn.note) + '</div>' : '') +
      '<div class="senim-acc' + (acc < 75 ? ' low' : '') + '">' +
        '<span>' + T('senimAccuracy') + '</span>' +
        '<i class="bar"><b style="width:' + acc + '%"></b></i>' +
        '<span class="n">' + acc + '%</span>' +
      '</div>' +
    '</div>';
  }

  function setState(s) {
    var S = AQ.S; if (!S) return;
    ensure(S).state = s;
    var box = document.getElementById('senimcard');
    var ava = document.getElementById('senim-ava');
    if (box) box.className = box.className.replace(/\bst-\w+/, 'st-' + s);
    if (ava) ava.innerHTML = avatar(s);
  }

  /* Печать вывода. Пока печатает — диафрагма в состоянии
     анализа, потом уходит в «уверен» или «сомневается». */
  function typeLine(text, conf) {
    var node = document.getElementById('senimline');
    if (!node) return;
    setState('analysing');
    clearInterval(typeTimer);
    var i = 0; node.textContent = '';
    typeTimer = setInterval(function () {
      if (i >= text.length) {
        clearInterval(typeTimer);
        setState(conf >= 85 ? 'confident' : 'uncertain');
        return;
      }
      node.textContent += text.charAt(i);
      if (i % 3 === 0) AQ.SFX.type();
      i++;
    }, 14);
  }

  /* ---- реплики по ходу работы ------------------------------
     Он комментирует то, что игрок делает прямо сейчас. Это и
     превращает процент в собеседника.                        */

  var COOLDOWN = 4200;

  function say(key, vars) {
    var S = AQ.S; if (!S) return;
    var now = Date.now();
    if (now - lastSaid < COOLDOWN) return;
    lastSaid = now;

    var sn = ensure(S);
    sn.note = T(key, vars);
    var node = document.getElementById('senimnote');
    if (node) { node.textContent = sn.note; node.className = 'senim-note in'; }
    else if (AQ.UI && AQ.UI.renderWork) AQ.UI.renderWork();
    AQ.SFX.message();
  }

  /* Реакция на использованный инструмент. */
  function onTool(res) {
    if (res.blind) say('senimOnBlind');
    else say('senimOnTool');
  }

  /* Реакция на найденное противоречие — и та самая сцена, где
     он признаёт ошибку. Признание срабатывает один раз на
     входящее и только тогда, когда игрок ДОКАЗАЛ обратное. */
  function onFinding(it, r) {
    var S = AQ.S; if (!S) return;
    var sn = ensure(S);

    var refutes = it.senimWrong && r.pivotal && !sn.admitted[it.id];
    if (refutes) {
      sn.admitted[it.id] = true;
      setState('wrong');
      sn.note = T(r.corroborates ? 'senimAdmitConfirm' : 'senimAdmitRefute');
      lastSaid = Date.now();
      AQ.SFX.blind();
      if (AQ.FX) AQ.FX.pulse('danger');
      if (AQ.UI && AQ.UI.renderWork) AQ.UI.renderWork();
      return true;
    }
    say(r.corroborates ? 'senimOnCorroborate' : 'senimOnFinding');
    return false;
  }

  /* ---- пролог ---------------------------------------------
     Полминуты, которые объясняют ставки: что идёт паводок, что
     посёлок трогается только после твоего вердикта и что число
     наверху — живые люди, а не очки.

     Тот, кто это уже слышал и вернулся бить рекорд, получает
     короткую версию: на пятом забеге полный брифинг — это
     полминуты, отнятые у самой игры.                        */

  function seenBefore() {
    try { return localStorage.getItem('aqiqat_tutorial_seen') === '1'; }
    catch (e) { return false; }
  }

  function prologue(onDone) {
    var beats = seenBefore()
      ? [
          { who: 'boot',  text: T('senimBoot') },
          { who: 'senim', text: T('senimHello3') }
        ]
      : [
          { who: 'desk',  text: T('brief1') },
          { who: 'desk',  text: T('brief2') },
          { who: 'desk',  text: T('brief3') },
          { who: 'desk',  text: T('brief4') },
          { who: 'desk',  text: T('brief5') },
          { who: 'boot',  text: T('senimBoot') },
          { who: 'senim', text: T('senimHello1') },
          { who: 'senim', text: T('senimHello2') },
          { who: 'senim', text: T('senimHello3') }
        ];

    var i = 0, timer = null, typer = null;
    var scr = document.getElementById('scr-prologue');
    if (!scr) { onDone(); return; }

    scr.innerHTML =
      '<div class="prologue">' +
        '<div class="pro-col">' +
          '<div class="pro-clock" id="pro-clock">23:00 · ' + T('prologueShift') + '</div>' +
          '<div class="pro-ava" id="pro-ava"></div>' +
          '<div class="pro-lines" id="pro-lines"></div>' +
          '<button class="pro-skip" id="pro-skip">' + T('prologueSkip') + '</button>' +
        '</div>' +
      '</div>';

    var lines = document.getElementById('pro-lines');
    var ava = document.getElementById('pro-ava');

    function finish() {
      clearTimeout(timer); clearInterval(typer);
      onDone();
    }
    document.getElementById('pro-skip').onclick = function () { AQ.SFX.click(); finish(); };

    function step() {
      if (i >= beats.length) { timer = setTimeout(finish, 900); return; }
      var b = beats[i++];

      if (b.who === 'boot') {
        ava.innerHTML = avatar('analysing', 88);
        ava.className = 'pro-ava on';
        AQ.SFX.act();
      }
      if (b.who === 'senim' && ava.className.indexOf('on') === -1) {
        ava.innerHTML = avatar('idle', 88);
        ava.className = 'pro-ava on';
      }

      var row = document.createElement('div');
      row.className = 'pro-line ' + b.who;
      if (b.who === 'senim') row.innerHTML = '<span class="pro-who">' + T('senimName') + '</span><span class="t"></span>';
      else row.innerHTML = '<span class="t"></span>';
      lines.appendChild(row);

      var tgt = row.querySelector('.t');
      var j = 0;
      clearInterval(typer);
      typer = setInterval(function () {
        if (j >= b.text.length) {
          clearInterval(typer);
          if (b.who === 'senim') setStateNode(ava, 'confident');
          timer = setTimeout(step, b.who === 'boot' ? 700 : 1250);
          return;
        }
        tgt.textContent += b.text.charAt(j);
        if (j % 4 === 0) AQ.SFX.type();
        j++;
      }, 18);
    }

    function setStateNode(node, s) {
      var svg = node.querySelector('.senim-eye');
      if (svg) svg.setAttribute('class', 'senim-eye s-' + s);
    }

    AQ.UI.show('prologue');
    timer = setTimeout(step, 500);
  }

  /* ---- рассвет: расхождение доверия и точности ------------- */

  function dawnBlock(S) {
    var sn = ensure(S);
    var decided = S.profile.fake + S.profile.real + S.profile.unsure;
    var followedPct = decided ? Math.round(S.profile.senimFollow / decided * 100) : 0;

    var rightCount = 0;
    S.items.forEach(function (it) {
      var truthCall = it.truth.claim === 'true' ? 'real' : it.truth.claim === 'fake' ? 'fake' : 'unsure';
      if (it.senim.verdict === truthCall) rightCount++;
    });
    var accPct = Math.round(rightCount / S.items.length * 100);

    return '<div class="senim-two">' +
      '<div class="s2 you"><div class="l">' + T('senimYouFollowed') + '</div>' +
        '<div class="v">' + followedPct + '%</div></div>' +
      '<div class="s2 it"><div class="l">' + T('senimItWasRight') + '</div>' +
        '<div class="v">' + accPct + '%</div></div>' +
    '</div>' +
    (Math.abs(followedPct - accPct) > 20
      ? '<p class="tell">' + esc(T('senimGap', { gap: Math.abs(followedPct - accPct) })) + '</p>' : '');
  }

  return {
    ensure: ensure,
    hire: hire,
    hiredOn: hiredOn,
    cost: cost,
    accuracy: accuracy,
    avatar: avatar,
    card: card,
    setState: setState,
    typeLine: typeLine,
    say: say,
    onTool: onTool,
    onFinding: onFinding,
    prologue: prologue,
    dawnBlock: dawnBlock,
    reset: function () { lastSaid = 0; clearInterval(typeTimer); }
  };
})();
