import CheckIcon from '@mui/icons-material/Check';
import LoopIcon from '@mui/icons-material/Loop';
import CloseIcon from '@mui/icons-material/Close';

import { useEffect, useState } from 'react';
import { isLeapYear } from '@/utils/DateTimeUtils';
import { UserReserveResponse } from '@/pages/api/users/reserveUser';
import { SignUpData } from '@/types/user';
import Spinner from '../Spinner';

enum UsernameState {
  Available,
  Taken,
  Checking,
  None
}

interface UsernameAvailableResponse {
  available: boolean
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UsernameStep({ onNextStep, existingUserData } : { onNextStep: (data: {userId: string, username: string, email: string, birthDate: Date}) => void, existingUserData: SignUpData }) {
  const [isLoading, setIsLoading] = useState(false);

  //Form Info
  const [userId, setUserId] = useState(existingUserData.userId)
  const [username, setUsername] = useState(existingUserData.username)
  const [usernameState, setUsernameState] = useState((userId && userId.length > 0) ? UsernameState.Available : UsernameState.None)
  const [email, setEmail] = useState(existingUserData.email)
  const [dayList, setDayList] = useState(Array.from({ length: 31 }, (_, index) => index + 1))
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const [birthMonth, setBirthMonth] = useState((existingUserData.birthDate) ? months[existingUserData.birthDate.getMonth()] : months[0])
  const [birthYear, setBirthYear] = useState((existingUserData.birthDate) ? existingUserData.birthDate.getFullYear() : new Date().getFullYear())
  const [birthDay, setBirthDay] = useState((existingUserData.birthDate) ? dayList[existingUserData.birthDate.getDate() - 1] : dayList[0])

  //Adjust days in month based on month (and leap year, if applicable)
  useEffect(() => {
    if(birthMonth === 'February' && isLeapYear(birthYear)) {
      setDayList(Array.from({ length: 29 }, (_, index) => index + 1))
    }else if(birthMonth === 'February') {
      setDayList(Array.from({ length: 28 }, (_, index) => index + 1))
    }else if(['April', 'June', 'September', 'November'].includes(birthMonth)) {
      setDayList(Array.from({ length: 30 }, (_, index) => index + 1))
    }else{
      setDayList(Array.from({ length: 31 }, (_, index) => index + 1))
    }
  
  }, [birthMonth, birthYear])

  //Button-related
  const [buttonDisabled, setButtonDisabled] = useState(true)
  
  useEffect(() => {
    if(usernameState === UsernameState.Available && email.length > 0) {
      setButtonDisabled(false)
    }else{
      setButtonDisabled(true)
    }
  }, [usernameState, email])

  //DB-Related Functions
  async function checkUsername() {
    if(username.length > 0) {
      setUsernameState(UsernameState.Checking)
      const userNameAvailable : UsernameAvailableResponse = await (await fetch(`/api/users/checkUsername?username=${username}&userId=${userId}`)).json()
      if(userNameAvailable.available) {
        setUsernameState(UsernameState.Available)
      }else{
        setUsernameState(UsernameState.Taken)
      }
    }else{
      setUsernameState(UsernameState.None)
    } 
  }

  async function submit() {
    //Validate data
    if(username.length === 0) {
      //Show error
      console.log('Username is required')
      return
    }
    if(!emailRegex.test(email)) {
      //Show error
      console.log('Email is invalid')
      return
    }
    //Check birth date, and make sure it's not in the future
    const birthDate = new Date(birthYear, months.indexOf(birthMonth), birthDay)
    if(birthDate > new Date()) {
      //Show error for future date
      console.log('Birth date cannot be in the future')
      return
    }
    const diffInMs = new Date().getTime() - birthDate.getTime();
    const ageDate = new Date(diffInMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if(age < parseInt(process!.env!.AGE_THRESHOLD!)) {
      //Show error for too young
      console.log('You must be at least 13 years old to use this service')
      //TODO Perhaps modal?
      return
    }

    //Call checkUsername to make sure the username is available (avoids abusing disabled state of button)
    //TODO: Check if we need to call this; blur event might already be doing this (if it runs before submit)
    await checkUsername()
    if(usernameState === UsernameState.Available) {
      //Reserve preliminary information in database (TODO) and direct to next step
      const response = await fetch('/api/users/reserveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          username,
          email,
          birthDate
        })
      })

      if(response.ok) {
        const reserveData : UserReserveResponse = await response.json()
        //TODO: Store user ID in local storage or something similar? (In case of window closing, etc.)
        setUserId(reserveData.userId)
        const updatedData = { userId: reserveData.userId, username: username, email: email, birthDate: birthDate };
        onNextStep(updatedData)
      }else{
        //TODO: Depending on error, show error message
        if(response.status === 400) {
          //Email already in use
          console.log('Email already in use')

        }else if(response.status === 500) {
          //Internal server error
          console.log('Internal Error')
        }
      }
    }
  }

  return (
    <div className={'flex flex-col space-y-8'}>
      {isLoading && <Spinner/>}
      <div className={'flex flex-col'}>
        <span>Username</span>
        <div className={'flex flex-row relative items-center'}>
          <input className={'p-2 pr-12 grow rounded-md border-2 border-gray-300 bg-gray-100'} onBlur={checkUsername} onChange={(e) => setUsername(e.target.value)} maxLength={50} value={username}/>
          {/* Username check icons */}
          {usernameState === UsernameState.Available && <CheckIcon className={'absolute right-2'} /> }
          {usernameState === UsernameState.Taken && <CloseIcon className={'absolute right-2'} /> }
          {usernameState === UsernameState.Checking && <LoopIcon className={'absolute right-2 animate-spin rotate-180 rotate'} /> }
        </div>
      </div>
      
      <div className={'flex flex-col'}>
        <span>Email</span>
        <input className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} type='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
      </div>
      
      <div className={'flex flex-col'}>
        <span>Date of Birth</span>
        <span className={'text-sm text-gray-400 leading-none mb-2'}>{`Your Date of Birth will not be shown publicly without permission. For business or "non-human" accounts, enter the Date of Birth of the primary account operator.`}</span>
        <div className={'flex flex-row space-x-2'}>
          <select className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} onChange={(e) => setBirthMonth(e.target.value)} value={birthMonth}>
            {months.map((month) => {
              return <option key={month} value={month}>{month}</option>
            })}
          </select>
          {/* Upon month being selected, modify day list */}
          <select className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} onChange={(e) => setBirthDay(parseInt(e.target.value))} value={birthDay}>
            {dayList.map((day) => {
              return <option key={day} value={day}>{day}</option>
            })}
          </select>
          <select className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} onChange={(e) => setBirthYear(parseInt(e.target.value))} value={birthYear}>
            {Array.from({ length: 120 }, (_, index) => new Date().getFullYear() - index).map((year, idx) => {
              return <option key={year} value={year}>{year}</option>
            })}
          </select>
        </div>
      </div>
      <div className={'flex flex-row mt-4'}>
        <div className={'mx-auto flex flex-row'}>
          {/* TODO: Add progress bar/dots */}
          
        </div>

        <button className={' ml-auto bg-brand-green-400 hover:bg-brand-green-500 disabled:bg-gray-400 text-white p-2 rounded-md px-6'} disabled={buttonDisabled} onClick={submit}>
          {`Next`}
        </button>
      </div>
    </div>
  )
}