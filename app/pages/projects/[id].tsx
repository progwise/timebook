import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IProject, useProjects } from '../../frontend/hooks/useProjects'
import { useForm } from 'react-hook-form'
import { CalendarSelector } from '../../frontend/components/calendarSelector'

const now = new Date()
const newProject: IProject = {
    id: 'new project',
    title: '',
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: new Date(now.getFullYear(), 12, 31),
}

interface ProjectFormState {
    name: string
    start: string
    end: string
}

const ProjectDetails = (): JSX.Element => {
    const { projects } = useProjects()
    const [currentProject, setCurrentProject] = useState<IProject>(() => newProject)
    const router = useRouter()
    const { id } = router.query

    // eslint-disable-next-line no-console
    console.log({ projects, id })

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProjectFormState>({
        defaultValues: { name: currentProject.title, start: '01/01/2021', end: '31/12/2022' },
    })
    const onSubmit = async (data: ProjectFormState) => {
        // eslint-disable-next-line no-console
        console.log(data)
        await router.push('/projects')
    }

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
            <form key={currentProject.id} onSubmit={handleSubmit(onSubmit)}>
                {isNewProject() ? <h2>Create Project</h2> : <h2>Edit Project</h2>}
                <label className="text-gray-500">
                    <span>Id</span>
                    {/* <input type="text" defaultValue={currentProject.id} /> */}
                </label>
                <label className="text-gray-500">
                    <span>Name</span>
                    <input type="text" {...register('name', { required: true })} />
                    {errors.name && <span>Name Required</span>}
                </label>
                <label>
                    <span>Start</span>
                    <input type="text" {...register('start', { required: true })} />
                    {errors.start && <span>Satrt Date Required</span>}
                    <CalendarSelector
                        hideLabel={true}
                        onSelectedDateChange={(newDate) => setValue('start', newDate.toLocaleDateString())}
                    />
                </label>
                <label>
                    <span>End</span>
                    <input type="text" {...register('end', { required: true })} />
                    {errors.end && <span>End Date Required</span>}
                    <CalendarSelector
                        hideLabel={true}
                        onSelectedDateChange={(newDate) => setValue('end', newDate.toLocaleTimeString())}
                    />
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
