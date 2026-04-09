exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Method not allowed" }) };
  }

  const webhook = process.env.FEISHU_WEBHOOK_URL;
  if (!webhook) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Missing FEISHU_WEBHOOK_URL" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const content = [
      "New Cenapus Inquiry",
      `Language: ${body.lang || "en"}`,
      `Name: ${body.name || "-"}`,
      `Email: ${body.email || "-"}`,
      `Country: ${body.country || "-"}`,
      `Type: ${body.type || "-"}`,
      `Message: ${body.message || "-"}`
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
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: "Feishu webhook failed" }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Server error" }) };
  }
};
