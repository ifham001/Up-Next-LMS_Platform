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
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
            Add your name
          </h1>
          <p className="text-sm text-text-secondary -mt-2">
            This is printed on your certificate exactly as typed.
          </p>
          <TextInput
            state={[certificateName, setCertificateName]}
            placeholder="e.g. Priya Sharma"
            value={certificateName}
            label="Your name"
          />
          <Button
            fullWidth
            onClick={handleGenerate}
            disabled={!certificateName.trim()}
          >
            Generate certificate
          </Button>
        </div>
      </PopUpModal>

    <div className="card-interactive group min-w-[300px] max-w-[350px] flex-shrink-0 overflow-hidden">
      <div className="relative h-[180px] flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl || heroImage}
          alt={title}
          width={200}
          height={200}
          className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        {progress === 100 && (
          <span className="chip absolute top-3 left-3 bg-surface text-success">
            <BookOpenCheckIcon className="size-3" strokeWidth={1.75} /> Completed
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display text-base font-semibold leading-snug text-text-primary line-clamp-2">{title}</h3>
          <p className="text-sm mt-1.5 leading-relaxed text-text-secondary">{tagline}</p>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-secondary">Progress</span>
            <p className="text-xs text-text-muted">
              <span className="tnum font-medium text-text-primary">{progress}%</span> complete
            </p>
          </div>
          <div className="bar-track w-full h-1.5">
            <div
              className="bar-fill h-1.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 justify-center pt-1">
          <Button fullWidth onClick={() => courseHandler()}>
            {progress ? 'Resume' : 'Start'}
          </Button>
          {progress === 100 && (
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setPopUp(true)}
            >
              Download certificate
            </Button>
          )}
        </div>

      </div>

    </div>
    </>
  );
};

export default StudentCourseCard;
