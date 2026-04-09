export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const webhook = process.env.FEISHU_WEBHOOK_URL;
  if (!webhook) {
    return res.status(500).json({ ok: false, error: "Missing FEISHU_WEBHOOK_URL" });
  }

  try {
    const { name, email, country, type, message, lang } = req.body || {};
    const content = [
      "New Cenapus Inquiry",
      `Language: ${lang || "en"}`,
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `Country: ${country || "-"}`,
      `Type: ${type || "-"}`,
      `Message: ${message || "-"}`
    ].join("\n");

    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msg_type: "text",
        content: { text: content }
      })
    });

    if (!r.ok) {
      return res.status(502).json({ ok: false, error: "Feishu webhook failed" });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
