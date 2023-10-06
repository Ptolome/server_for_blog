import jwt from 'jsonwebtoken'

import UserModel from '../models/User.js';
import bcrypt, { compare } from 'bcrypt'

export const register =  async (req, res)=>{
    try {
        // создаем переменную с открытым паролем(берем из запроса)
        console.log(req.body)
        const password = req.body.password;
        // создаем алгоритм шифрования
        const salt = await bcrypt.genSalt(10);
        // шифруем наш пароль
        const hash= await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName:req.body.fullName,
            avatarUrl:req.body.avatarUrl,
            passwordHash:hash,

        })
        console.log('userControler')
        // создаем нашего пользователя в базе монгодб т.е. просто сохраняем наш документ в бд
        const user = await doc.save();
        
        
        // создаем токен

        const token = jwt.sign(
            {
                _id:user._id
            },
            "secret123",
            {
                expiresIn:'30d'
            },
        );

        const {passwordHash, ...userData} = user._doc
        res.json({
            
            ...userData,
            token,
        
    });
    } catch(err) {
        console.log("Auth mistace ", err)
        res.status(500).json({
            message: "не удалось зарегистрироваться",
        })

    }
    
}

export const login=async (req,res)=>{
    console.log(req.body.email)
    try {
        const user = await UserModel.findOne({email: req.body.email})
        console.log('user',user)
        if (!user) {
            return res.status(404).json({
                message:'пользователь не найден!111'
            })
        }
        const isValidPass= await bcrypt.compare(req.body.password, user._doc.passwordHash)
        console.log(user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(404).json({
                message: "Логин или пароль не верные"
            })
        }
        // создаем токен

        const token = jwt.sign(
            {
                _id:user._id
            },
            "secret123",
            {
                expiresIn:'30d'
            },
        );
        
        const {passwordHash, ...userData} = user._doc
        res.json({
            
            ...userData,
            token,
        })
    } catch (err) {
    console.log(err)
    res.status(500).json({
        message: 'Не удалось авторизоваться'
    })

    }
}
export const getMe=async (req,res)=>{
    try {
        const user = await UserModel.findById(req.userId)

        if (!user){
            return res.status(404).json({
                message:'Пользоватедь не найден!'
            })
        }
        const {passwordHash, ...userData} = user._doc
        res.json(userData);

    } catch(err) {
        console.log("Auth mistace ", err)
        res.status(500).json({
            message: "Нет доступа",
        })
    }
}