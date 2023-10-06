import  jwt from "jsonwebtoken";

export default (req,res,next)=>{
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    console.log(token)
    if (token){
        try {
            const decoded = jwt.verify(token,'secret123')
            // res.json({
            //     message: 
            // })
            req.userId=decoded._id
            next()
        } catch(err){
            return res.status(402).json({
                message: 'Доступ закрыт!'
            })
        }

    } else {
        return res.status(403).json({
            message: 'Нет доступа!'
        })
    }
//    res.send(token)
    // 
}