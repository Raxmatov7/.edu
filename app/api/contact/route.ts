import { NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = "7394084190:AAHMooyA5jjzxy9maa7bFLIIoIBMQDkGVNM"
const TELEGRAM_CHAT_ID = "6204382478" // ID qo‘shildi

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Format message for Telegram
    const telegramMessage = `
🆕 Yangi xabar:

👤 Ism: ${name}
📧 Email: ${email}
💬 Xabar: ${message}
    `.trim()

    // Send message to Telegram
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    })

    if (!response.ok) {
      throw new Error('Telegram API error')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
