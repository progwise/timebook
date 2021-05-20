import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

const NewProject = () => {
  const router = useRouter()
  const handleSubmit = async () => {
    await router.push('/projects')
  }
  return <article>
    <form>
      <h2>New Project</h2>
      <label className="text-gray-500">
        <span>Name</span>
        <input type="text" defaultValue="Project name" />
      </label>
      <label>
        <span>Start</span>
        <input type="date" defaultValue="Start" />
      </label>
      <label>
        <span>End</span>
        <input type="date" defaultValue="End" />
      </label>
      <div>
        <input type="submit" className="btn btn-green1" onClick={handleSubmit} title="Save" />
      </div>
    </form>
  </article>
}

export default NewProject
