/* Builds mailto: links at runtime so the address is never sitting in the HTML
   as plain text for address harvesters to regex out of the page source.
   Without JavaScript every one of these links still works, it just points at
   the contact form on /about/ instead of opening a mail client. */
(function () {
  var addr;
  try { addr = atob("cmFjaGFlbGl3cml0aW5nQGdtYWlsLmNvbQ=="); } catch (e) { return; }
  if (!addr) return;

  var nodes = document.querySelectorAll("[data-mail]");
  for (var i = 0; i < nodes.length; i++) {
    var el = nodes[i];
    var subject = el.getAttribute("data-subject");
    el.setAttribute("href", "mailto:" + addr + (subject ? "?subject=" + encodeURIComponent(subject) : ""));
    if (el.hasAttribute("data-mail-text")) el.textContent = addr;
  }
})();
