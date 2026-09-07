/*
 * Configuração única de compartilhamento (WhatsApp).
 * Toda página usa window.LectioShare — não duplicar o formato das
 * mensagens nem a URL do WhatsApp em nenhum outro lugar.
 */
(function () {
  function whatsappUrl(text) {
    return 'https://wa.me/?text=' + encodeURIComponent(text);
  }

  function open(text) {
    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');
  }

  function formatVerse(day) {
    return `"${day.verse.text}"\n${day.verse.ref}\n\n📖 Lectio — devocional diário`;
  }

  function formatApplication(day) {
    return `Aplicação prática de hoje — ${day.verse.ref}\n\n${day.application}\n\n📖 Lectio`;
  }

  function formatPrayer(day) {
    return `Oração de hoje — ${day.verse.ref}\n\n${day.prayer}\n\n🙏 Lectio`;
  }

  window.LectioShare = {
    whatsappUrl: whatsappUrl,
    open: open,
    formatVerse: formatVerse,
    formatApplication: formatApplication,
    formatPrayer: formatPrayer
  };
})();
