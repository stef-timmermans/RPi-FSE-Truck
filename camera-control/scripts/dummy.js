// Tell standard out that the dummy process is waiting for the
// caller's interrupt signal
console.log('Dummy process started. Waiting for SIGINT...');

// Keep the process alive indefinitely
setInterval(() => {}, 1000);
