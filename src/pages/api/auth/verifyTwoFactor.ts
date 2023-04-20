import prisma from '@/lib/prisma';
import { TwoFactorStatus } from '@/types/user';
import { NextApiRequest, NextApiResponse } from "next";

const speakeasy = require('speakeasy')

type Verify2FARequest = {
  userId: string
  code: string
  initialSetup?: boolean
}

export default async function handler(req : NextApiRequest, res : NextApiResponse<Boolean>) {
  const { code, userId, initialSetup } = req.body as Verify2FARequest
  try{
    //Retrieve user secret
    const matchedUser = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        twoFactorSecret: true,
      }
    })
    if(!matchedUser){
      res.status(500).json(false)
      return
    }

    //Compare code to secret
    const verified = speakeasy.totp.verify({
      secret: matchedUser.twoFactorSecret,
      encoding: 'base32',
      token: code
    })

    if(verified){
      //Optionally, if this is the initial setup, update user status as well
      if(initialSetup){
        await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            twoFactorStatus: TwoFactorStatus.Verified
          }
        })
      }
      res.status(200).json(true)
      return
    }else{
      res.status(200).json(false)
      return
    }


  }catch(err){
    res.status(500).json(false)
  }
  res.status(200).json(false)
}