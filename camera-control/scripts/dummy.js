// Tell standard out that the dummy process is waiting for the
// caller's interrupt signal
console.log('Dummy process started. Waiting for SIGINT...');
process.on('SIGINT', () => {
    console.log('\nSIGINT received. Dummy process exiting...');
    process.exit(0);
});

// Keep the process alive indefinitely
setInterval(() => {}, 1000);
