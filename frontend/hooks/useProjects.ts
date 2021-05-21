import {useState} from 'react';

export interface IProject {
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

export const useProjects = () => {
  const [ projectList, setProjectList ] = useState(initialProjectList)

  return { projectList, setProjectList }
}
