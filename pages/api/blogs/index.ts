// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from '@/utils/database.util'
import Blog from '@/models/blogModel'
import type { NextApiRequest, NextApiResponse } from 'next'
import {readFile} from 'fs/promises'
import { join } from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      try{
        if(!req.body.filename){
          return res.status(400).json({ msg: 'Must provide filename' })
        }
        const blogData = await readFile(join(process.cwd(),'blogs',req.body.filename))
        const blog = await Blog.create({
          content:blogData
        })
        res.status(200).json({ msg: 'Blog added' , blog })
      }catch(error){
        res.status(500).json({ msg: error || 'cannot connect to the database' })
      }
    }

    if (req.method === 'GET') {
      await connectToDatabase()
      const blogsData = await Blog.find().limit(5)
      res.status(200).json({ msg: 'find the blogs', result:blogsData })
    }

  } catch (error) {
    res.status(500).json({ msg: error || 'cannot connect to the database' })
  }
}
