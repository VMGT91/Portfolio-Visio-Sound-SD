/**
 * VisioSound Stage Design - Interactive Scripts
 * Autor: Víctor Garay
 */

document.addEventListener('DOMContentLoaded', () => {
  initSlideNavigation();
  initCopyButtons();
  initVideoModal();
});

/* ==========================================================================
   NAVEGACIÓN DE DIAPOSITIVAS & SCROLL SNAP (7 PANTALLAS COMPLETAS)
   ========================================================================== */
function initSlideNavigation() {
  const container = document.getElementById('portfolioContainer');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.nav-dot'));
  const btnPrev = document.getElementById('btnPrevSlide');
  const btnNext = document.getElementById('btnNextSlide');

  let currentSlideIndex = 0;

  // Actualizar dot activo según la diapositiva visible
  const observerOptions = {
    root: container,
    threshold: 0.55
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = slides.indexOf(entry.target);
        if (index !== -1) {
          currentSlideIndex = index;
          updateActiveDot(index);
        }
      }
    });
  }, observerOptions);

  slides.forEach((slide) => observer.observe(slide));

  function updateActiveDot(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Clic en los puntos de navegación lateral
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // Flechas de navegación
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        goToSlide(currentSlideIndex - 1);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentSlideIndex < slides.length - 1) {
        goToSlide(currentSlideIndex + 1);
      }
    });
  }

  function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
      slides[index].scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Navegación con teclado (Flechas Arriba/Abajo, RePág/AvPág)
  window.addEventListener('keydown', (e) => {
    // Si el modal está abierto, no mover las diapositivas
    const modal = document.getElementById('videoModal');
    if (modal && modal.classList.contains('active')) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (currentSlideIndex < slides.length - 1) {
        e.preventDefault();
        goToSlide(currentSlideIndex + 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentSlideIndex > 0) {
        e.preventDefault();
        goToSlide(currentSlideIndex - 1);
      }
    }
  });
}

/* ==========================================================================
   COPIAR AL PORTAPAPELES (WhatsApp y Email)
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`¡Copiado!: ${textToCopy}`);
      } catch (err) {
        // Fallback clásico
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`¡Copiado!: ${textToCopy}`);
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

/* ==========================================================================
   REPRODUCTOR MODAL DE VIDEO (PRODUCCIONES EN VIVO & PREVISUALIZACIÓN)
   ========================================================================== */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = document.getElementById('modalBackdrop');
  const videoWrapper = document.getElementById('videoWrapper');
  const modalTitle = document.getElementById('modalVideoTitle');
  const videoCards = document.querySelectorAll('.video-screen-card');

  if (!modal || !videoWrapper) return;

  function openModal(videoUrl, title) {
    if (!videoUrl) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (modalTitle) {
      modalTitle.innerHTML = `${title} &bull; <span class="brand-white">VISIO</span><span class="brand-accent">SOUND</span>`;
    }

    // Inyectar el reproductor iframe con autoplay
    videoWrapper.innerHTML = `
      <iframe 
        src="${videoUrl}" 
        title="${title}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen 
        style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;">
      </iframe>
    `;
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Detener la reproducción de YouTube inmediatamente
    videoWrapper.innerHTML = '';
  }

  // Asignar eventos de clic y teclado a cada tarjeta de video
  videoCards.forEach((card) => {
    card.addEventListener('click', () => {
      const url = card.getAttribute('data-video-url');
      const title = card.getAttribute('data-video-title') || 'VISIOSOUND VIDEO';
      openModal(url, title);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = card.getAttribute('data-video-url');
        const title = card.getAttribute('data-video-title') || 'VISIOSOUND VIDEO';
        openModal(url, title);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
