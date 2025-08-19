'use client';

import React,{useState} from 'react';
import { UserIcon, BookOpenCheckIcon } from 'lucide-react';
import heroImage from '../../public/images/hero.jpg';
import Image from 'next/image';
import Button from './Button';
import TextInput from './TextInput';
import PopUpModal from './PopUpModal';
import { generateCertificate } from '@/util/Certificate';



type Props = {
  imageUrl?: string;
  title: string;
  tagline: string;

  progress: number;
  courseHandler:()=>void // 0 to 100
};

const StudentCourseCard: React.FC<Props> = ({
  imageUrl,
  title,
  tagline,
  
  progress,
  courseHandler
}) => {
  const [certificateName, setCertificateName] = useState('')
 
  const [PopUp, setPopUp] = useState(false)


 

  // Handle certificate download
  const handleGenerate = () => {
    if (!certificateName) return
    generateCertificate(certificateName, title)
    setPopUp(false)
    setCertificateName("")
   
  }
  return (
    <> 
     <PopUpModal onClose={() => setPopUp(false)} isOpen={PopUp}>
        <div className="flex flex-col gap-4 p-3 sm:p-6">
          <h1 className="text-base sm:text-lg font-semibold text-center">
            Please add your name for your certificate
          </h1>
          <TextInput
            state={[certificateName, setCertificateName]}
            placeholder="Your Name"
            value={certificateName}
            label="Your name"
          />
          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={!certificateName.trim()}
          >
            Generate Certificate
          </Button>
        </div>
      </PopUpModal>

    <div className="min-w-[300px] max-w-[350px] rounded-xl overflow-hidden border bg-white shadow-sm flex-shrink-0">
      <div className="bg-slate-800 text-white h-[180px] flex items-center justify-center text-center text-sm font-medium">
        <Image
          src={imageUrl || heroImage}
          alt="Course"
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg leading-tight">{title}</h3>

        <div className="text-sm text-muted-foreground flex items-center gap-2">
          
          <span>{tagline}</span>
        </div>

        <div className="flex items-center gap-2 text-sm mt-2">
          <BookOpenCheckIcon className="w-4 h-4 text-primary" />
         
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-300">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-right mt-1 text-muted-foreground">{progress}% completed</p>
        </div>
        <div className="flex flex-col  justify-center">
  <Button onClick={()=>courseHandler()} className='w-full'>{progress?'Resume':'Start'}</Button>
  {progress === 100 && (
                  <Button
                    className="w-full bg-white text-red-500 text-sm sm:text-base py-2 sm:py-3"
                    onClick={() => setPopUp(true)}
                  >
                    Download Certificate
                  </Button>
                )}
</div>

      </div>
    
    </div>
    </>
  );
};

export default StudentCourseCard;
