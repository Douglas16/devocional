// Backup e restauração do histórico (progresso, anotações, marcações, pedidos de
// oração e preferências) para levar de um aparelho a outro.
//
// Tudo o que o app guarda fica no localStorage com o prefixo "lectio-". O backup é
// um arquivo JSON comum — abre em qualquer sistema (Android, iPhone, Windows, Mac,
// Linux) e pode ir por WhatsApp, e-mail, Drive, pendrive etc. Para aparelhos em
// que mexer com arquivos é difícil, há também a opção de copiar e colar o código.
//
// Uso: <script src="backup.js"></script> e um botão com id="backupTrigger".
(function () {
  var PREFIX = 'lectio-';
  var FORMAT = 'lectio-backup';
  var VERSION = 1;
  // Cópia do estado anterior à última restauração (fora do prefixo, para não
  // entrar nos backups). Permite desfazer.
  var UNDO_KEY = '__lectio-before-restore';

  // ---------- dados ----------
  var collect = function () {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(PREFIX) === 0) data[k] = localStorage.getItem(k);
    }
    return data;
  };

  var makeBackup = function () {
    return { format: FORMAT, version: VERSION, createdAt: new Date().toISOString(), data: collect() };
  };

  // Aceita o arquivo deste app; rejeita qualquer outra coisa.
  var parseBackup = function (text) {
    var obj;
    try { obj = JSON.parse(String(text || '').trim().replace(/^﻿/, '')); }
    catch (e) { throw new Error('O conteúdo não é um backup válido (não foi possível ler o arquivo).'); }
    if (!obj || obj.format !== FORMAT || typeof obj.data !== 'object' || !obj.data) {
      throw new Error('Este arquivo não é um backup do Lectio.');
    }
    if (obj.version > VERSION) {
      throw new Error('Este backup foi feito por uma versão mais nova do app. Atualize a página e tente de novo.');
    }
    var data = {};
    Object.keys(obj.data).forEach(function (k) {
      if (k.indexOf(PREFIX) === 0 && typeof obj.data[k] === 'string') data[k] = obj.data[k];
    });
    if (!Object.keys(data).length) throw new Error('O backup está vazio.');
    return { createdAt: obj.createdAt, data: data };
  };

  // Resumo legível: jornadas com progresso, dias lidos, anotações, marcações, orações.
  var summarize = function (data) {
    var s = { journeys: 0, read: 0, notes: 0, highlights: 0, prayers: 0 };
    Object.keys(data).forEach(function (k) {
      var v;
      try { v = JSON.parse(data[k]); } catch (e) { return; }
      if (k === 'lectio-oracoes-v1') { s.prayers = Array.isArray(v) ? v.length : Object.keys(v || {}).length; return; }
      if (!v || typeof v !== 'object' || Array.isArray(v)) return;
      var read = Object.keys(v.read || {}).length;
      var notes = Object.keys(v.notes || {}).filter(function (d) { return v.notes[d]; }).length;
      var hl = Object.keys(v.highlights || {}).reduce(function (n, d) {
        return n + (Array.isArray(v.highlights[d]) ? v.highlights[d].length : 0);
      }, 0);
      if (read || notes || hl) s.journeys++;
      s.read += read; s.notes += notes; s.highlights += hl;
    });
    return s;
  };

  var summaryHtml = function (data) {
    var s = summarize(data);
    var rows = [
      ['Jornadas com histórico', s.journeys],
      ['Dias lidos', s.read],
      ['Anotações', s.notes],
      ['Marcações de texto', s.highlights],
      ['Pedidos de oração', s.prayers]
    ];
    return '<div class="reset-list backup-summary">' + rows.map(function (r) {
      return '<div class="reset-row"><span class="reset-row-label">' + r[0] + '</span><span class="reset-row-meta">' + r[1] + '</span></div>';
    }).join('') + '</div>';
  };

  var restore = function (data) {
    var current = collect();
    try { localStorage.setItem(UNDO_KEY, JSON.stringify({ savedAt: new Date().toISOString(), data: current })); } catch (e) {}
    Object.keys(current).forEach(function (k) { localStorage.removeItem(k); });
    try {
      Object.keys(data).forEach(function (k) { localStorage.setItem(k, data[k]); });
    } catch (e) {
      // Sem espaço: volta ao estado anterior para não deixar dados pela metade.
      Object.keys(data).forEach(function (k) { localStorage.removeItem(k); });
      Object.keys(current).forEach(function (k) { try { localStorage.setItem(k, current[k]); } catch (e2) {} });
      throw new Error('Não há espaço suficiente no navegador para restaurar este backup.');
    }
  };

  var undoInfo = function () {
    try {
      var u = JSON.parse(localStorage.getItem(UNDO_KEY) || 'null');
      return u && u.data ? u : null;
    } catch (e) { return null; }
  };

  // ---------- arquivo / compartilhar / copiar ----------
  var fileName = function () {
    var d = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    return 'lectio-backup-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.json';
  };

  var backupText = function () { return JSON.stringify(makeBackup()); };

  var download = function () {
    var blob = new Blob([backupText()], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName();
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
  };

  var shareFile = function () {
    var file = new File([backupText()], fileName(), { type: 'application/json' });
    return navigator.share({ files: [file], title: 'Backup Lectio', text: 'Backup do meu histórico no Lectio' });
  };

  var canShareFile = function () {
    try {
      if (!navigator.canShare || !window.File) return false;
      return navigator.canShare({ files: [new File(['{}'], 'teste.json', { type: 'application/json' })] });
    } catch (e) { return false; }
  };

  var copyText = function (text, textarea) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
    });
  };

  var readFile = function (file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = function () { reject(new Error('Não foi possível ler o arquivo.')); };
      r.readAsText(file);
    });
  };

  var formatDate = function (iso) {
    var d = new Date(iso);
    if (isNaN(d)) return 'data desconhecida';
    return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // ---------- interface ----------
  var overlay, body;

  var ensureModal = function () {
    if (overlay) return;
    var style = document.createElement('style');
    style.textContent =
      '.backup-actions{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}' +
      '.backup-actions .reset-btn{width:100%;text-align:center;padding:12px 18px}' +
      '.backup-section{font-family:var(--font-mono);font-size:.6875rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);margin:4px 0 10px}' +
      '.backup-code{width:100%;min-height:110px;font-family:var(--font-mono);font-size:.6875rem;line-height:1.4;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--bg-sunk);color:var(--ink);resize:vertical;margin-bottom:12px;word-break:break-all}' +
      '.backup-msg{font-size:.8125rem;margin:-6px 0 14px;color:var(--ink-2)}' +
      '.backup-msg.is-error{color:var(--accent)}' +
      '.backup-summary{max-height:none}' +
      '.backup-file{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}';
    document.head.appendChild(style);
    overlay = document.createElement('div');
    overlay.className = 'reset-modal-overlay';
    overlay.hidden = true;
    overlay.innerHTML = '<div class="reset-modal" role="dialog" aria-modal="true" aria-labelledby="backupTitle"><div id="backupBody"></div></div>';
    document.body.appendChild(overlay);
    body = overlay.querySelector('#backupBody');
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) close(); });
  };

  var close = function () { if (overlay) overlay.hidden = true; };
  var $ = function (sel) { return body.querySelector(sel); };
  var showMsg = function (text, isError) {
    var el = $('#backupMsg');
    if (!el) return;
    el.textContent = text;
    el.hidden = !text;
    el.classList.toggle('is-error', !!isError);
  };

  var renderHome = function () {
    var undo = undoInfo();
    body.innerHTML =
      '<h2 class="reset-modal-title" id="backupTitle">Backup e restauração</h2>' +
      '<p class="reset-modal-sub">Leve seu histórico — leituras, anotações, marcações, pedidos de oração e preferências — para outro celular, tablet ou computador.</p>' +
      '<div class="backup-actions">' +
        '<button type="button" class="reset-btn reset-btn-danger" id="backupExport">Fazer backup</button>' +
        '<button type="button" class="reset-btn" id="backupImport">Restaurar backup</button>' +
        (undo ? '<button type="button" class="reset-btn" id="backupUndo">Desfazer última restauração</button>' : '') +
      '</div>' +
      '<div class="reset-modal-actions"><button type="button" class="reset-btn" id="backupClose">Fechar</button></div>';
    $('#backupExport').addEventListener('click', renderExport);
    $('#backupImport').addEventListener('click', renderImport);
    $('#backupClose').addEventListener('click', close);
    if (undo) $('#backupUndo').addEventListener('click', function () { renderConfirm(undo.data, undo.savedAt, true); });
  };

  var renderExport = function () {
    var data = collect();
    var text = backupText();
    var share = canShareFile();
    body.innerHTML =
      '<h2 class="reset-modal-title" id="backupTitle">Fazer backup</h2>' +
      '<p class="reset-modal-sub">Este é o histórico que será salvo:</p>' +
      summaryHtml(data) +
      '<div class="backup-section">1. Salvar como arquivo</div>' +
      '<div class="backup-actions">' +
        (share ? '<button type="button" class="reset-btn reset-btn-danger" id="backupShare">Enviar arquivo (WhatsApp, e-mail, Drive…)</button>' : '') +
        '<button type="button" class="reset-btn' + (share ? '' : ' reset-btn-danger') + '" id="backupDownload">Baixar arquivo de backup</button>' +
      '</div>' +
      '<p class="backup-msg" id="backupMsg" hidden></p>' +
      '<div class="backup-section">2. Ou copiar o código</div>' +
      '<p class="reset-modal-sub">Copie e cole o código em uma mensagem para você mesmo. No outro aparelho, use “Restaurar backup” e cole.</p>' +
      '<textarea class="backup-code" id="backupCode" readonly spellcheck="false"></textarea>' +
      '<div class="backup-actions"><button type="button" class="reset-btn" id="backupCopy">Copiar código</button></div>' +
      '<div class="reset-modal-actions"><button type="button" class="reset-btn" id="backupBack">Voltar</button></div>';
    var code = $('#backupCode');
    code.value = text;
    $('#backupDownload').addEventListener('click', function () {
      try { download(); showMsg('Arquivo salvo. Procure “' + fileName() + '” na pasta de downloads.'); }
      catch (e) { showMsg('Não foi possível baixar. Use “Copiar código”.', true); }
    });
    if (share) $('#backupShare').addEventListener('click', function () {
      shareFile().then(function () { showMsg('Backup enviado.'); }, function (e) {
        if (e && e.name === 'AbortError') return;
        showMsg('Não foi possível compartilhar. Tente “Baixar arquivo de backup”.', true);
      });
    });
    $('#backupCopy').addEventListener('click', function () {
      copyText(text, code).then(function () { $('#backupCopy').textContent = 'Código copiado ✓'; },
        function () { code.focus(); code.select(); $('#backupCopy').textContent = 'Selecione o texto e copie manualmente'; });
    });
    $('#backupBack').addEventListener('click', renderHome);
  };

  var renderImport = function () {
    body.innerHTML =
      '<h2 class="reset-modal-title" id="backupTitle">Restaurar backup</h2>' +
      '<p class="reset-modal-sub">Escolha o arquivo de backup (.json) ou cole o código copiado no outro aparelho.</p>' +
      '<div class="backup-section">1. Abrir arquivo</div>' +
      '<div class="backup-actions">' +
        '<input type="file" class="backup-file" id="backupFile">' +
        '<button type="button" class="reset-btn reset-btn-danger" id="backupPick">Escolher arquivo de backup</button>' +
      '</div>' +
      '<div class="backup-section">2. Ou colar o código</div>' +
      '<textarea class="backup-code" id="backupPaste" spellcheck="false" placeholder="Cole aqui o código do backup"></textarea>' +
      '<p class="backup-msg" id="backupMsg" hidden></p>' +
      '<div class="reset-modal-actions">' +
        '<button type="button" class="reset-btn" id="backupBack">Voltar</button>' +
        '<button type="button" class="reset-btn reset-btn-danger" id="backupUsePaste">Continuar</button>' +
      '</div>';
    var input = $('#backupFile');
    var proceed = function (text) {
      try { var b = parseBackup(text); renderConfirm(b.data, b.createdAt, false); }
      catch (e) { showMsg(e.message, true); }
    };
    $('#backupPick').addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) return;
      readFile(f).then(proceed, function (e) { showMsg(e.message, true); });
    });
    $('#backupUsePaste').addEventListener('click', function () {
      var t = $('#backupPaste').value;
      if (!t.trim()) { showMsg('Cole o código do backup ou escolha um arquivo.', true); return; }
      proceed(t);
    });
    $('#backupBack').addEventListener('click', renderHome);
  };

  var renderConfirm = function (data, createdAt, isUndo) {
    body.innerHTML =
      '<h2 class="reset-modal-title" id="backupTitle">' + (isUndo ? 'Desfazer restauração' : 'Confirmar restauração') + '</h2>' +
      '<p class="reset-modal-sub">' + (isUndo
        ? 'Volta o histórico como estava antes da última restauração (' + formatDate(createdAt) + ').'
        : 'Backup feito em ' + formatDate(createdAt) + '. Ele contém:') + '</p>' +
      summaryHtml(data) +
      '<p class="reset-modal-sub"><strong>O histórico atual deste aparelho será substituído.</strong> Se mudar de ideia, use “Desfazer última restauração”.</p>' +
      '<p class="backup-msg" id="backupMsg" hidden></p>' +
      '<div class="reset-modal-actions">' +
        '<button type="button" class="reset-btn" id="backupBack">Voltar</button>' +
        '<button type="button" class="reset-btn reset-btn-danger" id="backupDo">' + (isUndo ? 'Sim, desfazer' : 'Sim, restaurar') + '</button>' +
      '</div>';
    $('#backupBack').addEventListener('click', isUndo ? renderHome : renderImport);
    $('#backupDo').addEventListener('click', function () {
      try {
        restore(data);
        if (isUndo) localStorage.removeItem(UNDO_KEY);
      } catch (e) { showMsg(e.message, true); return; }
      body.innerHTML =
        '<h2 class="reset-modal-title" id="backupTitle">Pronto!</h2>' +
        '<p class="reset-modal-sub">Histórico restaurado. A página será recarregada.</p>';
      // recarrega para que tema, fonte e migrações de progresso sejam reaplicados
      setTimeout(function () { window.location.reload(); }, 900);
    });
  };

  var open = function () {
    ensureModal();
    renderHome();
    overlay.hidden = false;
  };

  window.LectioBackup = { open: open, collect: collect, parse: parseBackup };

  var bind = function () {
    var trigger = document.getElementById('backupTrigger');
    if (trigger) trigger.addEventListener('click', open);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
