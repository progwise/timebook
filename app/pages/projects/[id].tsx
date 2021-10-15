import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IProject, useProjects } from '../../frontend/hooks/useProjects'
import { useForm } from "react-hook-form";


const now = new Date()
const newProject: IProject = {
    id: 'new project',
    title: '',
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: new Date(now.getFullYear(), 12, 31),
}



const ProjectDetails = (): JSX.Element => {
    const { projects } = useProjects()
    const [currentProject, setCurrentProject] = useState<IProject>(() => newProject)


    const {register, handleSubmit, formState: {errors}} = useForm()
    const onSubmit = async (data: any) => {
      console.log(data);
      await router.push('/projects');
    }


    const router = useRouter()
    const { id } = router.query
    
    const handleCancel = async () => {
        await router.push('/projects')
    }

    useEffect(() => {
        const selectedProject = projects.find((p) => p.id === id)
        if (selectedProject) {
            setCurrentProject(selectedProject)
        }
    })

    const isNewProject = () => currentProject.id === newProject.id

    return (
        <article>
            <form key={currentProject.id} onSubmit = {handleSubmit(onSubmit)}>
                {isNewProject() ? <h2>Create Project</h2> : <h2>Edit Project</h2>}
                <label className="text-gray-500">
                    <span>Id</span>
                    {/* <input type="text" defaultValue={currentProject.id} /> */}
                </label>
                <label className="text-gray-500">
                    <span>Name</span>
                    <input type="text" defaultValue={currentProject.title} {...register("Name", { required: true })}/>
                    {errors.Name && <span>This field is required</span>}
                </label>
                <label>
                    <span>Start</span>
                    <input type="text" defaultValue={currentProject.startDate?.toLocaleDateString()} />
                </label>
                <label>
                    <span>End</span>
                    <input type="text" defaultValue={currentProject.endDate?.toLocaleDateString()} />
                </label>
                <div className="flex justify-center">
                    <input type="reset" className="btn btn-gray1" onClick={handleCancel} title="Reset" />
                    <input type="submit" className="btn btn-gray1" title="Save" />
                </div>
            </form>
        </article>
    )
}

export default ProjectDetails
