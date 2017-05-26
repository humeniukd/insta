import config from '../config'
import nodemailer from 'nodemailer'
import {v4} from 'uuid'
import template from 'lodash/template'

const emailTmpl = template('<html><head>\
  <style>p{font-size:14pt;line-height:110%;font-family:"Arial",sans-serif;color:rgb(0, 188, 212)}</style>\
  </head><body>\
  <p>Dear <%= name %>, the car <b><%= make %> <%= model %> &euro;<%= price %></b> is waiting for you</p>\
  </body></html>'
)

const toTs = date => date.toISOString().replace(/\W/g, '').slice(0, -4)

export default async (car, user) => {
  const now = new Date()
  const dtStamp = toTs(now)
  const startDate = new Date(now.setDate(now.getDate() + 7))
  const startDateTs = toTs(startDate)
  const event = { description: 'You\'ve reserved a car', title: `${car.make} ${car.model}`, locationName: 'Car App' }

  const uid = v4()

  const mailOptions = {
    from: config.email,
    to: user.email,
    subject: event.title,
    text: event.description,
    html: emailTmpl({
      ...user,
      ...car
    }),
    icalEvent: {
      method: 'request',
      content: `BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTSTART:${startDateTs}Z\r\nDTEND:${startDateTs}Z\r\nDESCRIPTION:${event.description}\r\nSUMMARY:${event.title}\r\nORGANIZER;CN=John Doe:mailto:${config.email}\r\nLocation:${event.locationName}\r\nUID:${uid}\r\nSEQUENCE:0\r\nDTSTAMP:${dtStamp}Z\r\nBEGIN:VALARM\r\nTRIGGER:-PT1H\r\nACTION:DISPLAY\r\nDESCRIPTION:Reminder\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR`
    }
  }
  const transporter = nodemailer.createTransport(config.smtp)
  const result = await transporter.sendMail(mailOptions)
  return result
}
