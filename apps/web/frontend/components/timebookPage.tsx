import { ReactNode } from 'react'

export interface TimebookPageProps {
  children?: ReactNode
}
export const TimebookPage = ({ children }: TimebookPageProps): JSX.Element => {
  return <article className="flex flex-col gap-4 bg-transparent print:m-0 print:p-0">{children}</article>
}
