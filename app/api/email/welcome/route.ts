import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import WelcomeEmail from '@/emails/WelcomeEmail';
import React from 'react';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      const emailHtml = await render(React.createElement(WelcomeEmail, { userName: name || email.split('@')[0] }));
      
      await transporter.sendMail({
        from: `"Resume Builder" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Welcome to the Future of Resumes',
        html: emailHtml,
      });
    } else {
      console.log('NO SMTP CREDENTIALS, EMAIL NOT SENT');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
