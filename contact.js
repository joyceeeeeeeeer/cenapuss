function contactApiUrl() {
  var sc = document.currentScript;
  if (sc && sc.src) {
    try {
      var u = new URL(sc.src);
      u.pathname = u.pathname.replace(/[^/]*$/, "");
      return new URL("api/contact", u).pathname;
    } catch (e) {}
  }
  return "/api/contact";
}

async function submitInquiry(form, statusEl, lang) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.lang = lang;
  statusEl.textContent = lang === "zh" ? "提交中..." : lang === "it" ? "Invio in corso..." : "Submitting...";
  try {
    const res = await fetch(contactApiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("failed");
    statusEl.textContent = lang === "zh" ? "提交成功，我们会尽快联系你。" : lang === "it" ? "Inviato con successo. Ti contatteremo presto." : "Submitted successfully. We will contact you soon.";
    form.reset();
  } catch (e) {
    statusEl.textContent = lang === "zh" ? "提交失败，请稍后再试或直接发邮件至 cenapus@163.com" : lang === "it" ? "Invio fallito. Riprova o invia email a cenapus@163.com" : "Submit failed. Please retry or email cenapus@163.com.";
  }
}

document.querySelectorAll("[data-inquiry-form]").forEach((form) => {
  const lang = form.getAttribute("data-lang") || "en";
  const statusEl = form.querySelector(".status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitInquiry(form, statusEl, lang);
  });
});
