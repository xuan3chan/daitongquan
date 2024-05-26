import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      from: 'support@nextfilm.co',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmailWithCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: 'support@nextfilm.co',
      to: email,
      subject: 'DaiQuanGia - Password Reset Instructions',
      html: `
      <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      color: #fff;
    }
  </style>
  <body style="background-color: #25293c">
    <div
      style="
        max-width: 800px;
        margin: 0 auto;
        background-color: #2f3349;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 10px;
      "
    >
      <div
        style="
          background-color: #7367f0;
          text-align: center;
          color: #fff;
          margin-bottom: 10px;
          height: 100px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        "
      >
        <h1 style="text-transform: uppercase; padding-top: 27px">
          Dai quan gia
        </h1>
      </div>
      <div style="padding: 20px">
        <h4 style="margin-bottom: 10px; color: #fff">Dear user,</h4>
        <p style="color: #fff">
          We received a request to reset your password for your DaiQuanGia
          account.
        </p>
        <p style="margin-bottom: 10px; color: #fff">
          Here is your password reset code:
        </p>

        <div
          style="
            margin-bottom: 10px;
            font-size: 46px;
            font-weight: bold;
            text-align: center;
            color: #fff;
          "
        >
          <p>${code}</p>
        </div>

        <p style="margin-bottom: 15px; color: #fff">
          If you did not request a password reset, please ignore this email or
          reply to let us know. This password reset is only valid for the next
          5 minutes.
        </p>

        <p style="color: #fff">Thank you, DaiQuanGia Support Team</p>
      </div>
    </div>`,
    };

    const info = await this.transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId, code);
  }
}
