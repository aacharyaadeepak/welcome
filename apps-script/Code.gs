const RECIPIENT = 'aacharyaadeepak@gmail.com'
const CC_RECIPIENT = 'uniyaldeepak831@gmail.com'

function doPost(event) {
  try {
    const request = JSON.parse(event.postData.contents)
    const booking = validateBooking(request)

    GmailApp.sendEmail(RECIPIENT, `Booking request from ${booking.name}`, formatBooking(booking), {
      cc: CC_RECIPIENT,
      replyTo: booking.email,
      name: 'Acharya Deepak',
    })

    return ContentService
      .createTextOutput(JSON.stringify({ message: 'Booking request sent.' }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error(`Booking email failed: ${error.message}`)
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Booking request could not be sent.' }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function validateBooking(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    throw new Error('Invalid booking request.')
  }

  const limits = {
    name: 200,
    email: 254,
    phone: 60,
    service: 200,
    mode: 120,
    gotra: 200,
    date: 40,
    language: 80,
    message: 4000,
  }
  const booking = {}

  Object.keys(limits).forEach((field) => {
    const value = request[field]
    if (typeof value !== 'string' || value.length > limits[field]) {
      throw new Error(`Invalid ${field} field.`)
    }
    booking[field] = value.trim()
  })

  if (
    !booking.name ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(booking.email) ||
    !booking.phone ||
    !booking.service ||
    !booking.mode ||
    !booking.language
  ) {
    throw new Error('Required booking fields are missing or invalid.')
  }

  return booking
}

function formatBooking(booking) {
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
  ].join('\n')
}
