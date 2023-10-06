import mongoose from "mongoose";
const PostShema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        unique: true,

    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    tags:{
        type: Array,
        default: [],
    },
    // колличество просмотров
    viewsCount:{
        type: Number,
        defoult: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // реф это ссылка, т.е. создаем связь между таблицами
        ref:'User',
        required: true,
    },
    imageUrl:String,
},{
    timestamps:true,
});


export default mongoose.model('Post',PostShema)