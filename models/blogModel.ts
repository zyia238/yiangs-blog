import mongoose , { models , model } from "mongoose";

const BlogSchema = new mongoose.Schema({
    content:{
        type:String,
        required:[true,'must have content']
    },
    
})

const Blog = models.blog || model('blog',BlogSchema)

export default Blog