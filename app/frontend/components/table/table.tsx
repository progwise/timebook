export interface DefaultTableComponentProps {
  className?: string
}

export const Table: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <table className={`shadow-lg bg-white w-full ${className}`}>{children}</table>
}

// Header
export const TableHead: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <thead className={className}>{children}</thead>
}

export const TableHeadRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={className}>{children}</tr>
}

export const TableFootRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={className}>{children}</tr>
}

// Body:
export const TableBody: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tbody className={className}>{children}</tbody>
}

export const TableRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={`hover:bg-gray-200 even:bg-gray-100 border-b-2 ${className}`}>{children}</tr>
}

export const TableCell: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <td className={`p-2 ${className}`}>{children}</td>
}

// Footer:
export const TableFoot: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tfoot className={className}>{children}</tfoot>
}




export const TableCellRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={className}>{children}</tr>
}

export const TableHeadCell: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <th className={`bg-gray-100 border-b text-left px-2 pb-2 pt-2 text-gray-600 ${className}`}>{children}</th>
}

