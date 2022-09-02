import { format } from 'date-fns'
import { ProjectWithTasksFragment, TaskFragment, WorkHourFragment } from '../generated/graphql'

export const testProject1: ProjectWithTasksFragment = {
  __typename: 'Project',
  id: 'project1',
  title: 'Project 1',
  tasks: [],
}

export const testProject2: ProjectWithTasksFragment = {
  __typename: 'Project',
  id: 'project2',
  title: 'Project 2',
  tasks: [],
}

export const testTask: TaskFragment = {
  __typename: 'Task',
  hasWorkHours: true,
  id: 'task1',
  title: 'Task 1',
  project: {
    __typename: 'Project',
    id: testProject1.id,
    title: testProject1.title,
  },
}

testProject1.tasks = [testTask]

export const testWorkHour: WorkHourFragment = {
  __typename: 'WorkHour',
  id: '123',
  date: format(new Date(), 'yyyy-MM-dd'),
  duration: 123,
  project: testProject1,
  user: {
    __typename: 'User',
    id: '1',
    name: 'TestUser',
  },
  task: {
    __typename: 'Task',
    title: testTask.title,
    id: testTask.id,
    hasWorkHours: true,
    project: {
      __typename: 'Project',
      id: testProject1.id,
      title: testProject1.title,
    },
  },
}
