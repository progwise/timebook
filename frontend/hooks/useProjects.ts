import {useState} from 'react';
import {useQuery} from 'urql';

export interface IProject {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
}

// const initialProjectList: Array<IProject> = [
//   {
//     id: '1',
//     name: "Testproject",
//     startDate: new Date(2021, 1, 1),
//     endDate: new Date(2021, 12, 31),
//   },
//   {
//     id: '2',
//     name: "Testproject2",
//     startDate: new Date(2020, 1, 1),
//     endDate: new Date(2022, 12, 31),
//   },
// ];

const projectQuery = `
  query {
   projects {
     id
     title
   }
}
`

export const useProjects = () => {
  //const [ projectList, setProjectList ] = useState(initialProjectList)
const [ projectList ] = useQuery({ query: projectQuery})
  return { projectList }
}
