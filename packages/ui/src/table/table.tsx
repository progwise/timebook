export interface DefaultTableComponentProps {
  className?: string
  children?: React.ReactNode
}

export const Table: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <table className={`w-full bg-white shadow-lg ${className}`}>{children}</table>
}

// Header
export const TableHead: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <thead className={className}>{children}</thead>
}

export const TableHeadRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={className}>{children}</tr>
}

export const TableHeadCell: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return (
    <th className={`border-b bg-gray-100 p-2 text-left text-gray-600 dark:bg-slate-800 dark:text-white${className}`}>
      {children}
    </th>
  )
}

// Body:
export const TableBody: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tbody className={className}>{children}</tbody>
}

export const TableRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return (
    <tr className={`border-b-2 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-gray-600 ${className}`}>{children}</tr>
  )
}

export const TableCell: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <td className={` p-2 ${className}`}>{children}</td>
}

// Footer:
export const TableFoot: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tfoot className={className}>{children}</tfoot>
}

export const TableFootRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={`dark:bg-slate-800 ${className}`}>{children}</tr>
}
