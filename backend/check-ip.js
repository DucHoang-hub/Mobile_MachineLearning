const os = require('os');
const ni = os.networkInterfaces();
Object.keys(ni).forEach(n => {
    ni[n].forEach(i => {
        if (i.family === 'IPv4' && !i.internal) {
            console.log(`${n}: ${i.address}`);
        }
    });
});
