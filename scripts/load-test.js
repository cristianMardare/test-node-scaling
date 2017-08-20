const { execFile } = require('child_process');

execFile('ab', ['-n 1000', '-c 20','http://localhost:8080/'], (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

