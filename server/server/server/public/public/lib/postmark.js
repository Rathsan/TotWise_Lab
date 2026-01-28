import { ServerClient } from 'postmark';

const serverToken = process.env.POSTMARK_SERVER_TOKEN;
const senderEmail = process.env.POSTMARK_SENDER_EMAIL;

if (!serverToken || !senderEmail) {
  throw new Error('Missing Postmark configuration');
}

export const postmarkClient = new ServerClient(serverToken);
export const postmarkSender = senderEmail;
