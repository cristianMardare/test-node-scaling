module.exports.restart = function(cluster){
    if (!cluster)
        return;

    if (!cluster.isMaster)
        return;

    if (!cluster.workers)
        return;

    const workers = Object.values(cluster.workers);

    const restartWorker = (workerIndex) => {
        const worker = workers[workerIndex];
        if (!worker) return;
      
        worker.on('exit', () => {
          if (!worker.exitedAfterDisconnect) return;
          console.log(`Exited process ${worker.process.pid}`);
          
          cluster.fork().on('listening', () => {
            restartWorker(workerIndex + 1);
          });
        });
      
        worker.disconnect();
      };
      
    restartWorker(0);
}