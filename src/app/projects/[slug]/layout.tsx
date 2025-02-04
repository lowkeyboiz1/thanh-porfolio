import { getProjectDetail } from '@/apis/projects'

export async function generateMetadata({ params }: { params: any }) {
  try {
    const { slug } = await params
    console.log({ slug })
    const project = await getProjectDetail(slug)
    console.log({ project })
    return {
      title: `${await project.title} | Tran Quang Thanh`,
      description: await project.description
    }
  } catch (error) {
    console.log(error)
    return {
      title: 'Project | Tran Quang Thanh',
      description: 'Project details page'
    }
  }
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
