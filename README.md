# Mail to Dropbox

Tiny utility to forward mails to dropbox.

It listens for incoming mail and saves them to Dropbox.
Purposes may be many, but I use it as a way to archive attachments.

This package is tested using Dokku, but should work fine on Heroku and other platforms.

Configuration is expected to be in the environment, so be sure to set the following:

```bash
DROPBOX_ACCESS_TOKEN=       # Get it at https://www.dropbox.com/developers/apps/create
PORT=25                     # The port to listen to (highly suggested to set this to 25, smtp)
MAIL_ADDRESS=drop@mytld.com # The mail address to accept mails TO
```

On Dokku you can set these using `dokku config:set KEY1=VALUE1 KEY2=VALUE2`

## Additional steps to set-up on Dokku

1. You will need to turn off CHECKS, so do a:
    `dokku myapp checks:disable`
2. Dokku doesn't port-forward SMTP by default, so run this command:
    `dokku docker-options:add myapp deploy '-p 0.0.0.0:25:25'`

## What is saved

The algorithm will try to save stuff in the following order:

1. If there are attachments, then save only attachments
2. If there is a HTML body, then save only HTML body
3. If all else fails, save the TEXT body

## How does it know what name to use?

It will try to use the reverse sender domain by default. So if you get a mail from peter@sales.evilcompany.com,
it will use the name "evilcompany sales". It will also add attachment extension, or ".htm", or ".txt"

If a file already exists with the generated name it will prepend it with (1), then (2), etc...

## Any other goodies for me?

Yes one.

1. You can use the mail address directly with 3rd party services, but then all mails go there. If you want more flexibility I highly suggest using a GMail account and add filters to forward only the mails that you really want to end up in Dropbox.
