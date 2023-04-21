import React from 'react'

interface PageHeadingProps {
  children: React.ReactNode
}

export const PageHeading = ({ children }: PageHeadingProps) => {
  return <h2 className="w-full text-lg font-semibold text-black dark:text-white">{children}</h2>
}
