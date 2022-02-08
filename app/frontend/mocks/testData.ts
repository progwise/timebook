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
  project: testProject,
}

testProject.tasks = [testTask]

export const testWorkHour: WorkHourFragment = {
  __typename: 'WorkHour',
  date: format(new Date(), 'yyyy-MM-dd'),
  duration: 123,
  project: testProject,
} as WorkHourFragment
