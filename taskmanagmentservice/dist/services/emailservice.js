"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, text }) {
    // Create a transporter using your email service's SMTP credentials
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail', // Change this to your email provider
        auth: {
            user: 'ogunremitunde12@gmail.com', // Your email address
            pass: 'ujjk rosj eqpj xovc', // Your email password or app password
        },
    });
    // Define email options
    const mailOptions = {
        from: 'ogunremitunde12@gmail.com',
        to,
        subject,
        text,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    }
    catch (error) {
        console.error('Error sending email: ', error);
    }
});
exports.default = sendEmail; // Default export
