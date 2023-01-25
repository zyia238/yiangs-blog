// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from '@/utils/database.util'
import { readFile } from 'fs/promises'
import type { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'path'
const ObjectId = require('mongodb').ObjectId;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try{
    const client = await connectToDatabase()
    const db = client.db()

    db.collection('blogs').findOne({_id:ObjectId(req.body._id)},function (err, result) {
      if (err) {
          console.error('error end: ' + err.stack);
          return;
      }
      res.status(200).json({msg:'blog found', result})

  })

  }catch(error){
    res.status(500).json({msg:'cannot connect to the database'})
  }
}
