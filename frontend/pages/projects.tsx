import React, { useEffect, useState } from "react";
import {
  IItemTableItem,
  ItemTable,
  SortDirection,
} from "../components/itemTable/itemTable";
import {useRouter} from 'next/router';

interface IProject {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

const initialProjectList: Array<IProject> = [
  {
    id: '1',
    name: "Testproject",
    startDate: new Date(2021, 1, 1),
    endDate: new Date(2021, 12, 31),
  },
  {
    id: '2',
    name: "Testproject2",
    startDate: new Date(2020, 1, 1),
    endDate: new Date(2022, 12, 31),
  },
];

const Projects = () => {

  const [ projectList, setProjectList ] = useState(initialProjectList)

  const router = useRouter()

  const tableColumns = [
    {
      title: "Name",
      value: (item: IProject) => item.name,
      onClick: () => {},
    },
    {
      title: "Duration",
      value: (item: IProject) =>
        `${item.startDate.toLocaleDateString()}-${item.endDate.toLocaleDateString()}`,
      onClick: () => {},
      orderedBy: SortDirection.DESC,
    },
    {
      title: '',
      value: (item: IProject) => <span className="float-right">
          <button className="btn btn-gray2 mr-3" onClick={() => handleDeleteProject(item)}>Delete</button>
          <button className="btn btn-gray2" onClick={() => handleProjectDetails(item)}>Details</button>
        </span>
    }
  ];

  const handleProjectDetails = async (project: IProject) => {
    await router.push(`/projects/${project.id}`)
  }

  const handleDeleteProject = (project: IProject) => {
    setProjectList(projectList.filter(p => p.id !== project.id))
  }

  const handleAddProject = async () => {
    await router.push('/projects/new')
  }

  return (
    <article>
      <h2 className="flex justify-between">
        <span>Your projects</span>
        <span>
          <button className="btn btn-gray1" onClick={handleAddProject}>Add</button>
        </span>
      </h2>
      <ItemTable
        columns={tableColumns}
        items={projectList}
        page={{
          totalItemCount: 521,
          firstItemIndex: 11,
          itemsPerPage: 10,
          onPrevious: () => {},
          onFirst: () => {},
          onNext: () => {},
          onLast: () => {},
        }}
      />
    </article>
  );
};

export default Projects;
