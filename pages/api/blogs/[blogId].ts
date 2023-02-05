// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from '@/utils/database.util'
import Blog from '@/models/blogModel'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    await connectToDatabase()
    const blog = await Blog.findById(req.query.blogId)
    res.status(200).json({msg:'blog found', result:blog})
  }catch(error){
    res.status(500).json({msg:'cannot connect to the database'})
  }
}
