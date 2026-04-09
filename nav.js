(function () {
  var SITE_ROOT = "/";
  (function resolveSiteRoot() {
    var sc = document.currentScript;
    if (sc && sc.src) {
      try {
        var pathname = new URL(sc.src).pathname;
        SITE_ROOT = pathname.replace(/nav\.js$/i, "").replace(/\/?$/, "/");
      } catch (e) {}
    }
  })();

  function localeFromPath(pathname) {
    if (pathname.indexOf("/zh/") !== -1) return "zh";
    if (pathname.indexOf("/it/") !== -1) return "it";
    return "en";
  }

  function stripLocalePrefix(pathname) {
    var zh = "/zh/";
    var zi = pathname.indexOf(zh);
    if (zi !== -1) return pathname.slice(zi + zh.length) || "index.html";
    var it = "/it/";
    var ii = pathname.indexOf(it);
    if (ii !== -1) return pathname.slice(ii + it.length) || "index.html";
    var root = SITE_ROOT;
    if (root !== "/" && pathname.indexOf(root) === 0) {
      var tail = pathname.slice(root.length);
      return tail || "index.html";
    }
    if (pathname === "/" || pathname === "") return "index.html";
    return pathname.startsWith("/") ? pathname.slice(1) : pathname;
  }

  function hrefForLocale(rest, locale) {
    var r = rest || "index.html";
    if (!r || r === "/") r = "index.html";
    if (r.startsWith("/")) r = r.slice(1);
    if (locale === "en") return SITE_ROOT + r;
    return SITE_ROOT + locale + "/" + r;
  }

  var path = window.location.pathname || "/index.html";
  if (path.endsWith("/")) path += "index.html";
  var loc = localeFromPath(path);
  var rest = stripLocalePrefix(path);
  if (rest.startsWith("/")) rest = rest.slice(1);

  var L = {
    en: {
      solutions: "Solutions",
      products: "Products",
      technology: "Technology",
      developers: "Developers",
      manufacturing: "Manufacturing",
      resources: "Resources",
      faq: "FAQ",
      about: "About",
      contact: "Contact",
      brand: "Cenapus",
      langLabel: "Language"
    },
    zh: {
      solutions: "解决方案",
      products: "产品",
      technology: "技术",
      developers: "开发者",
      manufacturing: "制造与定制",
      resources: "资料",
      faq: "常见问题",
      about: "关于我们",
      contact: "联系",
      brand: "Cenapus",
      langLabel: "语言"
    },
    it: {
      solutions: "Soluzioni",
      products: "Prodotti",
      technology: "Tecnologia",
      developers: "Developer",
      manufacturing: "Produzione",
      resources: "Risorse",
      faq: "FAQ",
      about: "Chi siamo",
      contact: "Contatto",
      brand: "Cenapus",
      langLabel: "Lingua"
    }
  };

  var t = L[loc] || L.en;
  var enH = hrefForLocale(rest, "en");
  var zhH = hrefForLocale(rest, "zh");
  var itH = hrefForLocale(rest, "it");

  function pageHref(file) {
    return hrefForLocale(file, loc);
  }

  var navItems = [
    { href: pageHref("solutions.html"), key: "solutions" },
    { href: pageHref("products.html"), key: "products" },
    { href: pageHref("technology.html"), key: "technology" },
    { href: pageHref("developers.html"), key: "developers" },
    { href: pageHref("manufacturing.html"), key: "manufacturing" },
    { href: pageHref("resources.html"), key: "resources" },
    { href: pageHref("faq.html"), key: "faq" },
    { href: pageHref("about.html"), key: "about" },
    { href: pageHref("contact.html"), key: "contact" }
  ];

  var homeHref = hrefForLocale("index.html", loc);

  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML =
    '<div class="container nav">' +
    '<a class="brand" href="' +
    homeHref +
    '">' +
    t.brand +
    "</a>" +
    '<nav class="nav-links" aria-label="Main">' +
    navItems
      .map(function (i) {
        return '<a href="' + i.href + '">' + t[i.key] + "</a>";
      })
      .join("") +
    "</nav>" +
    '<div class="lang" role="navigation" aria-label="' +
    t.langLabel +
    '">' +
    '<a href="' +
    enH +
    '" hreflang="en">EN</a> · <a href="' +
    zhH +
    '" hreflang="zh">中文</a> · <a href="' +
    itH +
    '" hreflang="it">IT</a>' +
    "</div>" +
    "</div>";

  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML =
    '<div class="container footer-inner">' +
    "<p>Qingdao Cenapus Technology Co., Ltd. · cenapus@163.com · +86 18701281257</p>" +
    "<p>No.3, Changshengri Electric Yard, Daxin Street, Jimo District, Qingdao, Shandong, China</p>" +
    '<p>© <span data-year></span> Cenapus</p>' +
    "</div>";

  document.body.insertBefore(header, document.body.firstChild);
  var firstScript = document.querySelector("body > script");
  if (firstScript) {
    document.body.insertBefore(footer, firstScript);
  } else {
    document.body.appendChild(footer);
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  var uiPath = SITE_ROOT.replace(/\/?$/, "/") + "ui.js";
  var already = false;
  document.querySelectorAll("script[src]").forEach(function (s) {
    if ((s.getAttribute("src") || "").indexOf("ui.js") !== -1) already = true;
  });
  if (!already) {
    var ui = document.createElement("script");
    ui.src = uiPath;
    ui.defer = true;
    document.body.appendChild(ui);
  }
})();
