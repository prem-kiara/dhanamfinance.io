 AOS.init({
 	duration: 800,
 	easing: 'slide',
 	once: true
 });

jQuery(document).ready(function($) {

	"use strict";

	
	$(".loader").delay(1000).fadeOut("slow");
  $("#overlayer").delay(1000).fadeOut("slow");	
  

	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function() {
			
			var counter = 0;
      $('.site-mobile-menu .has-children').each(function(){
        var $this = $(this);
        
        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find('.arrow-collapse').attr({
          'data-toggle' : 'collapse',
          'data-target' : '#collapseItem' + counter,
        });

        $this.find('> ul').attr({
          'class' : 'collapse',
          'id' : 'collapseItem' + counter,
        });

        counter++;

      });

    }, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
      var $this = $(this);
      if ( $this.closest('li').find('.collapse').hasClass('show') ) {
        $this.removeClass('active');
      } else {
        $this.addClass('active');
      }
      e.preventDefault();  
      
    });

		$(window).resize(function() {
			var $this = $(this),
				w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		}) 

		// click outisde offcanvas
		$(document).mouseup(function(e) {
	    var container = $(".site-mobile-menu");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
	    }
		});
	}; 
	siteMenuClone();


	var sitePlusMinus = function() {
		$('.js-btn-minus').on('click', function(e){
			e.preventDefault();
			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function(e){
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	// sitePlusMinus();


	var siteSliderRange = function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	};
	// siteSliderRange();


	
	var siteCarousel = function () {
		if ( $('.nonloop-block-13').length > 0 ) {
			$('.nonloop-block-13').owlCarousel({
		    center: false,
		    items: 1,
		    loop: true,
				stagePadding: 0,
		    margin: 0,
		    autoplay: true,
		    nav: true,
				navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
		    responsive:{
	        600:{
	        	margin: 0,
	        	nav: true,
	          items: 2
	        },
	        1000:{
	        	margin: 0,
	        	stagePadding: 0,
	        	nav: true,
	          items: 3
	        },
	        1200:{
	        	margin: 0,
	        	stagePadding: 0,
	        	nav: true,
	          items: 4
	        }
		    }
			});
		}

		$('.single-text').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    autoplay: true,
	    pauseOnHover: false,
	    nav: false,
	    smartSpeed: 1000,
	  });
		$('.slide-one-item').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    autoplay: true,
	    smartSpeed: 1000,
	    pauseOnHover: false,
	    nav: true,
	    navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
	  });

	  

	  $('.slide-one-item-alt').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    smartSpeed: 1000,
	    autoplay: true,
	    pauseOnHover: true,
	    mouseDrag: false,
	    touchDrag: false,
	  });
	  $('.slide-one-item-alt-text').owlCarousel({
	    center: false,
	    items: 1,
	    loop: true,
			stagePadding: 0,
	    margin: 0,
	    smartSpeed: 1000,
	    autoplay: true,
	    pauseOnHover: true,
	    mouseDrag: false,
	    touchDrag: false,
	    
	  });
	  

	  $('.custom-next').click(function(e) {
	  	e.preventDefault();
	  	$('.slide-one-item-alt').trigger('next.owl.carousel');
	  	$('.slide-one-item-alt-text').trigger('next.owl.carousel');
	  });
	  $('.custom-prev').click(function(e) {
	  	e.preventDefault();
	  	$('.slide-one-item-alt').trigger('prev.owl.carousel');
	  	$('.slide-one-item-alt-text').trigger('prev.owl.carousel');
	  });
	  
	};
	siteCarousel();

	var siteStellar = function() {
		$(window).stellar({
	    responsive: false,
	    parallaxBackgrounds: true,
	    parallaxElements: true,
	    horizontalScrolling: false,
	    hideDistantElements: false,
	    scrollProperty: 'scroll'
	  });
	};
	// siteStellar();

	var siteCountDown = function() {

		$('#date-countdown').countdown('2020/10/10', function(event) {
		  var $this = $(this).html(event.strftime(''
		    + '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
		    + '<span class="countdown-block"><span class="label">%d</span> days </span>'
		    + '<span class="countdown-block"><span class="label">%H</span> hr </span>'
		    + '<span class="countdown-block"><span class="label">%M</span> min </span>'
		    + '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
		});
				
	};
	siteCountDown();

	var siteDatePicker = function() {

		if ( $('.datepicker').length > 0 ) {
			$('.datepicker').datepicker();
		}

	};
	siteDatePicker();

	var siteSticky = function() {
		$(".js-sticky-header").sticky({topSpacing:0});
	};
	siteSticky();

	// navigation
  var OnePageNavigation = function() {
    var navToggler = $('.site-menu-toggle');
   	$("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a", function(e) {
      e.preventDefault();

      var hash = this.hash;

      $('html, body').animate({
        'scrollTop': $(hash).offset().top
      }, 600, 'easeInOutExpo', function(){
        window.location.hash = hash;
      });

    });
  };
  OnePageNavigation();

  var siteScroll = function() {

  	

  	$(window).scroll(function() {

  		var st = $(this).scrollTop();

  		if (st > 100) {
  			$('.js-sticky-header').addClass('shrink');
  		} else {
  			$('.js-sticky-header').removeClass('shrink');
  		}

  	}) 

  };
  siteScroll();


  var siteIstotope = function() {
  	/* activate jquery isotope */
	  var $container = $('#posts').isotope({
	    itemSelector : '.item',
	    isFitWidth: true
	  });

	  $(window).resize(function(){
	    $container.isotope({
	      columnWidth: '.col-sm-3'
	    });
	  });
	  
	  $container.isotope({ filter: '*' });

  }

  siteIstotope();


  $('.fancybox').on('click', function() {
	  var visibleLinks = $('.fancybox');

	  $.fancybox.open( visibleLinks, {}, visibleLinks.index( this ) );

	  return false;
	});

});

/* ===== Achievements Counters (always works, blue + bold style is via CSS below) ===== */
(function initAchievementsCounters() {
  const section = document.querySelector('#achievements');
  if (!section) return;

  const nums = Array.from(section.querySelectorAll('.stat-number'));
  if (!nums.length) return;

  const easeOutQuad = t => t * (2 - t);
  const fmt = new Intl.NumberFormat('en-IN');

  function animate(el) {
    const target = Number(el.getAttribute('data-target')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const v = Math.round(target * easeOutQuad(p));
      el.textContent = fmt.format(v) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  let ran = false;
  function runIfNeeded() {
    if (ran) return;
    const r = section.getBoundingClientRect();
    const inView = r.top < window.innerHeight * 0.85 && r.bottom > 0;
    if (inView) {
      ran = true;
      nums.forEach(animate);
      window.removeEventListener('scroll', runIfNeeded);
      window.removeEventListener('resize', runIfNeeded);
    }
  }

  // run immediately if already visible, otherwise on scroll/resize
  runIfNeeded();
  window.addEventListener('scroll', runIfNeeded, { passive: true });
  window.addEventListener('resize', runIfNeeded);
})();


/* ===== Disclaimer Modal (every page load on index.html) ===== */
$(function () {
  const onHome = /(^|\/)index\.html?$/i.test(location.pathname) || location.pathname === '/' || location.pathname === '';
  if (!onHome) return;

  // Use the modal that already exists in your HTML:
  const $m = $('#disclaimerModal');
  if ($m.length) {
    $m.modal({ backdrop: 'static', keyboard: false, show: true });
  }
});

// ===== Smooth scroll when clicking the bottom scroll icon =====
document.addEventListener('DOMContentLoaded', function () {
  const scrollIcon = document.querySelector('.mouse');
  if (!scrollIcon) return;

  scrollIcon.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
      top: window.scrollY + window.innerHeight,
      behavior: 'smooth'
    });
  });
});

// Keep the map the same height as the form card (desktop), with fallbacks on mobile.
(function syncMapHeight(){
  const map = document.querySelector('#mapEmbed');
  const form = document.querySelector('#contact-section .contact-card');
  if (!map || !form) return;

  function fit(){
    if (window.innerWidth >= 992) {
      map.style.height = form.offsetHeight + 'px';
    } else {
      map.style.height = ''; // use CSS heights on smaller screens
    }
  }
  window.addEventListener('load', fit, { once:true });
  window.addEventListener('resize', fit);
  // If fonts/images change height later:
  setTimeout(fit, 200);
})();

// Accordion behavior inside Products: close siblings when one opens
(function(){
  var services = document.getElementById('services-section');
  if(!services) return;

  $(services).on('show.bs.collapse', '.collapse', function(){
    $(services).find('.collapse.show').not(this).collapse('hide');
  });
})();

// CONTACT FORM (static site friendly)
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusBox = document.getElementById('contactStatus');
  const submitBtn = document.getElementById('contactSubmit');

  const setStatus = (msg, ok = true) => {
    statusBox.className = ok ? 'form-success' : 'form-error';
    statusBox.textContent = msg;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple honeypot
    const hp = form.querySelector('input[name="company"]');
    if (hp && hp.value.trim() !== '') {
      setStatus('Sorry, something went wrong. Please try again later.', false);
      return;
    }

    // Native validity + styling
    let valid = true;
    form.querySelectorAll('.form-control').forEach(el => {
      if (!el.checkValidity()) {
        el.classList.add('is-invalid');
        valid = false;
      } else {
        el.classList.remove('is-invalid');
      }
    });

    if (!valid) {
      setStatus('Please correct the highlighted fields.', false);
      return;
    }

    // Disable while "sending"
    submitBtn.disabled = true;

    // Build a mailto to your address
    const to = 'contact@dhanamfin.com'; // <-- change if needed
    const data = Object.fromEntries(new FormData(form).entries());

    const subject = encodeURIComponent(`[Website] ${data.subject} — ${data.firstName} ${data.lastName}`);
    const body = encodeURIComponent(
`Name: ${data.firstName} ${data.lastName}
Email: ${data.email}

Message:
${data.message}

— Sent from dhanamfinance.io`
    );

    // Open user mail client
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    setStatus('Thanks! Your email app will open with the message pre-filled.', true);
    submitBtn.disabled = false;

    // Optional: clear the form
    // form.reset();
  });

  // Live validity styling on input
  form.querySelectorAll('.form-control').forEach(el => {
    el.addEventListener('input', () => {
      if (el.checkValidity()) el.classList.remove('is-invalid');
    });
  });
})();

/* ===========================
   Scroll bar + WhatsApp widget
   =========================== */
(function () {
  // --- Progress bar (inject + update)
  const barHost = document.createElement('div');
  barHost.id = 'scrollbar';
  barHost.innerHTML = '<div class="scrollbar__progress"></div>';
  document.body.appendChild(barHost);

  const prog = barHost.firstElementChild;
  function setProgress() {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    prog.style.width = pct + '%';
  }
  window.addEventListener('scroll', setProgress, { passive: true });
  window.addEventListener('resize', setProgress);
  setProgress();

})();

// ===== Official WhatsApp FAB =====
(function() {
  // create wrapper
  const fab = document.createElement('div');
  fab.id = 'waFab';
  fab.innerHTML = `
    <style>
      #waFab {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: system-ui, sans-serif;
      }
      #waFabBtn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: #25D366;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,.2);
        cursor: pointer;
      }
      #waFabBtn svg {
        width: 24px;
        height: 24px;
      }
      #waFabPanel {
        position: absolute;
        bottom: 60px;
        right: 0;
        min-width: 220px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,.15);
        padding: 10px;
        display: none;
      }
      #waFabPanel a {
        display: block;
        padding: 8px 10px;
        border-radius: 6px;
        color: #111;
        text-decoration: none;
        font-size: 14px;
      }
      #waFabPanel a:hover {
        background: #f3f3f3;
      }
    </style>
    <button id="waFabBtn" aria-label="WhatsApp">
      <!-- Official WhatsApp SVG icon -->
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M19.11 17.35c-.29-.14-1.69-.83-1.95-.92-.26-.1-.45-.14-.64.14-.19.29-.73.92-.9 1.11-.17.19-.33.22-.62.07-.29-.14-1.22-.45-2.33-1.43-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.45.13-.59.14-.14.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.13-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36s-1 .98-1 2.39 1.03 2.77 1.18 2.96c.14.19 2.02 3.08 4.89 4.32 2.87 1.23 2.87.82 3.39.78.52-.04 1.69-.69 1.93-1.37.24-.69.24-1.28.17-1.41-.07-.12-.26-.2-.55-.33zM16 3.2c-6.99 0-12.8 5.69-12.8 12.68 0 2.25.59 4.34 1.63 6.14L3.2 28.8l6.96-1.82c1.74.95 3.73 1.49 5.84 1.49 6.99 0 12.8-5.69 12.8-12.68C28.8 8.89 22.99 3.2 16 3.2zm0 22.96c-1.98 0-3.82-.58-5.36-1.58l-.38-.24-4.12 1.08 1.1-4.02-.25-.41A10.22 10.22 0 0 1 5.78 15.9C5.78 10.34 10.43 5.7 16 5.7s10.22 4.64 10.22 10.2S21.57 26.16 16 26.16z"/>
      </svg>
    </button>
    <div id="waFabPanel">
      <a href="https://wa.me/917305074658?text=Hi%20Sanjay%2C%20I%27m%20interested%20in%20a%20Gold%20Loan" target="_blank">💰 Gold Loan — Sanjay</a>
      <a href="https://wa.me/918925963943?text=Hi%20Sabarishini%2C%20I%27m%20interested%20in%20a%20Loan%20Against%20Property" target="_blank">🏠 Loan Against Property — Sabarishini</a>
    </div>
  `;

  document.body.appendChild(fab);

  const btn = document.getElementById('waFabBtn');
  const panel = document.getElementById('waFabPanel');

  btn.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) panel.style.display = 'none';
  });
})();
