/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			wide:      [ '961px',  '1880px' ],
			normal:    [ '961px',  '1620px' ],
			narrow:    [ '961px',  '1320px' ],
			narrower:  [ '737px',  '960px'  ],
			mobile:    [ null,     '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav_a = $nav.find('a');

		$nav_a
			.addClass('scrolly')
			.on('click', function(e) {

				var $this = $(this);

				// External link? Bail.
					if ($this.attr('href').charAt(0) != '#')
						return;

				// Prevent default.
					e.preventDefault();

				// Deactivate all links.
					$nav_a.removeClass('active');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
					if ($section.length < 1)
						return;

				// Scrollex.
					$section.scrollex({
						mode: 'middle',
						top: '-10vh',
						bottom: '-10vh',
						initialize: function() {

							// Deactivate section.
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
								$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
								if ($nav_a.filter('.active-locked').length == 0) {

									$nav_a.removeClass('active');
									$this.addClass('active');

								}

							// Otherwise, if this section's link is the one that's locked, unlock it.
								else if ($this.hasClass('active-locked'))
									$this.removeClass('active-locked');

						}
					});

			});

	// Scrolly.
		$('.scrolly').scrolly();

	// Header (narrower + mobile).

		// Toggle.
			$(
				'<div id="headerToggle">' +
					'<a href="#header" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Header.
			$('#header')
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'header-visible'
				});

})(jQuery);

document.addEventListener('DOMContentLoaded', function () {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const DURATION = 1200;
  const format = new Intl.NumberFormat('en-IN');

  function animate(el) {
    const target = Number(el.dataset.target || 0);
    const startTime = performance.now();
    function tick(t) {
      const p = Math.min((t - startTime) / DURATION, 1);
      el.textContent = format.format(Math.floor(target * p));
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = format.format(target);
    }
    requestAnimationFrame(tick);
  }

  // Fire as soon as page is ready (simpler than observer)
  counters.forEach(animate);
});

(function () {
  const form = document.querySelector('#contact form[action^="mailto"]');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.querySelector('[name="Full Name"]').value.trim();
    const email = form.querySelector('[name="Email"]').value.trim();
    const phone = form.querySelector('[name="Phone Number"]').value.trim();
    const req = form.querySelector('[name="Requirements"]').value.trim();

    const to = 'prem.karnan@kiaramfi.in';
    const subject = encodeURIComponent(`Website Enquiry - ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nRequirements: ${req}\n\n— Sent from dhanamfinance.com`
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    form.reset();
  });
})();

// --- Make contact map same height as the form to remove gap before footer
(function () {
  const formCol = document.querySelector('#contact .form-wrapper');
  const mapIfr  = document.querySelector('#contact .map-wrapper iframe');
  if (!formCol || !mapIfr) return;

  function syncMapHeight() {
    // Measure visible height of the form column
    const h = formCol.getBoundingClientRect().height;
    // Use at least 320px, otherwise match form height
    mapIfr.style.height = Math.max(320, Math.round(h)) + 'px';
  }

  // Debounce resize to avoid thrashing
  let t;
  function onResize() {
    clearTimeout(t);
    t = setTimeout(syncMapHeight, 120);
  }

  window.addEventListener('load', syncMapHeight);
  window.addEventListener('resize', onResize);
})();
