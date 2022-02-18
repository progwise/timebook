export interface DefaultTableComponentProps {
  className?: string
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
  return <th className={`border-b bg-gray-100 px-2 pb-2 pt-2 text-left text-gray-600 ${className}`}>{children}</th>
}

// Body:
export const TableBody: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tbody className={className}>{children}</tbody>
}

export const TableRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={`border-b-2 even:bg-gray-100 hover:bg-gray-200 ${className}`}>{children}</tr>
}

export const TableCell: React.FC<DefaultTableComponentProps & {colSpan?: number}> = ({ children, className = '', colSpan = 1 }) => {
  return <td className={`p-2 ${className}`} colSpan={colSpan}>{children}</td>
}

// Footer:
export const TableFoot: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tfoot className={className}>{children}</tfoot>
}

export const TableFootRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={className}>{children}</tr>
}
