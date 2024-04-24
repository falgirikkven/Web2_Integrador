const fs = require("node:fs/promises");
const fileName = "./sales.db.json";
const file = require(fileName);

// file es un arreglo, por lo tanto, si se pierde se puede crear uno
// desde cero escribiendo un nuevo json como "[]" (sin comillas)

async function writeData(data) {
    try {
        file.push(data);
        let prom = fs.writeFile(fileName, JSON.stringify(file));
        return prom;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { writeData };
