const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conn = require('../database/db')
const {promisify} = require('util')

//metodo Registro
exports.registro = async (req, res)=>{
   try {
      const user = req.body.user;
      const correo = req.body.correo;
      const pass = req.body.pass;
      let passHash = await bcryptjs.hash(pass, 8)
      console.log(passHash)
      conn.query('INSERT INTO usuarios SET ? ',{usuario:user ,correo:correo, contraseña:passHash},(error , results)=>{
         if(error){console.log(error)}
         res.redirect('/dash')
      })
      } catch (error) {
         console.log(error)
   }
   
}

//metodo Login
exports.login = async (req, res)=>{
   try {
      //obtenemos los datos del dom.
      const user = req.body.user
      const pass = req.body.pass
      //comprobamos que no esten vacios.
      if(!user || !pass){
         // si estan vacios mostraremos una alerta indicando que estan vacios
         res.render('login',{
            alert:true,
            alertTitle:"Error",
            alertMenssage: "porfavor ingrese un usuario y contraseña",
            alertIcon:"info",
            showConfirmButton:true,
            timer: false,
            ruta: 'login'
         })
      }else{
         //si no estan vacios consultamos en la bd si los datos son validos, de no ser validos enviaremos un error
         conn.query('SELECT * FROM usuarios WHERE usuario = ? ',[user], async (error, results)=>{
            if( results.length == 0 || ! (await bcryptjs.compare(pass,results[0].contraseña))){
               res.render('login',{
                  alert:true,
                  alertTitle:"Error",
                  alertMenssage: "Contraseña Incorrecta >:v",
                  alertIcon:"info",
                  showConfirmButton:true,
                  timer: false,
                  ruta: 'login'
               })
            }else{
               //si los datos son validos entonces crearemos un token para el usuario con duracion de 7d.
               const id = results[0].id
               const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                  expiresIn: process.env.JWT_TIEMPO_EXPIRA
               })

               const cookiesOptions ={
                  expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES *24 *60 *1000),
                  httpOnly: true
               }
               // mandaremos una alerta de exito y ingresaremos al admin
               res.cookie('jwt', token, cookiesOptions)
               res.render('login',{
                  alert:true,
                  alertTitle:"Exito!",
                  alertMenssage: "Ingreso Exitoso!",
                  alertIcon:"success",
                  showConfirmButton:true,
                  timer: 800,
                  ruta: ''
               })
            }
         })
      }
   } catch (error) {
      console.log(error)
   }
}

//comprobamos si estamos autenticados
exports.isAuthenticated = async (req, res, next)=>{
   //para comprobar esto necesitamos acceder al jwt que se encuentra en las cookies
   if(req.cookies.jwt){
      try {
         //decodificamos la cookie para comprar los datos con la bd
         const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
         conn.query('SELECT * FROM usuarios WHERE id = ?',[decodificada.id], (error, results)=>{
            if(!results){return next()}
            req.user= results[0]
            return next()
         })
      } catch (error) {
         console.log(error)
         return next()
      }
   }else{
      //si los datos no son validos, los enviaremos a la pagina de login 
      res.redirect('/login')
   }
}
// para salir eliminaremos la cookie del sistema
exports.logout = (req, res) => {
   res.clearCookie('jwt')
   return res.redirect('/')
}