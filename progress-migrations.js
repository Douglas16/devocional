// Migrações do progresso salvo quando a numeração dos dias de uma jornada muda.
// Cada jornada guarda um "layout" no próprio estado; a migração roda uma vez só.
// Precisa ser carregado em toda página que LÊ o progresso (a jornada e jornadas.html),
// senão o card "Bíblia toda" leria dias antigos contra a numeração nova.
(function () {
  // Desloca as chaves numéricas de um mapa {dia: valor} a partir de "from".
  var shiftKeys = function (obj, from, by) {
    var out = {};
    Object.keys(obj || {}).forEach(function (k) {
      var d = +k;
      out[d >= from ? d + by : d] = obj[k];
    });
    return out;
  };

  // Renumera as chaves de {dia: valor} por uma tabela explícita {antigo: novo}.
  // Dias sem correspondência são descartados.
  var remapKeys = function (obj, table) {
    var out = {};
    Object.keys(obj || {}).forEach(function (k) {
      var novo = table[k];
      if (novo) out[novo] = obj[k];
    });
    return out;
  };

  var migrate = function (key, layout, fn) {
    var state = {};
    try { state = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (e) { return; }
    if (state.layout === layout) return;
    fn(state);
    state.layout = layout;
    try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {}
  };

  // 1 Pedro 5 entrou como dia 9 — o livro terminava em 4.19 e o capítulo 5
  // não estava em nenhuma jornada. Os dias de 2 Pedro foram de 9–13 para 10–14.
  migrate('lectio-pedro-v1', 2, function (state) {
    state.read = shiftKeys(state.read, 9, 1);
    state.notes = shiftKeys(state.notes, 9, 1);
    state.highlights = shiftKeys(state.highlights, 9, 1);
    var cur = +state.currentDay;
    if (cur >= 9) state.currentDay = cur + 1;
  });

  // 1 Crônicas 10-21 entrou como dias 3-14, na posição cronológica em que o
  // Cronista os coloca (entre 1Cr 9 e 1Cr 22). O resto foi de 3-52 para 15-64.
  migrate('lectio-1-reis-v1', 2, function (state) {
    state.read = shiftKeys(state.read, 3, 12);
    state.notes = shiftKeys(state.notes, 3, 12);
    state.highlights = shiftKeys(state.highlights, 3, 12);
    var cur = +state.currentDay;
    if (cur >= 3) state.currentDay = cur + 12;
  });

  // Sinóticos passou de 35 para 70 dias: os 35 capítulos que faltavam entraram
  // e a jornada foi reordenada em ordem canônica (Mateus, Marcos, Lucas).
  // Cada dia antigo foi para uma posição nova, sem padrão aritmético.
  var SINOTICOS = {
    1: 2, 2: 46, 3: 3, 4: 28, 5: 7, 6: 29, 7: 11, 8: 4, 9: 31, 10: 32,
    11: 33, 12: 34, 13: 15, 14: 37, 15: 38, 16: 20, 17: 40, 18: 66, 19: 67, 20: 69,
    21: 1, 22: 5, 23: 12, 24: 27, 25: 24, 26: 35, 27: 36, 28: 45, 29: 48, 30: 53,
    31: 54, 32: 59, 33: 60, 34: 63, 35: 70
  };
  migrate('lectio-sinoticos-v1', 2, function (state) {
    state.read = remapKeys(state.read, SINOTICOS);
    state.notes = remapKeys(state.notes, SINOTICOS);
    state.highlights = remapKeys(state.highlights, SINOTICOS);
    var cur = SINOTICOS[state.currentDay];
    if (cur) state.currentDay = cur;
  });
})();
