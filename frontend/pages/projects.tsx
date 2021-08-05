import React, { useEffect, useState } from "react";
import { ItemTable, SortDirection } from "../components/itemTable/itemTable";
import { useRouter } from "next/router";
import { IProject, useProjects } from "../hooks/useProjects";

const Projects = () => {
  const { projects, error } = useProjects();
  const router = useRouter();

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [firstItemIndex, setFirstItemIndex] = useState(1);

  const tableColumns = [
    {
      title: "Name",
      value: (item: IProject) => item.title,
      onClick: () => console.log("ONCLICK"),
    },
    {
      title: "Duration",
      value: (item: IProject) =>
        `${item.startDate != undefined ? item.startDate?.toLocaleDateString : ""}-${
          item.endDate != undefined ? item.endDate?.toLocaleDateString : ""
        }`,
      onClick: () => {},
      orderedBy: SortDirection.DESC,
    },
    {
      title: "",
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
  ];

  const handleProjectDetails = async (project: IProject) => {
    await router.push(`/projects/${project.id}`);
  };

  const handleDeleteProject = (project: IProject) => {
    // setProjectList(projectList.filter(p => p.id !== project.id))
  };

  const handleAddProject = async () => {
    await router.push("/projects/new");
  };

  console.log(projects);

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
            onPrevious: () => {},
            onFirst: () => {},
            onNext: () => {
              setFirstItemIndex(firstItemIndex + itemsPerPage);
            },
            onLast: () => {},
          }}
        />
      )}
    </article>
  );
};

export default Projects;
