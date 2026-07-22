document.addEventListener('DOMContentLoaded', function () {

  // --- Botón "volver arriba" ---
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Selector "saltar a tema" ---
  var temaSelect = document.getElementById('temaSelect');
  if (temaSelect) {
    temaSelect.addEventListener('change', function () {
      if (this.value) {
        window.location.hash = this.value.replace('#', '');
        this.value = '';
      }
    });
  }

  // --- Botones de copiar código ---
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.code-block');
      var codeEl = block ? block.querySelector('pre code') : null;
      if (!codeEl) return;
      navigator.clipboard.writeText(codeEl.innerText).then(function () {
        var original = btn.textContent;
        btn.textContent = '✅ Copiado';
        setTimeout(function () { btn.textContent = original; }, 1500);
      });
    });
  });

});
