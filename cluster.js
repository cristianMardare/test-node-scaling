#!/usr/bin/env node
const cluster = require('cluster');
const os = require('os');
const crash = require('./modules/crash-process');
const zeroDowntime = require('./modules/zero-downtime');

const argv = require('yargs')
.options('crash', {
  alias: 'x',
  boolean: true,
  describe: 'should the process(es) randomly crash at intervals'
})
.argv;

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i<cpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', handleWorkerExit);
  // trigger restart with: kill -SIGUSR2 pid
  process.on('SIGUSR2', () => { zeroDowntime.restart(cluster); });

  console.log(`Master is running as PID: ${process.pid}`);
} else {
  require('./server');
  argv.crash && crash({ interval: 10000, random: true });
}

function handleWorkerExit(worker, code, signal){
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.id} crashed. ` +
                  'Starting a new worker...');
      cluster.fork();
    }
  }

  