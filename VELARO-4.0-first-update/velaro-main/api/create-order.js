import { json, supabase } from "./_shared.js";

function safe(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function makeOrderNumber() {
  const now = new Date();
  const stamp = [
    String(now.getFullYear()).slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0")
  ].join("");
  return `VLR-${stamp}`;
}

async function sendTelegram({ orderNumber, body, total }) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram не налаштовано у Vercel: потрібні TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID");
  }

  const items = body.items.map((item, index) => {
    const variant = item.braSize
      ? `Чашка: ${safe(item.braSize, 20)}; трусики: ${safe(item.pantiesSize, 20)}`
      : `Розмір: ${safe(item.size, 20)}`;

    return `${index + 1}. ${safe(item.name, 150)}\n${variant}\n${Number(item.quantity)} шт. × ${Number(item.price).toLocaleString("uk-UA")} грн`;
  }).join("\n\n");

  const deliveryParts = [
    safe(body.delivery?.method, 50),
    safe(body.delivery?.city, 120),
    safe(body.delivery?.branch, 120)
  ].filter(Boolean).join(", ");

  const text = `🛍 НОВЕ ЗАМОВЛЕННЯ ${orderNumber}\n\n👤 ${safe(body.customer.name, 120)}\n📞 ${safe(body.customer.phone, 30)}\n🚚 ${deliveryParts || "—"}\n\n${items}\n\n💰 Разом: ${total.toLocaleString("uk-UA")} грн${body.comment ? `\n💬 ${safe(body.comment, 1000)}` : ""}`;

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) {
    throw new Error(result.description || "Telegram не прийняв повідомлення");
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const body = req.body || {};
    const phone = String(body.customer?.phone || "").replace(/[\s\-()]/g, "");

    if (!body.customer?.name || !/^\+?380\d{9}$/.test(phone)) {
      return json(res, 400, { error: "Некоректні дані покупця" });
    }

    if (!Array.isArray(body.items) || !body.items.length) {
      return json(res, 400, { error: "Кошик порожній" });
    }

    const total = body.items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    let orderNumber = makeOrderNumber();
    let orderId = null;

    // Supabase є додатковим сховищем. Telegram працює незалежно від нього.
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const rows = await supabase("orders", {
          method: "POST",
          body: JSON.stringify({
            customer_name: safe(body.customer.name, 120),
            customer_phone: safe(body.customer.phone, 30),
            delivery_method: safe(body.delivery?.method, 50),
            delivery_city: safe(body.delivery?.city, 120),
            delivery_branch: safe(body.delivery?.branch, 120),
            comment: safe(body.comment, 1000),
            items: body.items,
            total,
            status: "new",
            is_new: true
          })
        });

        if (rows?.[0]) {
          orderId = rows[0].id;
          orderNumber = rows[0].order_number || orderNumber;
        }
      } catch (supabaseError) {
        console.error("Supabase save failed:", supabaseError);
      }
    }

    await sendTelegram({ orderNumber, body, total });

    return json(res, 201, {
      id: orderId,
      order_number: orderNumber,
      telegram_sent: true
    });
  } catch (error) {
    console.error("Create order failed:", error);
    return json(res, 500, {
      error: error.message || "Не вдалося створити замовлення"
    });
  }
}
