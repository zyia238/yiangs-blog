// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from '@/utils/database.util'
import { readFile } from 'fs/promises'
import type { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    const client = await connectToDatabase()
    const db = client.db()
    // const filePath = join(process.cwd(),'blogs','Next.md')
    // const fileData = await readFile(filePath,'utf-8')
    // const data = await db.collection('blogs').find({content:fileData})
    db.collection('blogs').find({}).limit(5).toArray((err, result) => {
      if (err) throw err;
      res.status(200).json({msg:'find the blogs',result})
    });
  }catch(error){
    res.status(500).json({msg:'cannot connect to the database'})
  }
}
