kiaramfi.com -> dhanamfinance.com  REDIRECT PACKAGE
====================================================

Purpose
-------
Kiara Microcredit Private Limited has been renamed to Dhanam Investment
and Finance Private Limited. The new website lives at
https://dhanamfinance.com. All traffic to the old domain kiaramfi.com
must be permanently (301) redirected to the new domain.

Current state of kiaramfi.com
-----------------------------
- Live PHP website with pages like index.php, policies.php, contact.php
- Built and maintained by "SaiTechnologies" (saitechnologies.in) per
  the footer of the old site
- Hosting provider and domain registrar are not yet confirmed
  internally at Dhanam

Who to contact first
--------------------
SaiTechnologies are almost certainly the people who can:
  (a) access the hosting/FTP/cPanel for kiaramfi.com, and
  (b) tell us which registrar the domain is at (so we can eventually
      let it lapse or transfer it to Dhanam).
Ask them to deploy these redirect files and then wipe all other old
KMCL site files from the hosting account.

Deployment instructions
-----------------------
Preferred (Apache / cPanel / most shared hosting):
  1. Log into the hosting control panel for kiaramfi.com.
  2. Back up the existing site (zip /public_html) just in case.
  3. Delete ALL files in the web root (public_html or equivalent).
  4. Upload the provided .htaccess file.
  5. Also upload the provided index.php as a fallback.
  6. Test:
       curl -I https://kiaramfi.com
       curl -I https://www.kiaramfi.com
       curl -I https://kiaramfi.com/policies.php
     All three should return:
       HTTP/1.1 301 Moved Permanently
       Location: https://dhanamfinance.com/

Fallback (if .htaccess is not allowed):
  Use just index.php and make sure the old hosting is configured to
  serve index.php as the default document. Note this will only catch
  requests that hit the PHP handler; any direct static URLs (.jpg, .pdf,
  .css) will still 404. That is acceptable for a shutdown redirect.

Alternative path (no hosting access needed)
-------------------------------------------
If SaiTechnologies cannot be reached or hosting access is lost, you
can achieve the same result at the domain registrar level:
  1. Log in to whichever registrar holds kiaramfi.com (GoDaddy,
     BigRock, Namecheap, etc.).
  2. Find "Domain Forwarding" or "URL Redirect".
  3. Set forwarding destination: https://dhanamfinance.com
  4. Type: 301 Permanent
  5. Masking: OFF (we want the user's URL bar to change)
This bypasses the hosting entirely but loses per-path redirects.

Long-term cleanup (after redirect is live)
------------------------------------------
- Update any printed materials, email signatures, business cards,
  RBI filings, and Google Business Profile entries that still point to
  kiaramfi.com.
- Decide whether to keep renewing kiaramfi.com (recommended for at
  least 2-3 years so inbound links and RBI records still resolve) or
  let it expire.
- Point the MX record for kiaramfi.com to the new Dhanam email system,
  or set up catch-all forwarding for support@kiaramfi.com and
  hrmanager@kiaramfi.com -> equivalent dhanam.finance addresses, so
  no customer or candidate email is lost.
