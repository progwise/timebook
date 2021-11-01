import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { ProjectFragment } from '../../generated/graphql'
import { CalendarSelector } from '../calendarSelector'

export interface ProjectFormState {
    name: string
    start: string
    end: string
}

interface ProjectFormProps {
    onSubmit: (data: ProjectFormState) => void
    onCancel: () => void
    project?: ProjectFragment
}

export const ProjectForm = (props: ProjectFormProps): JSX.Element => {
    const { project, onSubmit, onCancel } = props
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProjectFormState>({
        defaultValues: {
            name: project?.title,
            start: project?.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : '',
            end: project?.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : '',
        },
    })

    const isNewProject = !project
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {isNewProject ? <h2>Create Project</h2> : <h2>Edit Project</h2>}
            <label className="text-gray-500">
                <span>Name</span>
                <input type="text" {...register('name', { required: true })} />
                {errors.name && <span>Name Required</span>}
            </label>
            <label>
                <span>Start</span>
                <input
                    type="text"
                    {...register('start', {
                        required: true,
                        valueAsDate: true,
                        validate: (value) => !!new Date(value).getDate(),
                    })}
                />
                {errors.start && <span>Start Date Required</span>}
                <CalendarSelector
                    hideLabel={true}
                    onSelectedDateChange={(newDate) => setValue('start', newDate.toLocaleDateString())}
                />
            </label>
            <label>
                <span>End</span>
                <input
                    type="text"
                    {...register('end', {
                        required: true,
                        valueAsDate: true,
                        validate: (value) => !!new Date(value).getDate(),
                    })}
                />
                {errors.end && <span>End Date Required</span>}
                <CalendarSelector
                    hideLabel={true}
                    onSelectedDateChange={(newDate) => setValue('end', newDate.toLocaleTimeString())}
                />
            </label>
            <div className="flex justify-center">
                <input type="reset" className="btn btn-gray1" onClick={onCancel} title="Reset" />
                <input type="submit" className="btn btn-gray1" title="Save" />
            </div>
        </form>
    )
}
