import { ProjectForm } from '../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { ProjectInput, useProjectCreateMutation } from '../../frontend/generated/graphql'

const NewProjectPage = (): JSX.Element => {
    const [, projectCreate] = useProjectCreateMutation()

    const handleSubmit = (data: ProjectInput) => {
        projectCreate({ data })
    }
    return (
        <ProtectedPage>
            {/* eslint-disable-next-line no-console */}
            <ProjectForm onSubmit={handleSubmit} onCancel={console.log} />
        </ProtectedPage>
    )
}

export default NewProjectPage
