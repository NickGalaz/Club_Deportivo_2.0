// MODULOS NECESARIOS
const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 3000;

// CREACION SERVIDOR
const server = http
    .createServer((req, res) => {

        // RUTA DE HTML
        if (req.url == ('/')) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            fs.readFile('index.html', 'utf8', (err, html) => {
                res.end(html);
            })
        }

        // ARRAY CON DATOS DE JSON
        let deportesJSON = JSON.parse(fs.readFileSync('./archivos/deportes.json', 'utf8'));
        let deportes = deportesJSON.deportes;

        // RUTA PARA MOSTAR DATOS DE JSON
        if (req.url.startsWith('/deportes') && req.method == 'GET') {
            res.end(JSON.stringify(deportesJSON));
        }

        // AGREGANDO NUEVOS DATOS EN JSON
        else if (req.url.startsWith('/agregar') && req.method == 'POST') {

            let body;

            req.on('data', (payload) => {
                body = JSON.parse(payload);
            })

            req.on('end', () => {
                deporte = {
                    nombre: body.nombre,
                    precio: body.precio
                };

                deportes.push(deporte);

                if (body.nombre == '' || body.precio == '') {
                    console.log('Error: Ambos campos deben ser completados.')
                }
                else {
                    fs.writeFileSync('./archivos/deportes.json', JSON.stringify(deportesJSON));
                    res.writeHead(201).end('Deporte creado exitosamente!');
                }
            })
        }


        // EDITANDO DATOS EN JSON
        else if (req.url.startsWith('/editar') && req.method == 'PUT') {

            let body;

            req.on('data', (payload) => {
                body = JSON.parse(payload);
            });

            req.on('end', () => {
                deportesJSON.deportes = deportes.map((d) => {
                    if (d.nombre == body.nombre) {
                        return body;
                    }
                    else {
                        return d;
                    }
                });

                if (body.nombre == '' || body.precio == '') {
                    console.log('Error!! Ambos campos deben ser completados!!')
                }
                else {
                    fs.writeFileSync('./archivos/deportes.json', JSON.stringify(deportesJSON));
                    res.writeHead(201).end('Deporte actualizado!');
                }
            })
        }

        // BORRANDO DATOS DE JSON
        else if (req.url.startsWith('/eliminar') && req.method == 'DELETE') {

            // QUERY STRING DESDE LA URL (similar a cuando trabajaba con id)
            const { nombre } = url.parse(req.url, true).query;

            deportesJSON.deportes = deportes.filter((d) => d.nombre !== nombre);

            fs.writeFileSync('./archivos/deportes.json', JSON.stringify(deportesJSON));
            res.writeHead(200).end('Deporte eliminado exitosamente.');
        } 

    })
    .listen(port, () => console.log('Corriendo en puerto:', port))

module.exports = server;