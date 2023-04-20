import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { UserStatus } from '@/types/user';

export interface UserReserveRequest {
  userId?: string,
  username: string,
  email: string,
  birthDate: Date
}

export interface UserReserveResponse {
  userId: string
}

export default async function handler(req : NextApiRequest, res : NextApiResponse<UserReserveResponse>) {
  const { userId, username, email, birthDate } = req.body as UserReserveRequest

  //If userId is already filled, update record instead
  if(userId && userId.length > 0) {
    const userUpdate = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: username,
        email: email,
        birth_date: birthDate,
        status: UserStatus.Reserved
      },
      select: {
        id: true
      }
    })
    res.status(200).json({ userId: userUpdate.id })
    return
  }

  //If New User...
  //Check if email is already in use
  const emailInUse = await prisma.user.count({
    where: {
      email: email
    }
  })
  if(emailInUse > 0){
    res.status(400).json({userId: ''})
    return
  }

  //Create a new user with status of "reserved"
  //TODO: Should we add an expiry date on reserved users?
  const user = await prisma.user.create({
    data: {
      name: username,
      email: email,
      birth_date: birthDate,
      status: UserStatus.Reserved
    },
    select: {
      id: true
    }
  })
  res.status(200).json({ userId: user.id })
}