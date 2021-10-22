import { ProjectForm } from '../../frontend/components/projectForm/projectForm'

const NewProjectPage = (): JSX.Element => {
    return <ProjectForm onSubmit={console.log} onCancel={console.log} />
}

export default NewProjectPage
