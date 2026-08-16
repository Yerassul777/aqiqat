/* ============================================================
   AQIQAT — АНДРЕЙ И АЛИ
   ------------------------------------------------------------
   Двое, которых можно послать в район. Они дороже ничего не
   стоят и дают меньше, чем инструмент: не улику, а наводку.
   Именно поэтому они интересны — за двенадцать монет покупается
   не ответ, а направление, в котором стоит потратить
   пятнадцать.

   Механически всё просто: один вызов на человека на входящее,
   деньги списываются сразу, наводка приходит лентой и остаётся
   в карточке. Долго идти по дворам ночью они не могут — отсюда
   и ограничение.
   ============================================================ */

window.AQ = window.AQ || {};

AQ.NPC = (function () {

  function T(k, v) { return AQ.T(k, v); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function ensure(S) {
    if (!S.npc) S.npc = { sent: {}, hints: {} };
    return S.npc;
  }

  function key(npcId, itemId) { return npcId + '|' + itemId; }

  function sentOn(S, npcId, itemId) { return !!ensure(S).sent[key(npcId, itemId)]; }

  function hintsFor(S, itemId) {
    var n = ensure(S), out = [];
    AQ.NPCS.forEach(function (p) {
      var h = n.hints[key(p.id, itemId)];
      if (h) out.push({ id: p.id, name: AQ.L(p.name), text: h });
    });
    return out;
  }

  function cost() { return (AQ.NIGHT.kaya && AQ.NIGHT.kaya.npc) || 12; }

  function npc(id) {
    for (var i = 0; i < AQ.NPCS.length; i++) if (AQ.NPCS[i].id === id) return AQ.NPCS[i];
    return null;
  }

  /* Отправить человека. Возвращает наводку — или причину, по
     которой её не будет. */
  function send(S, npcId, it) {
    if (!it || S.resolved[it.id]) return { error: 'expired' };
    if (sentOn(S, npcId, it.id)) return { error: 'already' };
    var c = cost();
    if (!AQ.Game.canAfford(S, c)) return { error: 'no-kaya' };

    var hint = AQ.npcHint(npcId, it);
    /* Наводки нет — не берём денег. Молчание не товар. */
    if (!hint) return { error: 'nothing' };

    AQ.Game.spendKaya(S, c);
    var n = ensure(S);
    n.sent[key(npcId, it.id)] = true;
    n.hints[key(npcId, it.id)] = AQ.L(hint);
    return { ok: true, paid: c, text: AQ.L(hint), npc: npc(npcId) };
  }

  return {
    ensure: ensure,
    cost: cost,
    npc: npc,
    sentOn: sentOn,
    hintsFor: hintsFor,
    send: send,

    /* Карточка в панели работы: две кнопки и то, что уже
       принесли. */
    card: function (S, it) {
      var c = cost();
      var broke = !AQ.Game.canAfford(S, c);

      var btns = AQ.NPCS.map(function (p) {
        var used = sentOn(S, p.id, it.id);
        var has = !!AQ.npcHint(p.id, it);
        var off = used || broke || !has;
        return '<button class="npcb' + (used ? ' done' : '') + (broke && !used ? ' poor' : '') + '"' +
          ' data-npc="' + p.id + '"' + (off ? ' disabled' : '') + '>' +
          '<span class="nn">' + AQ.L(p.name) + '</span>' +
          '<span class="nc">' + (used ? '✓' : '◈ ' + c) + '</span>' +
          '<span class="nr">' + AQ.L(p.role) + '</span>' +
        '</button>';
      }).join('');

      var got = hintsFor(S, it.id).map(function (h) {
        return '<div class="npch">' +
          '<div class="nh-who">' + esc(h.name) + '</div>' +
          '<div class="nh-t">' + esc(h.text) + '</div>' +
        '</div>';
      }).join('');

      return '<div class="card npc">' +
        '<h2>' + T('npcTitle') + '</h2>' +
        '<div class="npc-sub">' + esc(T('npcHint')) + '</div>' +
        '<div class="npcs">' + btns + '</div>' +
        (got ? '<div class="npchs">' + got + '</div>' : '') +
      '</div>';
    },

    reset: function () { if (AQ.S) AQ.S.npc = { sent: {}, hints: {} }; }
  };
})();
