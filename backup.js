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
    var raw = String(text || '').replace(/^﻿/, '');
    // tolera texto em volta (mensagem de WhatsApp/e-mail) e quebras de linha
    // inseridas por apps de e-mail — JSON válido nunca tem quebra crua dentro de strings
    var start = raw.indexOf('{'), end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) raw = raw.slice(start, end + 1);
    try { obj = JSON.parse(raw); }
    catch (e) {
      try { obj = JSON.parse(raw.replace(/[\r\n]+/g, '')); }
      catch (e2) { throw new Error('O conteúdo não é um backup válido. Confira se o código foi copiado inteiro.'); }
    }
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
    // .txt (e não .json): o Chrome do Android só compartilha alguns tipos de
    // arquivo, e .json não está entre eles — o WhatsApp/e-mail nunca abria.
    // Texto puro abre e compartilha em qualquer sistema; o conteúdo continua JSON.
    return 'lectio-backup-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.txt';
  };
  var MIME = 'text/plain';

  var backupText = function () { return JSON.stringify(makeBackup()); };

  var download = function (text) {
    var blob = new Blob([text], { type: MIME });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName();
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
  };

  var backupFile = function (text) {
    try { return new File([text], fileName(), { type: MIME }); } catch (e) { return null; }
  };

  var canShareFile = function (file) {
    try { return !!(file && navigator.canShare && navigator.canShare({ files: [file] })); }
    catch (e) { return false; }
  };

  // Abre a folha de compartilhar do sistema. Tem de ser chamada direto no toque
  // do botão (sem await antes), senão o navegador bloqueia.
  var share = function (text) {
    var file = backupFile(text);
    if (canShareFile(file)) return navigator.share({ files: [file], title: 'Backup Lectio' });
    return navigator.share({ title: 'Backup Lectio', text: text });
  };

  // Links diretos. URLs muito longas são cortadas por WhatsApp e apps de e-mail,
  // então só o código curto vai no link; o longo vai pela área de transferência
  // (WhatsApp) ou como anexo baixado (e-mail).
  var LINK_LIMIT = 1800;
  var whatsappUrl = function (msg) { return 'https://wa.me/?text=' + encodeURIComponent(msg); };
  var mailUrl = function (body) {
    return 'mailto:?subject=' + encodeURIComponent('Backup Lectio') + '&body=' + encodeURIComponent(body);
  };
  var openExternal = function (url) {
    var a = document.createElement('a');
    a.href = url;
    a.target = url.indexOf('mailto:') === 0 ? '_self' : '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
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
    var short = text.length <= LINK_LIMIT;
    var hasShare = typeof navigator.share === 'function';
    body.innerHTML =
      '<h2 class="reset-modal-title" id="backupTitle">Fazer backup</h2>' +
      '<p class="reset-modal-sub">Este é o histórico que será salvo:</p>' +
      summaryHtml(data) +
      '<p class="backup-msg" id="backupMsg" hidden></p>' +
      '<div class="backup-section">Enviar para outro aparelho</div>' +
      '<div class="backup-actions">' +
        (hasShare ? '<button type="button" class="reset-btn reset-btn-danger" id="backupShare">Compartilhar (WhatsApp, e-mail, Drive…)</button>' : '') +
        '<button type="button" class="reset-btn' + (hasShare ? '' : ' reset-btn-danger') + '" id="backupWhats">Enviar pelo WhatsApp</button>' +
        '<button type="button" class="reset-btn" id="backupMail">Enviar por e-mail</button>' +
        '<button type="button" class="reset-btn" id="backupDownload">Baixar arquivo de backup</button>' +
      '</div>' +
      '<div class="backup-section">Ou copiar o código</div>' +
      '<p class="reset-modal-sub">Funciona em qualquer aparelho: copie, cole numa mensagem para você mesmo e, no outro aparelho, use “Restaurar backup” e cole.</p>' +
      '<textarea class="backup-code" id="backupCode" readonly spellcheck="false"></textarea>' +
      '<div class="backup-actions"><button type="button" class="reset-btn" id="backupCopy">Copiar código</button></div>' +
      '<p class="reset-modal-sub">Se nada acontecer ao tocar nos botões, abra o site direto no Chrome ou no Safari (não pelo navegador interno do WhatsApp/Instagram) ou use “Copiar código”.</p>' +
      '<div class="reset-modal-actions"><button type="button" class="reset-btn" id="backupBack">Voltar</button></div>';
    var code = $('#backupCode');
    code.value = text;

    // Qualquer erro vira mensagem na tela — nunca mais "não aconteceu nada".
    var on = function (sel, fn) {
      var el = $(sel);
      if (el) el.addEventListener('click', function () {
        try { fn(el); } catch (e) { showMsg('Não deu certo neste navegador. Use “Copiar código”.', true); }
      });
    };
    var copy = function () { return copyText(text, code); };

    on('#backupShare', function () {
      share(text).then(function () { showMsg('Backup enviado. No outro aparelho, abra o arquivo ou cole o código em “Restaurar backup”.'); },
        function (e) {
          if (e && e.name === 'AbortError') return;
          showMsg('O compartilhamento foi bloqueado. Use “Enviar pelo WhatsApp”, “Enviar por e-mail” ou “Copiar código”.', true);
        });
    });

    // Código curto vai inteiro no link. Longo: 1º toque copia, 2º abre o WhatsApp para colar.
    var whatsReady = false;
    on('#backupWhats', function (btn) {
      if (short) { openExternal(whatsappUrl(text)); return; }
      if (whatsReady) { openExternal(whatsappUrl('Backup Lectio — cole o código abaixo:')); return; }
      copy().then(function () {
        whatsReady = true;
        btn.textContent = 'Código copiado ✓ — toque para abrir o WhatsApp';
        showMsg('Código copiado. Abra o WhatsApp, escolha a conversa (pode ser com você mesmo) e cole.');
      }, function () {
        code.focus(); code.select();
        showMsg('Não foi possível copiar sozinho. Selecione o código abaixo, copie e cole no WhatsApp.', true);
      });
    });

    // E-mail: links mailto não aguentam textos longos, então o backup é baixado
    // como arquivo para anexar, e o código também fica copiado.
    on('#backupMail', function () {
      if (short) { openExternal(mailUrl(text)); return; }
      download(text);
      copy().catch(function () {});
      openExternal(mailUrl('Backup do Lectio.\n\nAnexe o arquivo “' + fileName() + '” que acabou de ser baixado (pasta Downloads) ' +
        'ou cole aqui o código do backup — ele já está copiado.'));
      showMsg('Arquivo “' + fileName() + '” baixado e código copiado. No e-mail, anexe o arquivo ou cole o código.');
    });

    on('#backupDownload', function () {
      download(text);
      showMsg('Arquivo salvo. Procure “' + fileName() + '” na pasta Downloads (ou em Arquivos, no iPhone).');
    });

    on('#backupCopy', function (btn) {
      copy().then(function () { btn.textContent = 'Código copiado ✓'; },
        function () { code.focus(); code.select(); btn.textContent = 'Selecione o texto e copie manualmente'; });
    });
    $('#backupBack').addEventListener('click', renderHome);
  };

  var renderImport = function () {
    body.innerHTML =
      '<h2 class="reset-modal-title" id="backupTitle">Restaurar backup</h2>' +
      '<p class="reset-modal-sub">Escolha o arquivo de backup (.txt ou .json) ou cole o código recebido por WhatsApp, e-mail ou mensagem.</p>' +
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
