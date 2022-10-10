//importamos nuestros modulos a usar
const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

//ingreso a vista dash
router.get('/dash', authController.isAuthenticated, (req,res)=>{
    res.render('dash',{user:req.user})
})
//ingreso login
router.get('/login', (req,res)=>{
    res.render('login',{alert:false})
})
//ingreso registro
router.get('/registro', (req,res)=>{
    res.render('registro')
})

//rutas para ping
router.get('/ping',(req,res)=>{
   res.send('pong')
})
//ruta perfil
router.get('/perfil', authController.isAuthenticated, (req,res)=>{
    res.render('perfil',{user:req.user})
})

//router para los metodos post del authController
router.post('/registro', authController.registro)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.put('/actualizarUser', authController.putUser)
router.delete('/deleteUser', authController.delUser)


module.exports = router