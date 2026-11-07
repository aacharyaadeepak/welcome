import { connect } from 'cloudflare:sockets'

interface Env {
  ALLOWED_ORIGIN: string
  SMTP_USER: string
  SMTP_PASSWORD: string
  SMTP_HOST?: string
  SMTP_PORT?: string
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

interface Socket {
  readable: ReadableStream<Uint8Array>
  writable: WritableStream<Uint8Array>
  startTls(): Socket
  close(): Promise<void>
}

interface SmtpAddress {
  hostname: string
  port: number
}

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

function createEmailMessage(
  booking: BookingRequest,
  senderAddress: string,
): string {
  const subject = base64Utf8(`Booking request from ${booking.name}`)
  const body = wrapBase64(base64Utf8(formatBookingMessage(booking)))
  return [
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
}

function encodeSmtpData(value: string): Uint8Array {
  const stuffed = value.replace(/(^|\r\n)\./gu, '$1..')
  return new TextEncoder().encode(`${stuffed}\r\n.\r\n`)
}

class SmtpClient {
  private reader: ReadableStreamDefaultReader<Uint8Array>
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private buffer = ''

  constructor(private socket: Socket) {
    this.reader = socket.readable.getReader()
    this.writer = socket.writable.getWriter()
  }

  async readResponse(expectedCodes: number[]): Promise<void> {
    const lines: string[] = []
    let complete = false

    while (!complete) {
      const line = await this.readLine()
      lines.push(line)
      complete = /^\d{3} /u.test(line)
    }

    const statusCode = Number(lines[lines.length - 1].slice(0, 3))
    if (!expectedCodes.includes(statusCode)) {
      throw new Error(`SMTP server returned status ${statusCode}.`)
    }
  }

  async command(command: string, expectedCodes: number[]): Promise<void> {
    await this.writer.write(new TextEncoder().encode(`${command}\r\n`))
    await this.readResponse(expectedCodes)
  }

  async sendData(message: string): Promise<void> {
    await this.writer.write(encodeSmtpData(message))
    await this.readResponse([250])
  }

  async upgradeToTls(): Promise<void> {
    this.reader.releaseLock()
    this.writer.releaseLock()
    this.socket = this.socket.startTls()
    this.reader = this.socket.readable.getReader()
    this.writer = this.socket.writable.getWriter()
    this.buffer = ''
  }

  async close(): Promise<void> {
    this.reader.releaseLock()
    this.writer.releaseLock()
    await this.socket.close()
  }

  private async readLine(): Promise<string> {
    while (true) {
      const lineEnd = this.buffer.indexOf('\r\n')
      if (lineEnd !== -1) {
        const line = this.buffer.slice(0, lineEnd)
        this.buffer = this.buffer.slice(lineEnd + 2)
        return line
      }

      const { value, done } = await this.reader.read()
      if (done) {
        throw new Error('SMTP server closed the connection unexpectedly.')
      }
      this.buffer += new TextDecoder().decode(value)
    }
  }
}

async function sendBookingEmail(
  env: Env,
  booking: BookingRequest,
): Promise<void> {
  const hostname = env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(env.SMTP_PORT || '587')
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('SMTP port configuration is invalid.')
  }

  const socket = connect(
    { hostname, port } satisfies SmtpAddress,
    { secureTransport: 'starttls' },
  ) as Socket
  const client = new SmtpClient(socket)

  try {
    await client.readResponse([220])
    await client.command('EHLO welcome-booking-email', [250])
    await client.command('STARTTLS', [220])
    await client.upgradeToTls()
    await client.command('EHLO welcome-booking-email', [250])
    await client.command('AUTH LOGIN', [334])
    await client.command(base64Utf8(env.SMTP_USER), [334])
    await client.command(base64Utf8(env.SMTP_PASSWORD), [235])
    await client.command(`MAIL FROM:<${env.SMTP_USER}>`, [250])
    await client.command(`RCPT TO:<${recipientAddress}>`, [250, 251])
    await client.command(`RCPT TO:<${ccAddress}>`, [250, 251])
    await client.command('DATA', [354])
    await client.sendData(createEmailMessage(booking, env.SMTP_USER))
    await client.command('QUIT', [221])
  } finally {
    await client.close()
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!env.ALLOWED_ORIGIN) {
      return jsonResponse(env, { error: 'Email API is not configured.' }, 500)
    }

    if (!env.SMTP_USER || !env.SMTP_PASSWORD) {
      return jsonResponse(env, { error: 'SMTP credentials are not configured.' }, 503)
    }
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u.test(env.SMTP_USER)) {
      return jsonResponse(env, { error: 'SMTP sender address is invalid.' }, 500)
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
