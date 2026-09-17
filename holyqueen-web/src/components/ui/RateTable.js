/* Semantic table that restacks into label/value pairs under 640px,
   so the pairing survives on a phone. */
export default function RateTable({ caption, columns, rows, note }) {
  return (
    <div className="rate-table-wrap reveal">
      <table className="rate-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} data-label={columns[cellIndex]}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="table-note">{note}</p>}
    </div>
  );
}
