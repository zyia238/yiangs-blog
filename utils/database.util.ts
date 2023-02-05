import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try{
        await mongoose.connect(`mongodb+srv://zyia238:${process.env.DATABASE_PASS}@cluster0.ttweoyg.mongodb.net/blogs?retryWrites=true&w=majority`)
    }catch(err){
        throw new Error('Can not connect to the database')
    }
}