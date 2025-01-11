import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async ({ to, subject, text }: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ogunremitunde12@gmail.com',
      pass: 'ujjk rosj eqpj xovc',
    },
  });

  const mailOptions = {
    from: 'ogunremitunde12@gmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

export default sendEmail;
