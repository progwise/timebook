export enum SortDirection {
  ASC,
  DESC,
}

export interface IItemTableProps {
  columns: Array<{
    title: string;
    value: (item: any) => string | JSX.Element;
    orderedBy?: SortDirection;
    onClick?: () => void;
  }>;

  items: Array<IItemTableItem>;
  page: {
    totalItemCount: number;
    firstItemIndex: number;
    itemsPerPage: number;
    onPrevious: () => void;
    onFirst: () => void;
    onNext: () => void;
    onLast: () => void;
  };
}

export interface IItemTableItem {}

export const ItemTable = (props: IItemTableProps) => {
  return (
    <div>
      <table className="shadow-lg bg-white w-full">
        <thead>
          <tr>
            {props.columns.map((c, colIndex) => (
              <th key={colIndex} className="bg-blue-100 border text-left px-2 pb-2 text-gray-600">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="before:space-y-4">
          {props.items.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {props.columns.map((c, colIndex) => (
                <td
                  className="py-2 border-b-2 px-2 "
                  key={colIndex}
                  onClick={c.onClick}
                >
                  {c.value(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td
              className="bg-blue-100 border text-right px-1 pt-2 pb-1"
              colSpan={props.columns.length}
            >
              <button
                title=" first page"
                className="btn btn-blue mr-3"
                onClick={props.page.onFirst}
              >
                &lt;&lt;
              </button>
              <button
                title="previous page"
                className="btn btn-blue mr-3"
                onClick={props.page.onPrevious}
              >
                &lt;
              </button>
              <span>
                {props.page.firstItemIndex} -{" "}
                {props.page.firstItemIndex + props.items.length} /{" "}
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
  );
};
