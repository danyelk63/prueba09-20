var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const mysql = require('mysql');

// confuguracion del server
const config = {
    host: 'db4free.net',
    user: 'pruebatrabjojuli',
    password: 'pruebatrabjojuli',
    database: 'pruebatrabjojuli',
};

const pool = mysql.createPool(config);

module.exports = pool;

var router = express.Router();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Post para las compras realizadas.
 */
router.post('/datos', function (req, res) {

    var producto = 0, venta = 0;

    //toma la fecha
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    //Se envia los datos para la venta
    pool.query('INSERT INTO ventas (fecha) VALUES ("' + yyyy + '-' + mm + '-' + dd + '");', (err, result) => {
        venta = result.insertId;

        //Se envian los datos para los productos
        req.body.forEach(item => {
            pool.query('SELECT * FROM productos WHERE titulo = "' + item.producto.titulo + '";', (err, result) => {
                if (result[0] != undefined) {
                    producto = result[0].id
                    sendPedido(producto, venta, item)
                }
                else {
                    pool.query('INSERT INTO productos (titulo, imagen, descripcion, precio) VALUES ("' + item.producto.titulo + '", "' + item.producto.imagen + '", "' + item.producto.descripcion + '", ' + item.producto.precio + ' );', (err, result) => {
                        producto = result.insertId;
                        sendPedido(producto, venta, item)
                    })
                }
            });
        });
    });


    res.send("sljadkj");
});

app.use(router);

app.listen(process.env.PORT || 3000, function () {
    console.log("Node server running on http://localhost:3000");
});

/**
 * Se envian los datos para los pedidos
 */
function sendPedido(producto, venta, item) {
    pool.query('INSERT INTO pedidos (producto, venta, cantidad) VALUES (' + producto + ', ' + venta + ', ' + item.cantidad + ')', (err, result) => {
        console.log(err)
    });
}

function mierda() {


}