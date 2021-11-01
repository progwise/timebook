import { useRouter } from 'next/router'
import { useProjects } from '../../frontend/hooks/useProjects'
import { ProjectForm, ProjectFormState } from '../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'

const ProjectDetails = (): JSX.Element => {
    const { projects, fetching } = useProjects()
    const router = useRouter()
    const { id } = router.query
    const selectedProject = projects.find((p) => p.id === id)

    const handleSubmit = async (data: ProjectFormState) => {
        // eslint-disable-next-line no-console
        console.log(data)
        await router.push('/projects')
    }

    const handleCancel = async () => {
        await router.push('/projects')
    }

    if (fetching) {
        return <div>Loading...</div>
    }

    if (!selectedProject) {
        return <div>Project not found</div>
    }

    return (
        <ProtectedPage>
            <article>
                <ProjectForm project={selectedProject} onCancel={handleCancel} onSubmit={handleSubmit} />
            </article>
        </ProtectedPage>
    )
}

export default ProjectDetails
