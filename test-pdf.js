const fs = require('fs');
const pdfParse = require('pdf-parse');

async function test() {
  try {
    if (typeof globalThis.DOMMatrix === 'undefined') {
      globalThis.DOMMatrix = class DOMMatrix {};
    }
    const pdfData = await pdfParse(fs.readFileSync('test.pdf'));
    console.log("Success:", pdfData.text.substring(0, 100));
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
