// MODULOS NECESARIOS
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
chai.use(chaiHttp);

// CREACION SUITE DE TEST Y TEST UNITARIO

describe('Probando API REST con Mocha - Chai', function () {
    it('Probando GET - La data debe contener una propiedad llamada deportes y esta debe ser un arreglo', function () {
        
        // USAR METODO CHAI CON REQUEST CON PARAMETRO SERVIDOR (server)
        chai
            .request(server)
            // METODO GET CON RUTA A TESTEAR
            .get('/deportes')
            // METODO END CON CALLBACK QUE CONTIENE ERROR Y DATA DE CONSULTA AL SERVIDOR
            .end(function (err,res) {

                // GUARDANDO EN VARIABLE LA DATA DE RESPUESTA EN SU PROPIEDAD "text" CON EL JSON.parse()
                let data = JSON.parse(res.text);

                // METODO EXPECT PARA CORROBORAR PROPIEDAD DEPORTES EN DATA
                chai.expect(data).to.have.property('deportes');

                // METODO EXPECT PARA CORROBORAR QUE LA PROPIEDAD DEPORTES SEA UN STRING
                chai.expect(data.deportes).to.be.an('array');
            });
    });
});