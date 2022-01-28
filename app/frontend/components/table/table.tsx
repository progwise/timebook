// export interface TableProps {
//   children: [React.ReactElement<TableHead>
// }

// table th {
//   @apply text-left font-bold mb-3 text-gray-400 text-lg bg-gray-50;
// }

// table td,
// table th {
//   @apply py-1.5 px-1;
// }

// table thead {
//   @apply border-b-4 border-transparent;
// }

// table tfoot {
//   @apply border-t-4 border-transparent;
// }

// table tbody tr:nth-child(2n) {
//   @apply bg-gray-100;
// }

// table tbody tr {
//   @apply hover:bg-gray-200;
// }

interface DefaultTableComponentProps {
  className?: string
}

export const Table: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <table className={`shadow-lg bg-white w-full ${className}`}>{children}</table>
}

export const TableHead: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <thead className={className}>{children}</thead>
}

export const TableBody: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tbody className={className}>{children}</tbody>
}

export const TableRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={`hover:bg-gray-200 even:bg-gray-100 border-b-2 ${className}`}>{children}</tr>
}

export const TableHeadRow: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <tr className={className}>{children}</tr>
}

export const TableHeadCell: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <th className={`bg-gray-100 border-b text-left px-2 pb-2 pt-2 text-gray-600 ${className}`}>{children}</th>
}

export const TableCell: React.FC<DefaultTableComponentProps> = ({ children, className = '' }) => {
  return <td className={`p-2 ${className}`}>{children}</td>
}
