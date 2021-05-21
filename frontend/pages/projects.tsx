import React, { useEffect, useState } from "react";
import {
  IItemTableItem,
  ItemTable,
  SortDirection,
} from "../components/itemTable/itemTable";
import {useRouter} from 'next/router';

interface IProject {
  name: string;
  startDate: Date;
  endDate: Date;
}

const Projects = () => {
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
  ];

  const projectList = [
    {
      name: "Testproject",
      startDate: new Date(2021, 1, 1),
      endDate: new Date(2021, 12, 31),
    },
    {
      name: "Testproject2",
      startDate: new Date(2020, 1, 1),
      endDate: new Date(2022, 12, 31),
    },
  ];

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
