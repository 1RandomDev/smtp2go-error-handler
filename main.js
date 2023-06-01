"use strict";

require('dotenv').config();
const express = require('express');
const nodemailer = require("nodemailer");

checkEnv();

const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: process.env.SMTP_SECURE || true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    },
});

const webserverPort = parseInt(process.env.WEBSERVER_PORT || 3000);
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post('/smtp2go/'+process.env.WEBHOOK_TOKEN, (req, res) => {
    const data = req.body;

    switch(data.event) {
        case 'bounce':
            console.log('[BOUNCE]', JSON.stringify(data, null, 4));
            sendReportMail(data);
            break;
        
        case 'reject':
            console.log('[REJECT]', JSON.stringify(data, null, 4));
            sendReportMail(data);
            break;
        
            case 'spam':
            console.log('[SPAM]', JSON.stringify(data, null, 4));
            break;
    }

    res.send('OK');
});

app.listen(webserverPort, () => {
    console.log(`Started server on port ${webserverPort}. Send reports to '/smtp2go/${process.env.WEBHOOK_TOKEN}'.`);
});

async function sendReportMail(data) {
    if(data.subject == 'Mail test - please ignore') return;
    if(data.sender == process.env.SMTP_SENDER) return;
    try {
        await mailer.sendMail({
            from: `"Mail Delivery System" <${process.env.SMTP_SENDER}>`,
            to: data.sender,
            subject: "Delivery Notification (Failure)",
            text:
`This message was created automatically by mail delivery software.

A message that you sent could not be delivered to its recipient.
This is a permanent error. For more information please contact the postmaster.

The following address failed: ${data.rcpt}
SMTP error from remote server: host: ${data.host} reason: ${data.message}

--- Additional information from the server ---
Subject: ${data.subject}
Message-Id: ${data['message-id']}
Sendtime: ${data.sendtime}
Event: ${data.event}
`
        });
    } catch(e) {
        console.log('Error while sending report email:', e.message);
    }
}

function checkEnv() {
    const REQUIRED = ['WEBHOOK_TOKEN', 'SMTP_HOST', 'SMTP_SENDER'];
    let pass = true;
    REQUIRED.forEach(v => {
        if(process.env[v] === undefined) {
            console.log(`Environment variable '${v}' missing!`);
            pass = false;
        }
    });
    if(!pass) {
        process.exit(1);
    }
}
