'use client'
import { Upload } from '@/components/Upload'
import FormCreateProject from '../projects/FormCreateProject'
const CreateNewProject = () => {
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT
  return (
    <div className='flex flex-col gap-14'>
      <FormCreateProject />
      <Upload />
    </div>
  )
}

export default CreateNewProject
