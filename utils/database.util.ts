import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
    const client = await MongoClient.connect('mongodb+srv://zyia238:FTJ0DFCSq3XjgM0W@cluster0.ttweoyg.mongodb.net/blogs?retryWrites=true&w=majority')
    return client
}