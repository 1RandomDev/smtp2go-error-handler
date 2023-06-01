# smtp2go-error-handler

Forwards delivery errors from SMTP2GO to the original sender of an email.

## Installation
Docker-CLI:
```bash
docker run -d --name=smtp2go-error-handler
    -p 3000:3000
    -e WEBHOOK_TOKEN=<random_string>
    -e SMTP_HOST=<mail.example.com>
    -e SMTP_USERNAME=<username>
    -e SMTP_PASSWORD=<password>
    -e SMTP_SENDER=<mailer-daemon@example.org>
    ghcr.io/1randomdev/smtp2go-error-handler:latest
```

## Configuration
| Name           | Default Value |
|----------------|---------------|
| WEBSERVER_PORT | `3000`        |
| WEBHOOK_TOKEN  | REQUIRED      |
| SMTP_HOST      | REQUIRED      |
| SMTP_PORT      | `465`         |
| SMTP_SECURE    | `true`        |
| SMTP_USERNAME  | *empty*       |
| SMTP_PASSWORD  | *empty*       |
| SMTP_SENDER    | REQUIRED      |
