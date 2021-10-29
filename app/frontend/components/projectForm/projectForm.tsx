import { format, parse } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { IProject } from '../../hooks/useProjects'
import { CalendarSelector } from '../calendarSelector'
import InputMask from 'react-input-mask'

const acceptedDateFormats = ['yyyy-MM-dd', 'dd.MM.yyyy', 'MM/dd/yyyy']
const isValidDateString = (dateString: string): boolean =>
    acceptedDateFormats.some((format) => parse(dateString, format, new Date()).getDate())

export interface ProjectFormState {
    name: string
    start: string
    end: string
}

interface ProjectFormProps {
    onSubmit: (data: ProjectFormState) => void
    onCancel: () => void
    project?: IProject
}

export const ProjectForm = (props: ProjectFormProps): JSX.Element => {
    const { project, onSubmit, onCancel } = props
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
    } = useForm<ProjectFormState>({
        defaultValues: {
            name: project?.title,
            start: project?.startDate ? format(new Date(project.startDate), 'MM-dd-yyyy') : '',
            end: project?.endDate ? format(new Date(project.endDate), 'MM-dd-yyyy') : '',
        },
    })

    const isNewProject = !project
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {isNewProject ? <h2>Create Project</h2> : <h2>Edit Project</h2>}
            <label className="text-gray-500">
                <span>Name</span>
                <input type="text" {...register('name', { required: true })} />
                {errors.name && <span>Required</span>}
            </label>
            <label>
                <span>Start</span>
                <Controller
                    control={control}
                    rules={{ validate: (value) => value === '' || isValidDateString(value) }}
                    name="start"
                    render={({ field: { onChange, onBlur, ref, value } }) => (
                        <InputMask mask="9999-99-99" onBlur={onBlur} onChange={onChange} inputRef={ref} value={value} />
                    )}
                />

                <CalendarSelector
                    hideLabel={true}
                    onSelectedDateChange={(newDate) => setValue('start', format(newDate, 'yyyy-MM-dd'))}
                />
                {errors.start && <span className="whitespace-nowrap">Invalid Date</span>}
            </label>
            <label>
                <span>End</span>
                <Controller
                    control={control}
                    rules={{ validate: (value) => value === '' || isValidDateString(value) }}
                    name="end"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputMask mask="9999-99-99" onBlur={onBlur} onChange={onChange} value={value} />
                    )}
                />

                <CalendarSelector
                    hideLabel={true}
                    onSelectedDateChange={(newDate) => setValue('end', format(newDate, 'yyyy-MM-dd'))}
                />
                {errors.end && <span className="whitespace-nowrap">Invalid Date</span>}
            </label>
            <div className="flex justify-center">
                <input type="reset" className="btn btn-gray1" onClick={onCancel} title="Reset" />
                <input type="submit" className="btn btn-gray1" title="Save" />
            </div>
        </form>
    )
}
