var mailAddress = process.env.MAIL_ADDRESS;

var SMTPServer = require('smtp-server').SMTPServer;
var MailParser = require("mailparser").MailParser;
var onMail;

var options = {
    secure: false,
    hideSTARTTLS: true,
    disabledCommands: ['AUTH'],
    authMethods: [],
    onData: function(stream, session, callback){
        var to = session.envelope.rcptTo[0].address;
        if (to != mailAddress){
            console.log("Ignoring mail with recipient "+to);
            return
        }

        var mailParser = new MailParser();
        
        stream.pipe(mailParser);

        mailParser.on('end', function(mail){
            if (onMail){
                onMail(mail);
            }
            callback();
        });
    }
};

var server = new SMTPServer(options);

server.listen(process.env.PORT);

server.on('error', function(err){
    console.log('Error %s', err.message);
});

module.exports = {
    onMail: function(cb){
        onMail = cb;
    }
};
