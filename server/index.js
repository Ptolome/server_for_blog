import express from 'express'
import multer from 'multer';

import mongoose from 'mongoose';
import { loginValidation, postCreateValidation, registerValidation } from './validations/validations.js';

import {UserController, PostController} from './controllers/index.js'

import {checkAuth,handleValidationErrors} from './utils/index.js';
import cors from 'cors'

mongoose.connect("mongodb+srv://admin:Admin1234@cluster0.ffok2ff.mongodb.net/blog")
        .then(()=>console.log('Подключение к базе OK'))
        .catch((err)=>("Произошла ошибка: ",err))

const app = express();


const storage= multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads/')
    }, 
    filename:(req, file, cb)=>{
        cb(null, file.originalname)
        
    }
})

const upload = multer({ storage })

// чтобы библиотека экспрес понимала джйсон формат,это и есть мидлваре
app.use(express.json());
// перенаправит на нужный порт
app.use(cors())
// если придет запрос на uploads то будем искать статичные файлы в этой папке
app.use('/uploads', express.static('uploads'))


// app.get('/', (req,res)=>{
//     res.send('я получил запрос get по адресу "/" и возвращаю овет');
    // loginValidation,
// });
// sozdaem routs dlia avtorizacii
app.post('/login',loginValidation,handleValidationErrors,UserController.login)
app.post('/register',registerValidation,handleValidationErrors, UserController.register)
app.get('/login/me',checkAuth, UserController.getMe )

app.get('/tags', PostController.getLastTags )
// создаем роуты для постов
app.get('/posts', PostController.getAll )
app.get('/posts/tags', PostController.getLastTags )
app.get('/posts/:id', PostController.getOne )
app.post('/posts',checkAuth, postCreateValidation,handleValidationErrors, PostController.create )
app.delete('/posts/:id',checkAuth, PostController.remove )
app.patch('/posts/:id',checkAuth, PostController.update )

app.post('/upload',checkAuth, upload.single('image'), (res, req)=>{
      try {
        console.log(req.file.originalname)
     return res.json({req:req.file.originalname})
       
    } catch (err) {
        res.json({
            message: 'error for load:'+err,
        })
        console.log('oshibka')
    }
    }
)

app.listen(4444, (err)=>{
    if (err) {
        return console.log('получили ошибку ', err)
    }
    console.log( 'Сервер работает нормально')
})