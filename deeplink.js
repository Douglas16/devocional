// Link direto para uma leitura: pagina.html?dia=N[&v=V] abre o dia N (e sublinha rapidamente o versículo V).
// Os motores das jornadas (app*.jsx) leem window.LectioDeepLink antes de montar o estado.
(function () {
  var q = new URLSearchParams(location.search);
  var day = parseInt(q.get('dia'), 10);
  var verse = parseInt(q.get('v'), 10);
  window.LectioDeepLink = { day: day > 0 ? day : null, verse: day > 0 && verse > 0 ? verse : null };
  if (!window.LectioDeepLink.day) return;
  try {
    q.delete('dia'); q.delete('v');
    var rest = q.toString();
    history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
  } catch (e) {}
  var target = window.LectioDeepLink.verse;
  if (!target) return;
  var tries = 0;
  var timer = setInterval(function () {
    var verses = document.querySelectorAll('.passage-verses .verse');
    for (var i = 0; i < verses.length; i++) {
      var num = verses[i].querySelector('.verse-num');
      if (num && num.textContent.trim() === String(target)) {
        clearInterval(timer);
        verses[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
        verses[i].classList.add('verse-flash');
        setTimeout(function () { verses[i].classList.remove('verse-flash'); }, 3200);
        return;
      }
    }
    if (++tries > 80) clearInterval(timer);
  }, 100);
})();
