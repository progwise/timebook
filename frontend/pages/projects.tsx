import React, { useState } from 'react'
import { ItemTable, SortDirection } from '../components/itemTable/itemTable'
import { useRouter } from 'next/router'
import { IProject, useProjects } from '../hooks/useProjects'

const Projects = (): JSX.Element => {
    const { projects, error } = useProjects()
    const router = useRouter()

    const itemsPerPage = 10
    const [firstItemIndex, setFirstItemIndex] = useState(1)

    const tableColumns = [
        {
            title: 'Name',
            value: (item: IProject) => item.title,
        },
        {
            title: 'Duration',
            value: (item: IProject) =>
                `${item.startDate != undefined ? item.startDate?.toLocaleDateString : ''}-${
                    item.endDate != undefined ? item.endDate?.toLocaleDateString : ''
                }`,
            orderedBy: SortDirection.DESC,
        },
        {
            title: '',
            // eslint-disable-next-line react/display-name
            value: (item: IProject) => (
                <span className="float-right">
                    <button className="btn btn-gray2 mr-3" onClick={() => handleDeleteProject(item)}>
                        Delete
                    </button>
                    <button className="btn btn-gray2" onClick={() => handleProjectDetails(item)}>
                        Details
                    </button>
                </span>
            ),
        },
    ]

    const handleProjectDetails = async (project: IProject) => {
        await router.push(`/projects/${project.id}`)
    }

    // TODO: fix both errors
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, unicorn/consistent-function-scoping
    const handleDeleteProject = (project: IProject) => {}

    const handleAddProject = async () => {
        await router.push('/projects/new')
    }

    return (
        <article>
            <h2 className="flex justify-between">
                <span>Your projects</span>
                <span>
                    <button className="btn btn-gray1" onClick={handleAddProject}>
                        Add
                    </button>
                </span>
            </h2>

            {error && <span>{error.message}</span>}
            {!projects ? (
                <div>...loading</div>
            ) : (
                <ItemTable
                    columns={tableColumns}
                    items={projects}
                    itemClick={handleProjectDetails}
                    page={{
                        totalItemCount: 521,
                        firstItemIndex: firstItemIndex,
                        itemsPerPage: itemsPerPage,
                        onNext: () => {
                            setFirstItemIndex(firstItemIndex + itemsPerPage)
                        },
                    }}
                />
            )}
        </article>
    )
}

export default Projects
