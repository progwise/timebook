import streamDeck, {
  Action,
  KeyDownEvent,
  PropertyInspectorDidAppearEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent,
  action,
} from '@elgato/streamdeck'
import { differenceInSeconds, formatISO, minutesToHours, parseISO, secondsToMinutes } from 'date-fns'
import { GraphQLClient, gql } from 'graphql-request'

const getClient = async () => {
  const { url, accessToken } = await streamDeck.settings.getGlobalSettings<GlobalSettings>()
  const endpoint = `${url ?? 'https://timebook.progwise.net'}/api/graphql`
  const client = new GraphQLClient(endpoint, { headers: { authorization: `ApiKey ${accessToken}` } })

  return client
}

const StartTrackingMutationDocument = gql`
  mutation trackingStart($taskId: ID!) {
    trackingStart(taskId: $taskId) {
      start
      task {
        id
      }
    }
  }
`

const StopTrackingMutationDocument = gql`
  mutation trackingStop {
    trackingStop {
      id
      task {
        id
      }
    }
  }
`

const CurrentTrackingQueryDocument = gql`
  query currentTracking {
    currentTracking {
      start
      task {
        id
      }
    }
  }
`

const CurrentTaskTitleDocument = gql`
  query Task($taskId: ID!) {
    task(taskId: $taskId) {
      title
      id
    }
  }
`

const MyProjectsQueryDocument = gql`
  query myProjects($from: Date!) {
    projects(from: $from) {
      title
      tasks {
        id
        title
        isLocked
      }
    }
  }
`

type TrackingSettings = {
  taskID?: string
}

type GlobalSettings = {
  url?: string
  accessToken: string
}

type Project = {
  title: string
  tasks: {
    id: string
    title: string
    isLocked: boolean
  }[]
}

@action({ UUID: 'net.progwise.timebook.tracking' })
export class Tracking extends SingletonAction<TrackingSettings> {
  private interval?: NodeJS.Timeout
  private activeButtons = new Map<string, Action<TrackingSettings>>()
  private projects: Project[] = []

  async onWillAppear(event: WillAppearEvent<TrackingSettings>): Promise<void> {
    this.activeButtons.set(event.action.id, event.action)
    if (this.activeButtons.size === 1) {
      this.interval = setInterval(async () => {
        await this.updateCurrentTrackingTitle()
      }, 1000)
      await this.fetchProjects(event.action)
    }
  }

  private getDurationString = (difference: number) => {
    const differenceInMinutes = secondsToMinutes(difference)
    const hours = minutesToHours(differenceInMinutes)
    const seconds = difference % 60
    const minutes = differenceInMinutes % 60

    const secondsWithLeadingZero = seconds.toString().padStart(2, '0')
    const minutesWithLeadingZero = minutes.toString().padStart(2, '0')
    return `${hours > 0 ? `${hours}:` : ''}${minutesWithLeadingZero}:${secondsWithLeadingZero}`
  }

  private async updateCurrentTrackingTitle() {
    const client = await getClient()
    const response = await client.request<{
      currentTracking?: { start: string; task: { id: string } }
    }>(CurrentTrackingQueryDocument)

    const startDate = response.currentTracking ? parseISO(response.currentTracking.start) : undefined

    for (const action of this.activeButtons.values()) {
      const { taskID } = await action.getSettings()
      const taskTitle = this.projects.flatMap((project) => project.tasks).find((task) => taskID === task.id)?.title
      if (startDate && taskID === response.currentTracking?.task.id) {
        const newDifference = differenceInSeconds(new Date(), startDate)
        await action.setTitle(`${taskTitle}\n${this.getDurationString(newDifference)}`)
      } else {
        await action.setTitle(taskTitle)
      }
    }
  }

  onWillDisappear(event: WillDisappearEvent<object>): void | Promise<void> {
    this.activeButtons.delete(event.action.id)

    if (this.activeButtons.size === 0) {
      clearInterval(this.interval)
    }
  }

  private async stopCurrentTracking(action: Action<TrackingSettings>) {
    const client = await getClient()

    await client.request(StopTrackingMutationDocument)
    action.setTitle('Not\ntracking')
  }

  async onKeyDown(event: KeyDownEvent<TrackingSettings>): Promise<void> {
    const { taskID } = await event.action.getSettings()
    const client = await getClient()

    try {
      const response = await client.request<{
        currentTracking?: { start: string; task: { id: string } }
      }>(CurrentTrackingQueryDocument)

      await (response.currentTracking && taskID === response.currentTracking?.task.id
        ? this.stopCurrentTracking(event.action)
        : client.request(StartTrackingMutationDocument, { taskId: taskID }))
    } catch {
      await event.action.showAlert()
    }

    await this.updateCurrentTrackingTitle()
  }

  async onPropertyInspectorDidAppear(event: PropertyInspectorDidAppearEvent<TrackingSettings>): Promise<void> {
    await event.action.sendToPropertyInspector<DataSourcePayload>({
      event: 'getProjects',
      items: this.projects.map((project) => ({
        label: project.title,
        children: project.tasks.map((task) => ({
          label: task.title,
          value: task.id,
          disabled: task.isLocked,
        })),
      })),
    })
  }

  private async fetchProjects(action: Action<TrackingSettings>) {
    const { taskID } = await action.getSettings()
    const client = await getClient()

    await client.request<{
      task: { title: string; id: string } | null
    }>(CurrentTaskTitleDocument, { taskId: taskID })

    const projectsResponse = await client.request<{
      projects: Project[]
    }>(MyProjectsQueryDocument, { from: formatISO(new Date(), { representation: 'date' }) })

    this.projects = projectsResponse.projects
  }
}
