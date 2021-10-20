export const DateInput = (props: { value: string }): JSX.Element => {
    const { value } = props

    return <input type="text" defaultValue={value} />
}
