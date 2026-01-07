try {
    const pdfMain = require('pdf-parse');
    console.log('Main require type:', typeof pdfMain);
} catch (e) { console.log('Main require error:', e.message); }

try {
    const pdfIndex = require('pdf-parse/index');
    console.log('Index require type:', typeof pdfIndex);
    console.log('Index value:', pdfIndex);
} catch (e) { console.log('Index require error:', e.message); }

try {
    // Try to find the function in the object
    const pdf = require('pdf-parse');
    if (typeof pdf === 'object') {
        console.log('Searching for function in export...');
        for (const k of Object.keys(pdf)) {
            if (typeof pdf[k] === 'function') {
                console.log(`Key ${k} is a function`);
            }
        }
    }
} catch (e) { }
