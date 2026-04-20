<?php
// =====================================================================
// kiaramfi.com -> dhanamfinance.com  (301 Permanent Redirect)
// =====================================================================
// PHP fallback in case .htaccess is disabled on the hosting account.
// Place this as the ONLY file at the web root of kiaramfi.com hosting
// and delete all other old KMCL site files.
// =====================================================================

header("HTTP/1.1 301 Moved Permanently");
header("Location: https://dhanamfinance.com/");
header("Cache-Control: max-age=3600, public");
exit;
?>
