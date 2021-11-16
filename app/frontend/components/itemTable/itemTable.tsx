import { ProjectFragment } from '../../generated/graphql'

export enum SortDirection {
  ASC,
  DESC,
}

export interface IItemTableProps {
  columns: Array<{
    title: string
    value: (item: ProjectFragment) => string | JSX.Element
    orderedBy?: SortDirection
    onClick?: () => void
  }>

  items: Array<ProjectFragment>
  itemClick?: (item: ProjectFragment) => void
  page: {
    totalItemCount: number
    firstItemIndex: number
    itemsPerPage: number
    onPrevious?: () => void
    onFirst?: () => void
    onNext?: () => void
    onLast?: () => void
  }
}

export const ItemTable = (props: IItemTableProps): JSX.Element => {
  const handleItemClick = (item: ProjectFragment) => props?.itemClick?.(item)
  return (
    <div>
      <table className="shadow-lg bg-white w-full">
        <thead>
          <tr>
            {props.columns.map((c, colIndex) => (
              <th key={colIndex} className="bg-gray-100 border-b text-left px-2 pb-2 pt-2 text-gray-600">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="before:space-y-4">
          {props.items.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100" onClick={() => handleItemClick(item)}>
              {props.columns.map((c, colIndex) => (
                <td className="py-2 border-b-2 px-2 mx-10" key={colIndex} onClick={c.onClick}>
                  {c.value(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="bg-gray-100 border-t text-right px-1 pt-2 pb-2 text-xs" colSpan={props.columns.length}>
              <button title=" first page" className="btn btn-blue mr-3" onClick={props.page.onFirst}>
                &lt;&lt;
              </button>
              <button title="previous page" className="btn btn-blue mr-3" onClick={props.page.onPrevious}>
                &lt;
              </button>
              <span>
                {props.page.firstItemIndex} - {props.page.firstItemIndex + props.items.length} /{' '}
                {props.page.totalItemCount}
              </span>
              <button title="next page" className="btn btn-blue ml-3" onClick={props.page.onNext}>
                &gt;
              </button>
              <button title="last page" className="btn btn-blue ml-3" onClick={props.page.onLast}>
                &gt;&gt;
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
