import { format } from 'date-fns'
import { ProjectFragment, TaskFragment, WorkHourFragment } from '../generated/graphql'

export const testProject: ProjectFragment = {
  __typename: 'Project',
  id: 'project1',
  title: 'Project 1',
  tasks: [],
}

export const testTask: TaskFragment = {
  __typename: 'Task',
  hasWorkHours: true,
  id: 'task1',
  title: 'Task 1',
  project: {
    __typename: 'Project',
    id: testProject.id,
    title: testProject.title,
  },
}

testProject.tasks = [testTask]

export const testWorkHour: WorkHourFragment = {
  __typename: 'WorkHour',
  id: '123',
  date: format(new Date(), 'yyyy-MM-dd'),
  duration: 123,
  comment: 'Test WorkHour',
  project: testProject,
  task: {
    __typename: 'Task',
    title: testTask.title,
    id: testTask.id,
    hasWorkHours: true,
    project: {
      __typename: 'Project',
      id: testProject.id,
      title: testProject.title,
    },
  },
} as WorkHourFragment
