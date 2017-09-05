#!/usr/bin/env node
const { execFile } = require('child_process');
const argv = require('yargs')
  .options('url', {
    alias: 'url',
    describe: 'target URL'
  })
  .options('concurrency', {
    alias: 'c',
    describe: 'how many concurrent calls to be performed',
    default: 100,
    type: 'number'
  })
  .options('number', {
    alias: 'n',
    describe: 'total number of calls to be performed',
    default: 1000,
    type: 'number'
  })
  .demandOption(['url'], 'Please provide a url before running the script')
  .argv;

console.log(argv);

let args = [];
//Docs: https://httpd.apache.org/docs/2.4/programs/ab.html
args.push('-r');  // Don't exit on socket receive errors.

if (argv.concurrency)
  args.push(`-c ${argv.concurrency}`);

if(argv.number)
  args.push(`-n ${argv.number}`);

if(argv.url)
  args.push(argv.url);
else
  throw new Error('No url provided');

console.log(args);

execFile('ab', args, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.log(err);
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

