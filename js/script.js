/* =========================================================================
   GALDINO SISTEMAS — script.js
   JavaScript puro (vanilla), sem dependências externas.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initRevealOnScroll();
  initCounters();
  initFaq();
  initBackToTop();
  initFilters();
  initPlanFilters();
  initForms();
  setActiveNavLink();
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
});

/* Header muda de estilo ao rolar a página */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = () => header.classList.toggle('scrolled', window.scrollY > 12);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* Menu mobile */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!toggle || !nav) return;

  const iconMenu = '<svg class="icon"><use href="#icon-menu"></use></svg>';
  const iconClose = '<svg class="icon"><use href="#icon-close"></use></svg>';

  const setOpen = (isOpen) => {
    nav.classList.toggle('nav-open', isOpen);
    backdrop && backdrop.classList.toggle('show', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    toggle.innerHTML = isOpen ? iconClose : iconMenu;
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('nav-open'));
  });

  backdrop && backdrop.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) setOpen(false);
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  /* Fecha o menu automaticamente se a tela for redimensionada para desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && nav.classList.contains('nav-open')) setOpen(false);
  });
}

/* Revela elementos suavemente ao entrarem na viewport */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* Contadores numéricos animados (estatísticas e KPIs do hero) */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = prefix + value.toFixed(decimals).replace('.', ',') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}

/* Acordeão de FAQ */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* Botão voltar ao topo */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 560);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Filtro de segmentos (página segmentos.html) */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-segment]');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'todos' || card.dataset.segment === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}

/* Filtro de categorias de planos (página planos.html) */
function initPlanFilters() {
  const filterBtns = document.querySelectorAll('.plan-filter-row .filter-btn');
  const cards = document.querySelectorAll('[data-plan-category]');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'todos' || card.dataset.planCategory === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}

/* Número de WhatsApp da Galdino Sistemas usado no direcionamento dos formulários */
const WHATSAPP_NUMBER = '5541997075291';

/* Rótulos amigáveis para os campos dos formulários (contato / demonstração) */
const FORM_FIELD_LABELS = {
  nome: 'Nome',
  empresa: 'Empresa',
  email: 'E-mail',
  telefone: 'Telefone',
  whatsapp: 'WhatsApp',
  cidade: 'Cidade',
  usuarios: 'Nº de usuários',
  segmento: 'Segmento',
  mensagem: 'Mensagem'
};

/* Monta a mensagem do WhatsApp a partir dos dados preenchidos no formulário */
function buildWhatsAppMessage(form) {
  const lines = ['Olá! Vim pelo site da Galdino Sistemas e gostaria de mais informações.', ''];

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    if (!field.name) return;
    const value = field.value.trim();
    if (!value) return;

    let displayValue = value;
    if (field.tagName === 'SELECT') {
      const opt = field.options[field.selectedIndex];
      displayValue = opt ? opt.text : value;
    }

    const label = FORM_FIELD_LABELS[field.name] || field.name;
    lines.push(`*${label}:* ${displayValue}`);
  });

  return lines.join('\n');
}

/* Validação, envio e direcionamento dos formulários (demonstração / contato) para o WhatsApp */
function initForms() {
  const forms = document.querySelectorAll('form[data-form]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const wrapper = field.closest('.field');
        if (!field.value.trim()) {
          valid = false;
          wrapper && wrapper.classList.add('field-error');
        } else {
          wrapper && wrapper.classList.remove('field-error');
        }
      });

      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        valid = false;
        emailField.closest('.field') && emailField.closest('.field').classList.add('field-error');
      }

      if (!valid) return;

      /* Monta o link do WhatsApp com os dados do formulário e abre em nova aba */
      const message = buildWhatsAppMessage(form);
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      const successBox = document.querySelector(form.dataset.success || '.form-success');
      if (successBox) {
        form.style.display = 'none';
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

        /* Botão de reforço na caixa de sucesso, caso o navegador bloqueie a nova aba */
        const waLink = successBox.querySelector('.form-success-whatsapp');
        if (waLink) waLink.href = waUrl;
      }

      window.open(waUrl, '_blank', 'noopener');
    });

    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        const wrapper = field.closest('.field');
        wrapper && wrapper.classList.remove('field-error');
      });
    });
  });
}

/* Marca o link ativo no menu conforme a página atual */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });
}
