import React from 'react'

interface PageHeadingProps {
  children: React.ReactNode
}

export const PageHeading = ({ children }: PageHeadingProps) => {
  return <h2 className="self-center text-lg text-base-content">{children}</h2>
}
