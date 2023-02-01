import type { Meta } from '@storybook/react'

import { Table, TableBody, TableCell, TableFoot, TableHead, TableHeadCell, TableHeadRow, TableRow } from './table'

const ExampleTable = () => (
  <Table>
    <TableHead>
      <TableHeadRow>
        <TableHeadCell>Head 1</TableHeadCell>
        <TableHeadCell>Head 2</TableHeadCell>
        <TableHeadCell>Head 3</TableHeadCell>
      </TableHeadRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Cell 1</TableCell>
        <TableCell>Cell 2</TableCell>
        <TableCell>Cell 3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Cell 4</TableCell>
        <TableCell>Cell 5</TableCell>
        <TableCell>Cell 6</TableCell>
      </TableRow>
    </TableBody>
    <TableFoot>
      <TableRow>
        <TableCell>Footer 1</TableCell>
        <TableCell>Footer 2</TableCell>
        <TableCell>Footer 3</TableCell>
      </TableRow>
    </TableFoot>
  </Table>
)

const config: Meta = {
  title: 'Table',
  component: ExampleTable,
}
export default config

export const Default: Meta = {}
