// Complemento de navegação para as jornadas que usam interfaces anteriores.
(function () {
  const panel = document.querySelector('.study-menu-panel');
  if (!panel) return;
  const trigger = document.querySelector('.study-menu-trigger');
  if (trigger) {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'jornadas.html';
    });
  }
  const additions = [
    ['hebreus.html', 'Hebreus', '13 dias · NVI'],
    ['filipenses-colossenses.html', 'Filipenses + Colossenses', '8 dias · NVI'],
    ['tito-filemom-judas.html', 'Tito + Filemom + Judas', '6 dias · NVI'],
    ['apocalipse.html', 'Apocalipse', '14 dias · NVI']
  ];
  const current = window.location.pathname.split('/').pop() || 'index.html';
  additions.forEach(([href, label, meta]) => {
    if (panel.querySelector(`a[href="${href}"]`)) return;
    const link = document.createElement('a');
    link.href = href;
    link.className = `study-menu-item${href === current ? ' active' : ''}`;
    link.innerHTML = `<div class="study-menu-label">${label}</div><div class="study-menu-meta">${meta}${href === current ? ' · atual' : ''}</div>`;
    panel.appendChild(link);
  });
})();
