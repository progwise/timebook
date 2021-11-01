import { useRouter } from 'next/router'
import { ProjectForm, ProjectFormState } from '../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { useProjectsQuery } from '../../frontend/generated/graphql'

const ProjectDetails = (): JSX.Element => {
    const [{ data, fetching }] = useProjectsQuery()
    const router = useRouter()
    const { id } = router.query
    const selectedProject = data?.projects.find((p) => p.id === id)

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
