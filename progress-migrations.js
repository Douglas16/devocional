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
})();
