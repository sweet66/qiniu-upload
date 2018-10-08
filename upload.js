#! /usr/bin/env node

var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var argv = require('yargs').argv;
var os = require('os');

var binPath = `${__dirname}/CMD/qshell-${os.platform()}-${os.arch()}`;
var accountConfigPath = argv.config;
var env = argv.env;
var dist = path.resolve(argv.src);

var config = JSON.parse(fs.readFileSync(accountConfigPath, 'utf8'));
var account = config[env];


function deploy() {
    exec(`${binPath} account ${account.ak} ${account.sk}`, function(err) {
        if (err) {
            console.error('qrshell account error: ' + err.toString());
        } else {
            console.log('qrshell account success');
            exec(`${binPath} qupload2 -rescan-local=true -overwrite=true -check-exists=true -src-dir=${dist} -bucket=${account.bucket} -key-prefix=${account.prefix}`, function(err, stdout) {
                console.log(stdout);
                if (err) {
                    console.error('qrshell qupload2 error: ' + err.toString());
                } else {
                    console.log('qrshell qupload2 success');
                }
            });
        }
    });
}

deploy();
