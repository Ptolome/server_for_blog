import { body } from "express-validator";


export const registerValidation = [
    body('email','неверный формат почты').isEmail(),
    body('password','пароль должен быть минимум 5 символов').isLength({min:5}),
    body('fullName').isLength({min:3}),
    body('avatarUrl',"Неверная ссылка на аватарку").optional().isURL(),

]
export const loginValidation = [
    body('email','неверный формат почты').isEmail(),
    body('password','пароль должен быть минимум 5 символов').isLength({min:5}),

]
export const postCreateValidation = [
    body('title','Введите заголовок статьи').isLength({min:3}).isString(),
    body('text','Введите текст статьи').isLength({min:10}).isString(),
    body('tags','неверный формат тегов (укажите массив)').optional().isString(),
    body('imgUrl',"Неверная ссылка на изображение").optional().isURL(),

]