import { ProjectForm } from '../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'

const NewProjectPage = (): JSX.Element => {
    return (
        <ProtectedPage>
            <ProjectForm onSubmit={console.log} onCancel={console.log} />
        </ProtectedPage>
    )
}

export default NewProjectPage
