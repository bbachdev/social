import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type Data = {
  available: boolean
}

export default async function handler(req : NextApiRequest, res : NextApiResponse<Data>) {
  const { username } = req.query
  if (typeof username === 'string' || username instanceof String){
    const usernameString = username as string
    try{
      const matchedUser = await prisma.user.count({
        where: {
          name: usernameString
        }
      })
      if(matchedUser > 0){
        res.status(200).json({available: false})
      }else{
        res.status(200).json({available: true})
      }
    }
    catch(err){
      console.log(err)
      res.status(500).json({available: false})
    }
  }else{
    res.status(404).json({available: false})
  }
}