import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Spinner from '../Spinner';

interface OTPVerifyProps {
  userId: string
  isEmail: boolean
  onCancel: () => void
  onVerified: () => void
  initialSetup?: boolean
}

export default function OTPVerify({userId, isEmail, onCancel, onVerified, initialSetup } : OTPVerifyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  async function verify(){
    setIsLoading(true)
    console.log("Starting verification...")
    const verifyResponse = await fetch('/api/auth/verifyTwoFactor',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId || '1',
        code: code,
        initialSetup: initialSetup || false
      })
    }).then(res => res.json())

    if(verifyResponse) {
      console.log("Verified!")
    }else{
      console.log("Not verified")
    }
    setIsLoading(false)
    onVerified()
  }

  function closeModal(){
    onCancel()
  }
  
  return (
    <div className={'flex flex-col items-center'}>
      <div onClick={closeModal}>
        <CloseIcon className={'absolute top-4 right-4 cursor-pointer'}/>
      </div>
      <span className={'mt-8 text-3xl font-thin mx-auto mb-4'}>
        {isEmail ? `Verify Email` : `Verify SMS`}
      </span>
      <span className={'px-8 text-center mx-auto text-gray-600'}>
        {isEmail ? `We've sent a verification code to your email address. Enter the code below to verify your email address.` : `We've sent a verification code to your phone number. Enter the code below to verify your phone number.`}
      </span>
      <div className={'flex flex-col items-center mt-8'}>
        {isLoading && <Spinner/>}
        <input className={'border-2 border-gray-300 bg-gray-100 rounded-md px-4 py-2 mt-4 w-1/2 mx-auto'} type="text" maxLength={6} onChange={(e) => setCode(e.target.value)}/>
        <button className={'bg-brand-green-400 hover:bg-brand-green-500 disabled:bg-gray-400 text-white p-2 rounded-md px-6 mt-5 mb-8'} onClick={verify}>
          {`Verify`}
        </button>
      </div>
    </div>
  )
}
