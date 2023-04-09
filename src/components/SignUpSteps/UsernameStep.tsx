import CheckIcon from '@mui/icons-material/Check';
import LoopIcon from '@mui/icons-material/Loop';
import CloseIcon from '@mui/icons-material/Close';

import { useEffect, useState } from 'react';
import { isLeapYear } from '@/utils/DateTimeUtils';

enum UsernameState {
  Available,
  Taken,
  Checking,
  None
}

interface UsernameAvailableResponse {
  available: boolean
}

export default function UsernameStep() {
  //Form Info
  const [username, setUsername] = useState('')
  const [usernameState, setUsernameState] = useState(UsernameState.None)
  const [email, setEmail] = useState('')
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const [birthMonth, setBirthMonth] = useState(months[0])
  const [dayList, setDayList] = useState(Array.from({ length: 31 }, (_, index) => index + 1))
  const [birthYear, setBirthYear] = useState(new Date().getFullYear())
  const [birthDay, setBirthDay] = useState(dayList[0])

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
  
  //Check if button should be disabled
  useEffect(() => {
    if(usernameState === UsernameState.Available && email.length > 0) {
      setButtonDisabled(false)
    }else{
      setButtonDisabled(true)
    }
  }, [usernameState, email])

  async function checkUsername() {
    if(username.length > 0) {
      setUsernameState(UsernameState.Checking)
      const userNameAvailable : UsernameAvailableResponse = await (await fetch(`/api/users/checkUsername?username=${username}`)).json()
      console.log('Available: '+ userNameAvailable.available)
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
    //Call checkUsername to make sure the username is available (avoids abusing disabled state of button)
    //TODO: Check if we need to call this; blur event might already be doing this (if it runs before submit)
    await checkUsername()
    if(usernameState === UsernameState.Available) {
      //Save information to database (TODO) and redirect to next step
      
    }
  }

  return (
    <div className={'shadow-md flex flex-col p-2 px-8 pb-4 bg-white'}>
      <span className={'text-xl font-thin mx-auto mb-8'}>
        {`Welcome! Let's Get Started.`}
      </span>
      <div className={'flex flex-col space-y-8'}>
        <div className={'flex flex-col'}>
          <span>Username</span>
          <div className={'flex flex-row relative items-center'}>
            <input className={'p-2 pr-12 grow rounded-md border-2 border-gray-300 bg-gray-100'} onBlur={checkUsername} onChange={(e) => setUsername(e.target.value)}/>
            {/* Username check icons */}
            {usernameState === UsernameState.Available && <CheckIcon className={'absolute right-2'} /> }
            {usernameState === UsernameState.Taken && <CloseIcon className={'absolute right-2'} /> }
            {usernameState === UsernameState.Checking && <LoopIcon className={'absolute right-2 animate-spin rotate-180 rotate'} /> }
          </div>
        </div>
        
        <div className={'flex flex-col'}>
          <span>Email</span>
          <input className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} type='email' onChange={(e) => setEmail(e.target.value)}/>
        </div>
        
        <div className={'flex flex-col'}>
          <span>Date of Birth</span>
          <span className={'text-sm text-gray-400 leading-none mb-2'}>{`Your Date of Birth will not be shown publicly without permission. For business or "non-human" accounts, enter the Date of Birth of the primary account operator.`}</span>
          <div className={'flex flex-row space-x-2'}>
            <select className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} onChange={(e) => setBirthMonth(e.target.value)}>
              {months.map((month) => {
                return <option key={month} value={month}>{month}</option>
              })}
            </select>
            {/* Upon month being selected, modify day list */}
            <select className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} onChange={(e) => setBirthDay(parseInt(e.target.value))}>
              {dayList.map((day) => {
                return <option key={day} value={day}>{day}</option>
              })}
            </select>
            <select className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} onChange={(e) => setBirthYear(parseInt(e.target.value))}>
              {Array.from({ length: 120 }, (_, index) => new Date().getFullYear() - index).map((year, idx) => {
                return <option key={year} value={year}>{year}</option>
              })}
            </select>
          </div>
        </div>
      </div>

      <div className={'flex flex-row mt-4'}>
        <button className={' ml-auto bg-brand-green-400 hover:bg-brand-green-500 disabled:bg-gray-400 text-white p-2 rounded-md px-4'} disabled={buttonDisabled} onClick={submit}>
          {`Next`}
        </button>
      </div>
    </div>
  )
}