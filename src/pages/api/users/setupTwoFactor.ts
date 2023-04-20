import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { ISSUER_NAME } from '@/utils/OrgUtils';

//Import syntax has an error
// import { generateSecret } from 'speakeasy'

const speakeasy = require('speakeasy')
import { TwoFactorStatus } from '@/types/user';

export interface Setup2FARequest {
  userId: string,
  username: string,
  method : string
}

export interface Setup2FAResponse {
  secret: string
  issuer: string
  account: string,
  error?: string
}

export default async function handler(req : NextApiRequest, res : NextApiResponse<Setup2FAResponse>) {
  const { userId, username, method } = req.body as Setup2FARequest

  //If, for some reason, userId is not filled, return error
  if(!userId || userId.length === 0) {
    res.status(400).json({ secret: '', issuer: '', account: '', error: 'Valid User ID is required' })
    return
  }

  //TODO: Check if user is already setup with 2FA with the same method
  const matchedUser = await prisma.user.findFirst({
    where: {
      id: userId,
      twoFactorStatus: TwoFactorStatus.Verified,
      twoFactorMethod: method
    },
    select: {
      id: true
    }
  })
  if(matchedUser){
    //User has already set this method up
    res.status(204)
    return
  }

  //Else, generate a new secret for the user
  const secret = speakeasy.generateSecret()

  try {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorMethod: method,
        twoFactorStatus: TwoFactorStatus.Setup
      }
    })
    res.status(200).json({ account: username, secret: secret.base32, issuer: ISSUER_NAME})
    return
  }catch(e){
    res.status(500).json({ account: '', secret: '', issuer: '', error: 'An error occurred' })
  }
}