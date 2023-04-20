import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import { useState } from 'react';
import UsernameStep from './SignUpSteps/UsernameStep';
import PasswordStep from './SignUpSteps/PasswordStep';
import { SignUpData, TwoFactorStatus } from '@/types/user';

enum SignUpStep {
  Username,
  Password,
  Profile
}

//User form data
export default function SignUpModule() {
  const [userData, setUserData] = useState<SignUpData>({ userId: '', username: '', email: '', birthDate: new Date(new Date().getFullYear(), 0, 1), password: '', twoFactorSecret: '', twoFactorStatus: TwoFactorStatus.NotSetup})
  const [step, setStep] = useState(SignUpStep.Password)

  function saveUsernameScreen(data: {userId: string, username: string, email: string, birthDate: Date}) {
    setUserData(prevUserData => ({...prevUserData, userId: data.userId, username: data.username, email: data.email, birthDate: data.birthDate}))
    setStep(SignUpStep.Password)
  }

  return (
    <div className={'shadow-md flex flex-col p-2 px-8 pb-4 bg-white'}>
      {/* Title */}
      <span className={'text-3xl font-thin mx-auto mb-10'}>
        {`Welcome! Let's Get Started.`}
      </span>

      {/* Steps */}
      {step === SignUpStep.Username && <UsernameStep existingUserData={userData} onNextStep={(data) => saveUsernameScreen(data)}/>}
      {step === SignUpStep.Password && <PasswordStep existingUserData={userData} onNextStep={() => setStep(SignUpStep.Profile)} onPreviousStep={() => setStep(SignUpStep.Username)}/>}

      {/* Footer */}
      {/* TODO: Does this look fine? */}
      <div className={'flex flex-row mt-4'}>
        <div className={'mx-auto flex flex-row'}>
          <PersonIcon className={(step === SignUpStep.Username) ? 'text-brand-green-400' : 'text-gray-400'} />
          <span className={(step === SignUpStep.Password) ? 'text-brand-green-400' : 'text-gray-400'}>-----</span>
          <LockIcon className={(step === SignUpStep.Password) ? 'text-brand-green-400' : 'text-gray-400'}/>
          <span className={(step === SignUpStep.Profile) ? 'text-brand-green-400' : 'text-gray-400'}>-----</span>
          <BadgeIcon className={(step === SignUpStep.Profile) ? 'text-brand-green-400' : 'text-gray-400'} />
        </div>
      </div>
    </div>
  )
}
