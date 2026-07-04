import nodemailer from 'nodemailer';

export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtpEmail = async (email, otp) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.log(`OTP for ${email}: ${otp}`);
    return { delivered: false, message: 'SMTP is not configured. OTP printed in backend terminal.' };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to: email,
    subject: 'Hospital Manager OTP Verification',
    text: `Your Hospital Manager verification OTP is ${otp}. It expires in 10 minutes.`
  });

  return { delivered: true, message: 'OTP email sent.' };
};