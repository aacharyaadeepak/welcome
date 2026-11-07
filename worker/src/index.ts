interface Env {
  ALLOWED_ORIGIN: string
  GMAIL_CLIENT_ID: string
  GMAIL_CLIENT_SECRET: string
  GMAIL_REFRESH_TOKEN: string
}

interface BookingRequest {
  name: string
  email: string
  phone: string
  service: string
  mode: string
  gotra: string
  date: string
  language: string
  message: string
}

const senderAddress = 'aacharyaadeepak@gmail.com'
const recipientAddress = 'aacharyaadeepak@gmail.com'
const ccAddress = 'uniyaldeepak831@gmail.com'
const senderName = 'Deepak Uniyal (Aacharya Deepak)'
const maxRequestBytes = 16_384

function jsonResponse(
  env: Env,
  body: Record<string, string>,
  status = 200,
): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  })

  if (env.ALLOWED_ORIGIN) {
    headers.set('Access-Control-Allow-Origin', env.ALLOWED_ORIGIN)
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
  }

  return new Response(JSON.stringify(body), { status, headers })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getField(
  data: Record<string, unknown>,
  name: keyof BookingRequest,
  maxLength: number,
): string | null {
  const value = data[name]
  if (typeof value !== 'string' || value.length > maxLength) {
    return null
  }
  return value.trim()
}

function parseBookingRequest(data: unknown): BookingRequest | null {
  if (!isRecord(data)) {
    return null
  }

  const name = getField(data, 'name', 200)
  const email = getField(data, 'email', 254)
  const phone = getField(data, 'phone', 60)
  const service = getField(data, 'service', 200)
  const mode = getField(data, 'mode', 120)
  const gotra = getField(data, 'gotra', 200)
  const date = getField(data, 'date', 40)
  const language = getField(data, 'language', 80)
  const message = getField(data, 'message', 4_000)

  if (
    name === null ||
    email === null ||
    phone === null ||
    service === null ||
    mode === null ||
    gotra === null ||
    date === null ||
    language === null ||
    message === null ||
    !name ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u.test(email) ||
    !phone ||
    !service ||
    !mode ||
    !language
  ) {
    return null
  }

  return { name, email, phone, service, mode, gotra, date, language, message }
}

function base64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
  }
  return btoa(binary)
}

function base64UrlUtf8(value: string): string {
  return base64Utf8(value)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')
}

async function getGmailAccessToken(env: Env): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET,
      refresh_token: env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const result: unknown = await response.json().catch(() => null)

  if (
    !response.ok ||
    !isRecord(result) ||
    typeof result.access_token !== 'string'
  ) {
    console.error(`Google OAuth token request failed with status ${response.status}.`)
    throw new Error('Email delivery is temporarily unavailable.')
  }

  return result.access_token
}

function formatBookingMessage(booking: BookingRequest): string {
  return [
    'A new booking request was submitted.',
    '',
    `Name: ${booking.name}`,
    `Email: ${booking.email}`,
    `Phone / WhatsApp: ${booking.phone}`,
    `Service: ${booking.service}`,
    `Ritual mode: ${booking.mode}`,
    `Gotra & Nakshatra: ${booking.gotra || 'Not provided'}`,
    `Preferred date: ${booking.date || 'Not provided'}`,
    `Preferred language: ${booking.language}`,
    '',
    'Special prayer / birth details:',
    booking.message || 'Not provided',
  ].join('\r\n')
}

function wrapBase64(value: string): string {
  return value.match(/.{1,76}/g)?.join('\r\n') ?? ''
}

function createRawEmail(booking: BookingRequest): string {
  const subject = base64Utf8(`Booking request from ${booking.name}`)
  const body = wrapBase64(base64Utf8(formatBookingMessage(booking)))
  const mimeMessage = [
    `From: ${senderName} <${senderAddress}>`,
    `To: ${recipientAddress}`,
    `Cc: ${ccAddress}`,
    `Reply-To: ${booking.email}`,
    `Subject: =?UTF-8?B?${subject}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
  ].join('\r\n')

  return base64UrlUtf8(mimeMessage)
}

async function sendBookingEmail(
  env: Env,
  booking: BookingRequest,
): Promise<void> {
  const accessToken = await getGmailAccessToken(env)
  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: createRawEmail(booking) }),
    },
  )

  if (!response.ok) {
    console.error(`Gmail send request failed with status ${response.status}.`)
    throw new Error('Email delivery is temporarily unavailable.')
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!env.ALLOWED_ORIGIN) {
      return jsonResponse(env, { error: 'Email API is not configured.' }, 500)
    }

    if (
      !env.GMAIL_CLIENT_ID ||
      !env.GMAIL_CLIENT_SECRET ||
      !env.GMAIL_REFRESH_TOKEN
    ) {
      return jsonResponse(env, { error: 'Email API credentials are not configured.' }, 503)
    }

    if (request.headers.get('Origin') !== env.ALLOWED_ORIGIN) {
      return jsonResponse(env, { error: 'Origin is not allowed.' }, 403)
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-store',
          Vary: 'Origin',
        },
      })
    }

    if (request.method !== 'POST') {
      return jsonResponse(env, { error: 'Method not allowed.' }, 405)
    }

    if (
      !request.headers
        .get('Content-Type')
        ?.toLowerCase()
        .startsWith('application/json')
    ) {
      return jsonResponse(env, { error: 'Expected a JSON request.' }, 415)
    }

    const requestText = await request.text()
    if (new TextEncoder().encode(requestText).byteLength > maxRequestBytes) {
      return jsonResponse(env, { error: 'Booking request is too large.' }, 413)
    }

    let requestData: unknown
    try {
      requestData = JSON.parse(requestText)
    } catch {
      return jsonResponse(env, { error: 'Booking request is not valid JSON.' }, 400)
    }

    const booking = parseBookingRequest(requestData)
    if (!booking) {
      return jsonResponse(env, { error: 'Please check the booking form fields.' }, 400)
    }

    try {
      await sendBookingEmail(env, booking)
    } catch (error) {
      console.error('Booking email delivery failed.', error)
      return jsonResponse(
        env,
        { error: 'Your request could not be emailed. Please try again later.' },
        502,
      )
    }

    return jsonResponse(env, { message: 'Booking request sent.' })
  },
}
