//importamos las dependencias a utilizar
const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

// declaramos express en la variable app
const app = express()

//indicamos el uso de json y urlencoded para manejar los datos del request
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos el motor de plantillas
app.set('view engine', 'ejs')

//dejamos la carpeta publica como static (todo lo que puede ver el usuario)
app.use(express.static('public'))

//procesamos de variables de entorno
dotenv.config({path:'./env/.env'})

//uso de cookies
app.use(cookieParser())

//funcion de headers
app.use(function(req, res, next){
    if(!req.user)
    res.header('Cache-Control','private , no-cache, no-store, must-revalidate');
    next();
});

//llamar al router
app.use('/', require('./routes/router'))

//escuchamos el puerto 3000
app.listen(process.env.PORT || 3000,()=>{
    console.log('Servidor esta corriendo en http://localhost:3000')
})