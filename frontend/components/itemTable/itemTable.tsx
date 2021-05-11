export interface IItemTableProps {
  columns: [{
    title: string
    value: (IItemTableItem) => string | JSX.Element
    orderedBy: 'asc' | 'desc' | undefined
    onClick: (() => void) | undefined
  }]
  items: [IItemTableItem]
  page: {
    totalItemCount: number
    firstItemIndex: number
    onPrevious: () => void
    onFirst: () => void
    onNext: () => void
    onLast: () => void
  }
}

export interface IItemTableItem {

}

export const ItemTable = (props: IItemTableProps) => {
  return <div>
    <table>
      <thead>
      <tr>
        {props.columns.map(c =>
          <th>{c.title}</th>
        )}
      </tr>
      </thead>
      <tbody>
      {props.items.map(item =>
        <tr>
          {
            props.columns.map(c =>
              <td onClick={c.onClick}>
                {c.value(item)}
              </td>
            )
          }
        </tr>
      )}
      </tbody>
      <tfoot>
      <tr>
        <td colSpan={props.columns.length}>
          <button onClick={props.page.onFirst}>
            first
          </button>
          <button onClick={props.page.onPrevious}>
            previous
          </button>
          <span>
            item {props.page.firstItemIndex} - {props.page.firstItemIndex + props.items.length} / {props.page.totalItemCount}
          </span>
          <button onClick={props.page.onNext}>
            next
          </button>
          <button onClick={props.page.onLast}>
            last
          </button>
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
}