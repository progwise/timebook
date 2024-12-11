import React from 'react'

interface PageHeadingProps {
  children: React.ReactNode
}

export const PageHeading = ({ children }: PageHeadingProps) => {
  return <h2 className="my-6 text-xl text-base-content">{children}</h2>
}
