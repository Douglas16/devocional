// Modal de confirmação reutilizável — substitui window.confirm() nativo por um
// modal no estilo do app (mesmas classes do "Zerar leitura" em jornadas.html).
// Uso: const ok = await window.lectioConfirm({ title, message, confirmLabel, cancelLabel, danger });
(function () {
  let overlay, titleEl, messageEl, cancelBtn, confirmBtn, resolveFn;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'reset-modal-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="reset-modal" role="alertdialog" aria-modal="true" aria-labelledby="lectioConfirmTitle">
        <h2 class="reset-modal-title" id="lectioConfirmTitle"></h2>
        <p class="reset-modal-sub" id="lectioConfirmMessage"></p>
        <div class="reset-modal-actions">
          <button type="button" class="reset-btn" id="lectioConfirmCancel"></button>
          <button type="button" class="reset-btn reset-btn-danger" id="lectioConfirmOk"></button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    titleEl = overlay.querySelector('#lectioConfirmTitle');
    messageEl = overlay.querySelector('#lectioConfirmMessage');
    cancelBtn = overlay.querySelector('#lectioConfirmCancel');
    confirmBtn = overlay.querySelector('#lectioConfirmOk');

    const finish = (result) => {
      overlay.hidden = true;
      document.removeEventListener('keydown', onKeydown);
      if (resolveFn) { const r = resolveFn; resolveFn = null; r(result); }
    };
    const onKeydown = (e) => {
      if (e.key === 'Escape') finish(false);
      if (e.key === 'Enter') finish(true);
    };
    overlay._finish = finish;
    overlay._onKeydown = onKeydown;

    cancelBtn.addEventListener('click', () => finish(false));
    confirmBtn.addEventListener('click', () => finish(true));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) finish(false); });
  }

  window.lectioConfirm = (opts) => {
    opts = opts || {};
    if (!overlay) build();
    titleEl.textContent = opts.title || 'Confirmar';
    messageEl.textContent = opts.message || 'Tem certeza?';
    cancelBtn.textContent = opts.cancelLabel || 'Cancelar';
    confirmBtn.textContent = opts.confirmLabel || 'Confirmar';
    confirmBtn.classList.toggle('reset-btn-danger', opts.danger !== false);
    overlay.hidden = false;
    document.addEventListener('keydown', overlay._onKeydown);
    confirmBtn.focus();
    return new Promise((resolve) => { resolveFn = resolve; });
  };
})();
