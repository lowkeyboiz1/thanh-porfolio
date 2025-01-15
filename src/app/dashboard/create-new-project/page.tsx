'use client'
import { Upload } from '@/components/Upload'
import FormCreateProject from '@/app/dashboard/projects'
const CreateNewProject = () => {
  return (
    <div className='flex flex-col gap-14'>
      <FormCreateProject />
      <Upload />
    </div>
  )
}

export default CreateNewProject
