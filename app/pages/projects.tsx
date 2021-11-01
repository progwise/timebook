import React, { useState } from 'react'
import { ItemTable, SortDirection } from '../frontend/components/itemTable/itemTable'
import { useRouter } from 'next/router'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { ProjectFragment, useProjectsQuery } from '../frontend/generated/graphql'

const Projects = (): JSX.Element => {
    const [{ data, error }] = useProjectsQuery()
    const router = useRouter()

    const itemsPerPage = 10
    const [firstItemIndex, setFirstItemIndex] = useState(1)

    const tableColumns = [
        {
            title: 'Name',
            value: (item: ProjectFragment) => item.title,
        },
        {
            title: 'Duration',
            value: (item: ProjectFragment) =>
                `${item.startDate ? item.startDate : ''}-${item.endDate ? item.endDate : ''}`,
            orderedBy: SortDirection.DESC,
        },
        {
            title: '',
            // eslint-disable-next-line react/display-name
            value: (item: ProjectFragment) => (
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

    const handleProjectDetails = async (project: ProjectFragment) => {
        await router.push(`/projects/${project.id}`)
    }

    // TODO: fix both errors
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, unicorn/consistent-function-scoping
    const handleDeleteProject = (project: ProjectFragment) => {}

    const handleAddProject = async () => {
        await router.push('/projects/new')
    }

    return (
        <ProtectedPage>
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
                {!data?.projects ? (
                    <div>...loading</div>
                ) : (
                    <ItemTable
                        columns={tableColumns}
                        items={data.projects}
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
        </ProtectedPage>
    )
}

export default Projects
