
var smtp = require('./smtp_server');
var dropbox = require('./dropbox');
var queue = [];

smtp.onMail(function(mail){
    var from = mail.from[0].address;
    var to = mail.to[0].address;

    console.log()
    console.log("New message");
    console.log("From: " + from);
    console.log("To: " + to);

    var sender = from.split('@')[1].split('.').slice(0, -1).reverse().join(' ');
    console.log("Sender: "+sender);

    console.log(Object.keys(mail));

    if (!mail.attachments) {
        mail.attachments = [];
    }

    mail.attachments.forEach(function(att){
        var ext = att.contentType.split('/')[1];
        queue.push([sender, ext, content]);
    });

    if (mail.attachments.length == 0) {
        if (mail.html) {
            queue.push([sender, 'htm', mail.html]);
        } else {
            queue.push([sender, 'txt', mail.text]);
        }
    }
    
    startWork();
});

var running = false;
var startWork = function(){
    if (running) {
        return;
    } else {
        running = true;
        work();
    }
}

var work = function() {
    if (queue.length == 0) {
        running = false;
        return
    }

    var q = queue.pop();
    var name = q[0];
    var ext = q[1];
    var content = q[2];

    dropbox.upload(name, ext, content, function(){
        work();
    });
}
