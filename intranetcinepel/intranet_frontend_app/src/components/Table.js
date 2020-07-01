import React from 'react';
import { useTable } from 'react-table';

let datasOfTable = [];

const NonEditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
}) =>{
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <label value={value}>{value}</label>
}
// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value)
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value} onChange={onChange} onBlur={onBlur} />
}

// Set our editable cell renderer as the default Cell renderer
var defaultColumn = {
  Cell: EditableCell,
}

// Be sure to pass our updateMyData
function Table({ columns, data, updateMyData, isManager }) {
  // Otherwise, nothing is different here.
  if(isManager){
    defaultColumn = {
      Cell: EditableCell,
    }
  }
  else
  {
    defaultColumn = {
      Cell: NonEditableCell,
    }
  }
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      isManager,
    },
  )
  
  // Render the UI for your table
  return (
    <>
      <table className="table" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export function ShowTable(datas) {
  const columns = datas.columns;
  const [data, setData] = React.useState(datas.dataSend);
  const isManager = datas.isManager;
  // useEffect to set when we change the planning / template
  React.useEffect(() => {
    setData(datas.dataSend)
  }, [datas.dataSend])
  datasOfTable = data;
  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }
  return (
    <Table
      columns={columns}
      data={data}
      updateMyData={updateMyData}
      isManager = {isManager}
    />
  )
  
}

export function getDatas(){
  return datasOfTable;
}
export default ShowTable
