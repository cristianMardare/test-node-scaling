module.exports = function(options) {
  options = options || {};

  const interval = Number.isInteger(options.interval) ? options.interval : 1000;
  const random = options.random === true;
  const errorCode = Number.isInteger(options.code) ? options.code : 1;

  scheduleCrash({interval, random, errorCode});
}

function scheduleCrash(options){

    const randomCoef = options.random ? Math.random() : 1;
    const timeout = randomCoef * options.interval;

    // simulate process crash
    setTimeout(() => {
      process.exit(options.errorCode) // death by random timeout
    }, timeout);
}

