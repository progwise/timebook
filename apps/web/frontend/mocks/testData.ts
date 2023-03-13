import { SheetDayRowFragment } from './mocks.generated'

export const testWorkHour: SheetDayRowFragment = {
  __typename: 'WorkHour',
  id: '123',
  duration: 123,
  project: { title: 'Project 1' },
  user: {
    __typename: 'User',
    name: 'TestUser',
  },
  task: {
    __typename: 'Task',
    title: 'Task 1',
  },
}
