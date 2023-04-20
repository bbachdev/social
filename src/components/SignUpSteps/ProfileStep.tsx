import { SignUpData } from '@/types/user';
import { useState } from 'react';

export default function ProfileStep({ onNextStep, onPreviousStep, existingUserData } : { onNextStep: (data: SignUpData) => void, onPreviousStep: () => void, existingUserData: SignUpData }) {
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  var testText : string = 'test'

  function saveProfilePicture(e : React.FormEvent<HTMLFormElement>) {
  }

  return (
    <div className={'flex flex-col space-y-8'}>
      
    </div>
  )
}
