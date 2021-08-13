import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IProject, useProjects } from '../../hooks/useProjects'
import { CalendarSelector } from '../../components/calendarSelector'
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

    const router = useRouter()
    const { id } = router.query
    const handleSubmit = async () => {
        await router.push('/projects')
    }
    const handleCancel = async () => {
        await router.push('/projects')
    }
    const handleStartDate = (startDate: Date) => {
        setCurrentProject({ ...currentProject, startDate: startDate })
    }
    const handleEndDate = (endDate: Date) => {
        setCurrentProject({ ...currentProject, endDate: endDate })
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
            <form key={currentProject.id}>
                {isNewProject() ? <h2>Create Project</h2> : <h2>Edit Project</h2>}
                <label className="text-gray-500" >
                    <span>Id</span>
                    <input type="text" defaultValue={currentProject.id} />
                </label>
                <label className="text-gray-500" >
                  
                    <span>Name</span>
                    <input type="text" defaultValue={currentProject.title} />
                  
        
                </label>
    
                <div className="flex flex-wrap -mx--34 mb-6">
                    <div className="w-10"></div>
                    <label>
                        <span>Start</span>
                            <div className="flex items-center ">
                            
                                <input type="text" className="rounded  border-2 border-gray-200 px-2 py-1" defaultValue={currentProject.startDate?.toLocaleDateString()} />
                         
                                <CalendarSelector hideSelectedDate={true} onSelectedDateChange={handleStartDate} />
                            </div>
                     </label>
                    <div className="w-20">
                    </div>
            
                    <label >
                        <span >End</span>
                            <div className="flex items-center ">
                            
                                <input type="text" className="rounded  border-2 border-gray-200 px-2 py-1" defaultValue={currentProject.endDate?.toLocaleDateString()} />
                                    
                                <CalendarSelector  hideSelectedDate={true} onSelectedDateChange={handleEndDate} />
                                
                            </div>
                            
                    </label>
                    
                </div>
                {currentProject.startDate > currentProject.endDate ? (
                    <p className="flex justify-center"> end must be after start </p>
                ) : (
                    <p></p>
                )}
                <div className="flex justify-center">
                    <input type="reset" className="btn btn-gray1" onClick={handleCancel} title="Reset" />
                    <input type="submit" className="btn btn-gray1" onClick={handleSubmit} title="Save" />
                </div>
            </form>
        </article>
    )
}

export default ProjectDetails
