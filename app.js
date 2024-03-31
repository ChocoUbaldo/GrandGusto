import express from 'express';
import { fileURLToPath } from 'url';
import json from 'body-parser';
import path from 'path';
import misRutas from './router/index.js';

const puerto = 80;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main = express();

main.set("view engine", "ejs");
main.use(express.static(path.join(__dirname, 'static')));
main.use(json.urlencoded({ extended: true }));
main.use(misRutas); // Cambiado de misRutas.router a misRutas

main.listen(puerto, () => {
    console.log("Se inició el servidor en el puerto: http://localhost:" + puerto);
});
