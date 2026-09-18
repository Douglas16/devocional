// Divisão dos Salmos longos em várias leituras (por assunto) e migração do progresso salvo.
// Salmos não listados em "parts" continuam sendo uma leitura por salmo.
(function () {
  var KEY = 'lectio-salmos-v1';
  var LAYOUT = 2;
  var parts = {"18":[[1,19],[20,36],[37,50]],"22":[[1,21],[22,31]],"35":[[1,16],[17,28]],"37":[[1,11],[12,26],[27,40]],"44":[[1,16],[17,26]],"68":[[1,10],[11,23],[24,35]],"69":[[1,18],[19,36]],"73":[[1,14],[15,28]],"78":[[1,16],[17,39],[40,55],[56,72]],"89":[[1,18],[19,37],[38,52]],"102":[[1,11],[12,28]],"104":[[1,18],[19,35]],"105":[[1,15],[16,36],[37,45]],"106":[[1,12],[13,33],[34,48]],"107":[[1,16],[17,32],[33,43]],"109":[[1,20],[21,31]],"118":[[1,18],[19,29]],"119":[[1,24],[25,48],[49,72],[73,96],[97,120],[121,144],[145,160],[161,176]],"136":[[1,16],[17,26]]};

  var start = {};
  var total = 0;
  for (var p = 1; p <= 150; p++) {
    start[p] = total + 1;
    total += (parts[p] || [[1, 0]]).length;
  }
  var count = function (p) { return (parts[p] || [[1, 0]]).length; };

  // Salmo (1–150) a que pertence cada dia da jornada.
  var psalmOfDay = function (day) {
    for (var p = 150; p >= 1; p--) if (day >= start[p]) return p;
    return 1;
  };

  // Quantos salmos foram lidos por inteiro, dado o objeto "read" salvo.
  var psalmsRead = function (read) {
    var n = 0;
    for (var p = 1; p <= 150; p++) {
      var ok = true;
      for (var i = 0; i < count(p); i++) if (!(read && read[start[p] + i])) { ok = false; break; }
      if (ok) n++;
    }
    return n;
  };

  // Antes da divisão, o dia N era o Salmo N. Converte leitura, notas e destaques
  // salvos para a numeração nova, uma única vez.
  var migrate = function () {
    var state = {};
    try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return; }
    if (state.layout === LAYOUT) return;
    var oldRead = state.read || {}, oldNotes = state.notes || {}, oldHl = state.highlights || {};
    var read = {}, notes = {}, highlights = {};
    Object.keys(oldRead).forEach(function (k) {
      var p = +k;
      if (!(p >= 1 && p <= 150)) return;
      for (var i = 0; i < count(p); i++) read[start[p] + i] = oldRead[k];
    });
    Object.keys(oldNotes).forEach(function (k) {
      var p = +k;
      if (p >= 1 && p <= 150 && oldNotes[k]) notes[start[p]] = oldNotes[k];
    });
    Object.keys(oldHl).forEach(function (k) {
      var p = +k;
      if (!(p >= 1 && p <= 150)) return;
      var ranges = parts[p] || [[1, 9999]];
      (oldHl[k] || []).forEach(function (v) {
        for (var i = 0; i < ranges.length; i++) {
          if (v >= ranges[i][0] && v <= ranges[i][1]) {
            var day = start[p] + i;
            (highlights[day] = highlights[day] || []).push(v);
            break;
          }
        }
      });
    });
    var cur = +state.currentDay;
    state.read = read;
    state.notes = notes;
    state.highlights = highlights;
    if (cur >= 1 && cur <= 150) state.currentDay = start[cur];
    state.layout = LAYOUT;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  };

  window.SALMOS_LAYOUT = { parts: parts, total: total, start: start, psalmOfDay: psalmOfDay, psalmsRead: psalmsRead, migrate: migrate };
  migrate();
})();
