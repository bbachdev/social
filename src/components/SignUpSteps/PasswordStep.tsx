import { SignUpData } from '@/types/user'
import { useEffect, useState } from 'react'
import TwoFactorQR from '../Auth/TwoFactorQR'
import Spinner from '../Spinner';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';

enum TwoFactorMethod {
  AuthApp = 'app',
  Email = 'email',
  SMS = 'sms'
}

export default function PasswordStep({ onNextStep, onPreviousStep, existingUserData } : { onNextStep: (data: SignUpData) => void, onPreviousStep: () => void, existingUserData: SignUpData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState(existingUserData.password)
  const [passwordConfirmation, setPasswordConfirmation] = useState(existingUserData.password)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)
  const [twoFactorInfo, setTwoFactorInfo] = useState<{secret: string, issuer: string, accountName: string, userId: string}>({secret: '', issuer: '', accountName: '', userId: '1'})
  const [twoFactorMethod, setTwoFactorMethod] = useState<TwoFactorMethod | null>(null)

  useEffect(() => {
    if(password.length > 0 && password === passwordConfirmation && twoFactorMethod) {
      setButtonDisabled(false)
    }else{
      setButtonDisabled(true)
    }
  }, [password, passwordConfirmation, twoFactorMethod])

  function submit() {
    console.log('submit')
  }

  function goBack() {
    onPreviousStep()
  }

  //2FA Functions
  async function twoFactorSelected(method : string) {
    setIsLoading(true)
    switch(method) {
      case 'app':
        const twoFactorProps = await fetch('/api/users/setupTwoFactor', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: existingUserData.userId || '1',
            username: existingUserData.username || 'test',
            method: TwoFactorMethod.AuthApp
          })
        }).then(res => res.json())

        if(twoFactorProps.error) {
          console.log(twoFactorProps.error)
          setIsLoading(false)
          return
        }
        setTwoFactorInfo(twoFactorProps)
        console.log(twoFactorProps.secret)
        setIsLoading(false)
        setShowTwoFactorModal(true)
        console.log('app')
        break
      case 'email':
        console.log('email')
        break
      case 'sms':
        console.log('sms')
        break
    }
  }

  function confirmVerify(method : string) {
    switch (method) {
      case TwoFactorMethod.AuthApp:
        setTwoFactorMethod(TwoFactorMethod.AuthApp)
        setShowTwoFactorModal(false)
        break
      case TwoFactorMethod.Email:
        setTwoFactorMethod(TwoFactorMethod.Email)
        setShowTwoFactorModal(false)
        break
      case TwoFactorMethod.SMS:
        setTwoFactorMethod(TwoFactorMethod.SMS)
        setShowTwoFactorModal(false)
        break
    }
  }

  return (
    <div className={'flex flex-col space-y-8'}>
      {isLoading && 
        <div className={'fixed inset-0 z-20 overflow-y-auto'}>
          <div className={'flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'}>
          <Spinner/>
          </div>
        </div>
      }
      {(showTwoFactorModal || isLoading) && (
        <div className={'fixed inset-0 z-10 overflow-y-auto'}>
          <div className={'flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'}>
            <div className={'fixed inset-0 transition-opacity'} aria-hidden="true">
              <div className={'absolute inset-0 bg-gray-500 opacity-75'}>
              </div>
            </div>
          </div>
        </div>
      )}
      {showTwoFactorModal && (
        <div className={'bg-white z-20 absolute top-1/6 left-2 right-2 flex justify-center items-center rounded-lg'}>
          <TwoFactorQR secret={twoFactorInfo.secret} issuer={twoFactorInfo.issuer} accountName={twoFactorInfo.accountName} userId={twoFactorInfo.userId} onVerified={() => confirmVerify(TwoFactorMethod.AuthApp)} onCancel={() => setShowTwoFactorModal(false)}/>
        </div>
      )}
      <div className={'flex flex-col'}>
        <span>Password</span>
        <input className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
        <span className={'text-sm text-gray-400 font-b'}>Passwords must contain:</span>
        <ul className={'text-sm text-gray-400'}>
          <li>- At least 12 characters</li>
          <li>- At least 1 number</li>
          <li>- At least 1 special character</li>
        </ul>
        <div className={'flex flex-col mt-2'}>
          <span>Confirm Password</span>
          <input className={'p-2 rounded-md border-2 border-gray-300 bg-gray-100'} type={'password'} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
        </div>
      </div>

      <hr/>
      {/* TODO: Should this be a separate page? */}
      <div className={'flex flex-col'}>
        <span>{`Two-Factor Authentication (2FA)`}</span>
        <span className={'text-sm text-gray-400 mb-2'}>{`Security is important to us, so we require all users to also secure their account with one of several two-factor methods. Please choose an option below.`}</span>

        {/* TODO: Perhaps experiment with icons on the left of each box, representing the 2FA method? */}
        <ul className={'grid w-full gap-4 md:grid-cols-2 mt-2'}>
          {/* Auth App */}
          <li>
            <input type="radio" name={'2fa'} id={'2fa-app'} value="2fa-app" className={'hidden peer'} required/>
            <label htmlFor='hosting-small' onClick={() => twoFactorSelected('app')} className={'inline-flex items-center justify-between w-full p-5 px-3 rounded-lg cursor-pointer border border-gray-300'}>
              { twoFactorMethod === TwoFactorMethod.AuthApp && 
                <CheckCircleIcon className={'text-brand-green-400'} fontSize='large'/>
              }
              { twoFactorMethod !== TwoFactorMethod.AuthApp &&
                <SmartphoneIcon className={'text-gray-600'} fontSize='large'/>
              }
              
              <div className={'block ml-4'}>
                  <div className={'w-full text-lg font-semibold leading-5'}>Authenticator  App</div>
                  <span className={'text-sm text-gray-400 italic'}>(Recommended)</span>
                  <div className={'w-full text-sm text-gray-600 font-b'}>Use an authenticator app on your phone to generate a code when you log in.</div>
              </div>
            </label>
          </li>

          {/* Email */}
          <li>
            <input type="radio" name={'2fa'} id={'2fa-email'} value="2fa-email" className={'hidden peer'} required/>
            <label htmlFor='hosting-small' onClick={() => twoFactorSelected('email')} className={'inline-flex items-center justify-between w-full p-5 px-3 rounded-lg cursor-pointer border border-gray-300'}>
                { twoFactorMethod === TwoFactorMethod.Email && 
                  <CheckCircleIcon className={'text-brand-green-400'} fontSize='large'/>
                }
                
                { twoFactorMethod !== TwoFactorMethod.Email && 
                  <EmailIcon className={'text-gray-600'} fontSize='large'/>
                }
              <div className={'block ml-4'}>
                  <div className={'w-full text-lg font-semibold'}>Email</div>
                  <div className={'w-full text-sm text-gray-600 font-b'}>Get sent an email, containing a code allowing you to log in.</div>
              </div>
            </label>
          </li>

          {/* SMS */}
          <li>
            <input type="radio" name={'2fa'} id={'2fa-app'} value="2fa-app" className={'hidden peer'} required/>
            <label htmlFor='hosting-small' onClick={() => twoFactorSelected('sms')} className={'inline-flex items-center justify-between w-full p-5 px-3 rounded-lg cursor-pointer border border-gray-300'}>
              { twoFactorMethod === TwoFactorMethod.SMS && 
                <CheckCircleIcon className={'text-brand-green-400'} fontSize='large'/>
              }
              
              { twoFactorMethod !== TwoFactorMethod.SMS && 
                <SmsIcon className={'text-gray-600'} fontSize='large'/>
              }
              <div className={'block ml-4'}>
                  <div className={'w-full text-lg font-semibold leading-5'}>SMS/Text Message</div>
                  <span className={'text-sm text-gray-400 italic'}>(Not Recommended)</span>
                  <div className={'w-full text-sm text-gray-600 font-b'}>{`Get sent a text message, containing a code allowing you to log in.`}</div>
              </div>
            </label>
          </li>


        </ul>
      </div>

      <div className={'flex flex-row ml-auto space-x-4 rounded-md'}>
        <button className={'bg-white hover:bg-gray-100 border-2 border-gray-300 p-2 rounded-md px-6'} onClick={goBack}>{`Back`}</button>
        <button className={'bg-brand-green-400 hover:bg-brand-green-500 disabled:bg-gray-400 text-white p-2 rounded-md px-6'} disabled={buttonDisabled} onClick={submit}>
          {`Next`}
        </button>
      </div>
    </div>
  )
}
