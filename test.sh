
exec 3<>/dev/tcp/localhost/2525

function readline {
    read -u 3 var
    echo $var
}

function writeline {
    echo '>' $*
    printf "$*\r\n" >&3
}


readline

writeline HELO mika
readline

writeline 'MAIL from: <sender@example.com>'
readline

writeline 'RCPT to: <drop@xod.se>'
readline

writeline DATA
readline

writeline To: drop@xod.se
writeline From: sender@example.com
writeline Subject: Test message
writeline 
writeline This is a test message.
writeline
writeline .
writeline

writeline QUIT
readline
