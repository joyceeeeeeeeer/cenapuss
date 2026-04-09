(function () {
  var origin = "https://cenapus.com";
  var path = window.location.pathname || "/index.html";
  var cleanPath = path === "/" ? "/index.html" : path;

  function langFromPath(p) {
    if (p.indexOf("/zh/") === 0) return "zh";
    if (p.indexOf("/it/") === 0) return "it";
    return "en";
  }

  function basePath(p) {
    if (p.indexOf("/zh/") === 0) return p.replace("/zh/", "/");
    if (p.indexOf("/it/") === 0) return p.replace("/it/", "/");
    return p;
  }

  var base = basePath(cleanPath);
  var urls = {
    en: origin + base,
    zh: origin + "/zh" + (base === "/index.html" ? "/index.html" : base),
    it: origin + "/it" + (base === "/index.html" ? "/index.html" : base)
  };

  function addLink(rel, href, hreflang) {
    var link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }

  addLink("canonical", origin + cleanPath);
  addLink("alternate", urls.en, "en");
  addLink("alternate", urls.zh, "zh");
  addLink("alternate", urls.it, "it");
  addLink("alternate", urls.en, "x-default");

  var lang = langFromPath(cleanPath);
  var orgDescription = {
    en: "Commercial freezer and smart retail solution manufacturer with OEM/ODM support.",
    zh: "商用制冷设备与智能零售解决方案制造商，支持OEM/ODM。",
    it: "Produttore di congelatori commerciali e soluzioni smart retail con supporto OEM/ODM."
  };

  var orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Qingdao Cenapus Technology Co., Ltd.",
    url: origin,
    email: "cenapus@163.com",
    telephone: "+86-18701281257",
    description: orgDescription[lang],
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 3, Changshengri Electric Yard, Daxin Street",
      addressLocality: "Jimo District, Qingdao",
      addressRegion: "Shandong",
      addressCountry: "CN"
    }
  };

  var orgScript = document.createElement("script");
  orgScript.type = "application/ld+json";
  orgScript.text = JSON.stringify(orgSchema);
  document.head.appendChild(orgScript);

  if (cleanPath.indexOf("/products/") !== -1) {
    var sku = cleanPath.split("/").pop().replace(".html", "").toUpperCase();
    var productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: sku,
      brand: "Cenapus",
      manufacturer: "Qingdao Cenapus Technology Co., Ltd."
    };
    var pScript = document.createElement("script");
    pScript.type = "application/ld+json";
    pScript.text = JSON.stringify(productSchema);
    document.head.appendChild(pScript);
  }
})();
