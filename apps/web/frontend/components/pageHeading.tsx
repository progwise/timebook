import React from 'react'

interface Props {
  children: React.ReactNode
}

export const PageHeading = ({ children }: Props) => {
  return <h2 className="w-full text-lg font-semibold text-black dark:text-white">{children}</h2>
}
