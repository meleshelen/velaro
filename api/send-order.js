module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Дозволено лише POST-запити"
    });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram environment variables are missing");

    return res.status(500).json({
      success: false,
      error: "Telegram не налаштовано"
    });
  }

  const orderText = String(req.body?.orderText || "").trim();

  if (!orderText) {
    return res.status(400).json({
      success: false,
      error: "Текст замовлення порожній"
    });
  }

  if (orderText.length > 4000) {
    return res.status(400).json({
      success: false,
      error: "Замовлення занадто велике"
    });
  }

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: orderText
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram API error:", telegramResult);

      return res.status(502).json({
        success: false,
        error: "Telegram не прийняв повідомлення"
      });
    }

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error("Telegram request error:", error);

    return res.status(500).json({
      success: false,
      error: "Не вдалося надіслати замовлення"
    });
  }
};