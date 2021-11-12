import { format, parse } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { ProjectFragment, ProjectInput } from '../../generated/graphql'
import { CalendarSelector } from '../calendarSelector'
import InputMask from 'react-input-mask'

const acceptedDateFormats = ['yyyy-MM-dd', 'dd.MM.yyyy', 'MM/dd/yyyy']
const isValidDateString = (dateString: string): boolean =>
    acceptedDateFormats.some((format) => parse(dateString, format, new Date()).getDate())

interface ProjectFormProps {
    onSubmit: (data: ProjectInput) => Promise<void>
    onCancel: () => void
    project?: ProjectFragment
}

export const ProjectForm = (props: ProjectFormProps): JSX.Element => {
    const { project, onSubmit, onCancel } = props
    const { register, handleSubmit, formState, setValue, control } = useForm<ProjectInput>({
        defaultValues: {
            title: project?.title,
            start: project?.startDate ? format(new Date(project.startDate), 'MM-dd-yyyy') : '',
            end: project?.endDate ? format(new Date(project.endDate), 'MM-dd-yyyy') : '',
        },
    })

    const handleSubmitHelper = (data: ProjectInput) => {
        return onSubmit({
            ...data,
            end: data.end ? data.end : undefined,
            start: data.start ? data.start : undefined,
        })
    }

    const isNewProject = !project
    return (
        <form onSubmit={handleSubmit(handleSubmitHelper)}>
            {isNewProject ? <h2>Create Project</h2> : <h2>Edit Project</h2>}
            <label className="text-gray-500">
                <span>Name</span>
                <input type="text" disabled={formState.isSubmitting} {...register('title', { required: true })} />
                {formState.errors.title && <span>Required</span>}
            </label>
            <div className="flex flex-wrap gap-x-5">
                <label>
                    <span>Start</span>
                    <div className="flex items-center gap-x-2">
                        <Controller
                            control={control}
                            rules={{ validate: (value) => !value || isValidDateString(value) }}
                            name="start"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputMask
                                    disabled={formState.isSubmitting}
                                    mask="9999-99-99"
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    value={value ?? undefined}
                                />
                            )}
                        />

                        <CalendarSelector
                            disabled={formState.isSubmitting}
                            className="flex-shrink-0"
                            hideLabel={true}
                            onSelectedDateChange={(newDate) => setValue('start', format(newDate, 'yyyy-MM-dd'))}
                        />
                    </div>
                    {formState.errors.start && <span className="whitespace-nowrap">Invalid Date</span>}
                </label>

                <label>
                    <span>End</span>
                    <div className="flex items-center gap-x-2">
                        <Controller
                            control={control}
                            rules={{ validate: (value) => !value || isValidDateString(value) }}
                            name="end"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputMask
                                    mask="9999-99-99"
                                    disabled={formState.isSubmitting}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    value={value ?? undefined}
                                />
                            )}
                        />
                        <CalendarSelector
                            disabled={formState.isSubmitting}
                            className="flex-shrink-0"
                            hideLabel={true}
                            onSelectedDateChange={(newDate) => setValue('end', format(newDate, 'yyyy-MM-dd'))}
                        />
                    </div>
                    {formState.errors.end && <span className="whitespace-nowrap">Invalid Date</span>}
                </label>
            </div>
            <div className="flex justify-center mt-16">
                <button disabled={formState.isSubmitting} className="btn btn-gray1" onClick={onCancel}>
                    Cancel
                </button>
                <input type="submit" disabled={formState.isSubmitting} className="btn btn-gray1" title="Save" />
            </div>
        </form>
    )
}
