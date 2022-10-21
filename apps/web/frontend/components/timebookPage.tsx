import { ReactNode } from 'react'

export interface TimebookPageProps {
  children?: ReactNode
}
export const TimebookPage = ({ children }: TimebookPageProps): JSX.Element => {
  return <article className="m-4 space-y-4 bg-transparent p-6">{children}</article>
}
