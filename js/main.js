/* ============================================
   DHANAM FINANCE - MAIN JAVASCRIPT
   Shared functionality and interactions
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     NAVBAR SCROLL EFFECT
     ============================================ */
  function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    });
  }

  /* ============================================
     MOBILE NAVIGATION TOGGLE
     ============================================ */
  function initMobileNav() {
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileNav = document.querySelector('.nav__mobile');
    const body = document.body;

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');

      if (mobileNav.classList.contains('active')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        body.style.overflow = '';
      });
    });
  }

  /* ============================================
     FAQ ACCORDION
     ============================================ */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      const question = item.querySelector('.faq-question');

      if (question) {
        question.addEventListener('click', function () {
          const isActive = item.classList.contains('active');

          // Close all other items
          faqItems.forEach(function (otherItem) {
            otherItem.classList.remove('active');
          });

          // Toggle current item
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  /* ============================================
     EMI CALCULATOR (Homepage - range sliders)
     ============================================ */
  function initEMICalculator() {
    // Homepage EMI calculator with range sliders
    var loanAmountInput = document.getElementById('loan-amount');
    var interestRateInput = document.getElementById('interest-rate');
    var loanTenureInput = document.getElementById('loan-tenure');

    if (loanAmountInput && interestRateInput && loanTenureInput) {
      var loanAmountVal = document.getElementById('loan-amount-val');
      var interestRateVal = document.getElementById('interest-rate-val');
      var loanTenureVal = document.getElementById('loan-tenure-val');
      var emiResult = document.getElementById('emi-result');
      var emiPrincipal = document.getElementById('emi-principal');
      var emiInterest = document.getElementById('emi-interest');
      var emiTotal = document.getElementById('emi-total');

      function calcHomeEMI() {
        var principal = parseFloat(loanAmountInput.value) || 0;
        var rate = parseFloat(interestRateInput.value) || 0;
        var years = parseFloat(loanTenureInput.value) || 0;
        var months = years * 12;

        if (loanAmountVal) loanAmountVal.textContent = formatCurrency(principal);
        if (interestRateVal) interestRateVal.textContent = rate + '%';
        if (loanTenureVal) loanTenureVal.textContent = years + (years === 1 ? ' Year' : ' Years');

        if (principal === 0 || rate === 0 || months === 0) {
          if (emiResult) emiResult.textContent = formatCurrency(0) + '/mo';
          if (emiPrincipal) emiPrincipal.textContent = formatCurrency(0);
          if (emiInterest) emiInterest.textContent = formatCurrency(0);
          if (emiTotal) emiTotal.textContent = formatCurrency(0);
          return;
        }

        var monthlyRate = rate / 12 / 100;
        var emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        var totalPayment = emi * months;
        var totalInterest = totalPayment - principal;

        if (emiResult) emiResult.textContent = formatCurrency(emi) + '/mo';
        if (emiPrincipal) emiPrincipal.textContent = formatCurrency(principal);
        if (emiInterest) emiInterest.textContent = formatCurrency(totalInterest);
        if (emiTotal) emiTotal.textContent = formatCurrency(totalPayment);
      }

      loanAmountInput.addEventListener('input', calcHomeEMI);
      interestRateInput.addEventListener('input', calcHomeEMI);
      loanTenureInput.addEventListener('input', calcHomeEMI);
      calcHomeEMI();
    }

    // Mortgage page EMI calculator with number inputs
    var mortgageLoanAmt = document.getElementById('emi-loan-amount');
    var mortgageRate = document.getElementById('emi-rate');
    var mortgageTenure = document.getElementById('emi-tenure');
    var mortgageResult = document.getElementById('emi-result');

    if (mortgageLoanAmt && mortgageRate && mortgageTenure) {
      function calcMortgageEMI() {
        var principal = parseFloat(mortgageLoanAmt.value) || 0;
        var rate = parseFloat(mortgageRate.value) || 0;
        var months = parseFloat(mortgageTenure.value) || 0;

        if (principal === 0 || rate === 0 || months === 0) {
          if (mortgageResult) mortgageResult.textContent = '--';
          return;
        }

        var monthlyRate = rate / 12 / 100;
        var emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        if (mortgageResult) mortgageResult.textContent = formatCurrency(emi);
      }

      mortgageLoanAmt.addEventListener('input', calcMortgageEMI);
      mortgageRate.addEventListener('input', calcMortgageEMI);
      mortgageTenure.addEventListener('input', calcMortgageEMI);
      calcMortgageEMI();
    }
  }

  /* ============================================
     GOLD LOAN CALCULATOR (Homepage)
     ============================================ */
  function initGoldLoanCalculator() {
    var goldWeightInput = document.getElementById('gold-weight');
    var goldPurityInput = document.getElementById('gold-purity');

    if (!goldWeightInput || !goldPurityInput) return;

    var goldWeightVal = document.getElementById('gold-weight-val');
    var goldResultEl = document.getElementById('gold-result');
    var goldValueEl = document.getElementById('gold-value');
    var goldLtvEl = document.getElementById('gold-ltv');

    // Gold rates per gram (approximate market rates)
    var goldRates = {
      '24': 7800,
      '22': 7150,
      '18': 5850
    };

    function calculateGoldLoan() {
      var weight = parseFloat(goldWeightInput.value) || 0;
      var purity = goldPurityInput.value || '22';

      if (goldWeightVal) goldWeightVal.textContent = weight + 'g';

      if (weight === 0) {
        if (goldResultEl) goldResultEl.textContent = formatCurrency(0);
        if (goldValueEl) goldValueEl.textContent = formatCurrency(0);
        return;
      }

      var ratePerGram = goldRates[purity] || 7150;
      var goldValue = weight * ratePerGram;

      // LTV based on loan amount (simplified: use 75% default)
      var ltv = 0.75;
      if (goldValue <= 250000) ltv = 0.75;
      else if (goldValue <= 500000) ltv = 0.80;
      else ltv = 0.75;

      var maxLoan = goldValue * ltv;

      if (goldResultEl) goldResultEl.textContent = formatCurrency(maxLoan);
      if (goldValueEl) goldValueEl.textContent = formatCurrency(goldValue);
      if (goldLtvEl) goldLtvEl.textContent = Math.round(ltv * 100) + '%';
    }

    goldWeightInput.addEventListener('input', calculateGoldLoan);
    goldPurityInput.addEventListener('change', calculateGoldLoan);

    // Initial calculation
    calculateGoldLoan();
  }

  /* ============================================
     CONTACT FORM HANDLER
     ============================================ */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const thankYouMsg = document.createElement('div');
          thankYouMsg.innerHTML = '<div style="padding:2rem;background:linear-gradient(135deg,#B8860B 0%,#D4A528 100%);color:white;border-radius:12px;text-align:center;"><h3 style="margin:0 0 1rem 0;font-family:DM Serif Display,Georgia,serif;">Thank You!</h3><p style="margin:0;font-size:0.95rem;">We have received your message and will get back to you soon.</p></div>';
          form.style.display = 'none';
          form.parentNode.insertBefore(thankYouMsg, form);
          form.reset();
        } else {
          alert('Something went wrong. Please try again or call us at 1800 2025 180.');
          btn.textContent = btnText;
          btn.disabled = false;
        }
      })
      .catch(() => {
        alert('Something went wrong. Please try again or call us at 1800 2025 180.');
        btn.textContent = btnText;
        btn.disabled = false;
      });
    });
  }

  /* ============================================
     APPLY FORM HANDLER
     ============================================ */
  function initApplyForm() {
    const form = document.getElementById('apply-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn.innerHTML;
      btn.textContent = 'Submitting...';
      btn.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const successMsg = document.createElement('div');
          successMsg.innerHTML = '<div style="padding:2rem;background:linear-gradient(135deg,#B8860B 0%,#D4A528 100%);color:white;border-radius:12px;text-align:center;"><h3 style="margin:0 0 1rem 0;font-family:DM Serif Display,Georgia,serif;">Application Submitted!</h3><p style="margin:0;font-size:0.95rem;">Your application has been received. Our team will contact you shortly.</p></div>';
          form.style.display = 'none';
          form.parentNode.insertBefore(successMsg, form);
          form.reset();
        } else {
          alert('Something went wrong. Please try again or call us at 1800 2025 180.');
          btn.innerHTML = btnText;
          btn.disabled = false;
        }
      })
      .catch(() => {
        alert('Something went wrong. Please try again or call us at 1800 2025 180.');
        btn.innerHTML = btnText;
        btn.disabled = false;
      });
    });
  }

  /* ============================================
     SCROLL ANIMATIONS (Intersection Observer)
     Reliable: content always visible, animations are additive only
     ============================================ */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');

    if (!elements.length) return;

    // Content is always visible by default (opacity: 1 in CSS).
    // We only add subtle entrance animations via the 'visible' class
    // WITHOUT first hiding content. This prevents blank pages.

    if (!('IntersectionObserver' in window)) {
      // No IntersectionObserver support - just add visible class to all
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observerOptions = {
      threshold: 0.01,
      rootMargin: '0px 0px 50px 0px'
    };

    var visibleCount = 0;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleCount++;
          var delay = Math.min(visibleCount * 60, 300);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* ============================================
     COUNTER ANIMATION
     ============================================ */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    if (!counters.length) return;

    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          animateCounter(entry.target);
          entry.target.dataset.animated = 'true';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const start = Date.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update() {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(target * eased);

      element.textContent = prefix + current.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    update();
  }

  /* ============================================
     ACTIVE NAV LINK DETECTION
     ============================================ */
  function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || href === '/' && currentPage === '') {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }

  /* ============================================
     BRANCH SEARCH FILTER
     ============================================ */
  function initBranchSearch() {
    const searchInput = document.getElementById('branch-search');
    if (!searchInput) return;

    const branchCards = document.querySelectorAll('.branch-card');

    searchInput.addEventListener('input', function () {
      const query = searchInput.value.toLowerCase();

      branchCards.forEach(function (card) {
        const text = card.textContent.toLowerCase();

        if (text.includes(query)) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });

      // Show no results message if needed
      const visibleCards = Array.from(branchCards).filter(function (card) {
        return card.style.display !== 'none';
      });

      let noResultsMsg = document.querySelector('.branch-no-results');
      if (visibleCards.length === 0) {
        if (!noResultsMsg) {
          noResultsMsg = document.createElement('div');
          noResultsMsg.className = 'branch-no-results';
          noResultsMsg.textContent = 'No branches found matching your search.';
          noResultsMsg.style.cssText =
            'padding: 2rem; text-align: center; color: #6B6559; grid-column: 1 / -1;';
          branchCards[0].parentNode.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
      } else {
        if (noResultsMsg) {
          noResultsMsg.style.display = 'none';
        }
      }
    });
  }

  /* ============================================
     UTILITY FUNCTIONS
     ============================================ */
  function formatCurrency(value) {
    return '₹' + Math.round(value).toLocaleString('en-IN');
  }

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href === '#') {
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();

          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ============================================
     INITIALIZATION
     Run all initialization functions
     ============================================ */
  function init() {
    // DOM ready check
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        initNavbarScroll();
        initMobileNav();
        initFAQ();
        initEMICalculator();
        initGoldLoanCalculator();
        initContactForm();
        initApplyForm();
        initScrollAnimations();
        initCounterAnimation();
        initActiveNavLink();
        initBranchSearch();
        initSmoothScroll();
      });
    } else {
      initNavbarScroll();
      initMobileNav();
      initFAQ();
      initEMICalculator();
      initGoldLoanCalculator();
      initContactForm();
      initApplyForm();
      initScrollAnimations();
      initCounterAnimation();
      initActiveNavLink();
      initBranchSearch();
      initSmoothScroll();
    }
  }

  // Initialize on load
  init();
})();

/* ============================================
   GLOBAL UTILITY FUNCTION FOR CURRENCY
   ============================================ */
window.formatCurrency = function (value) {
  return '₹' + Math.round(value).toLocaleString('en-IN');
};
