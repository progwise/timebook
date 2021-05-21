import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {IProject, useProjects} from '../../hooks/useProjects';

const now  = new Date()
const newProject: IProject = {
    id: 'new project',
    name: '',
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: new Date(now.getFullYear(), 12, 31)
}

const ProjectDetails = () => {
  const {projectList, setProjectList } = useProjects()
  const [currentProject, setCurrentProject] = useState<IProject>(() => newProject)

console.log('render', currentProject)
  const router = useRouter()
  const {id} = router.query
  const handleSubmit = async () => {
    await router.push('/projects')
  }
  const handleCancel = async () => {
    await router.push('/projects')
  }

  useEffect(() => {
    const selectedProject = projectList.find(p => p.id === id)
    if (selectedProject) {
      console.log('found project with id')
      setCurrentProject(selectedProject)
    }
  })

  return <article>
    <form key={currentProject.id}>
      <h2>New Project</h2>
      <label className="text-gray-500">
        <span>Id</span>
        <input type="text" defaultValue={currentProject.id}/>
      </label>
      <label className="text-gray-500">
        <span>Name</span>
        <input type="text" defaultValue={currentProject.name}/>
      </label>
      <label>
        <span>Start</span>
        <input type="text" defaultValue={currentProject.startDate.toLocaleDateString()}/>
      </label>
      <label>
        <span>End</span>
        <input type="text" defaultValue={currentProject.endDate.toLocaleDateString()}/>
      </label>
      <div className="flex justify-center">
        <input type="reset" className="btn btn-gray1" onClick={handleCancel} title="Reset"/>
        <input type="submit" className="btn btn-gray1" onClick={handleSubmit} title="Save"/>
      </div>
    </form>
  </article>
}

export default ProjectDetails
