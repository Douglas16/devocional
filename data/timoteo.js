(function () {
  window.TIMOTEO = [...(window.TIMOTEO_1 || []), ...(window.TIMOTEO_2 || [])].map((entry, index) => ({ ...entry, day: index + 1 }));
})();
