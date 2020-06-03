import React, { Component } from 'react';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';
import axios from 'axios';
import { useTable } from 'react-table'

class TemplatePlanning extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state={
      name : '',
      columns : [],
      data : null,
      is_created : false,
      error : null,
    };
    this.submit_form = this.submit_form.bind(this);
    this.getTemplate = this.getTemplate.bind(this);
  };
  
  // store a new template
  submit_form(event) {
    event.preventDefault();

    // TODO store elsewhere than session ? see security
    let authed_user = sessionStorage.getItem('authed_user');

    var templateFormData = new FormData();
    templateFormData.append('name');
    templateFormData.append('id_create', authed_user);
    templateFormData.append('content', this.baseTemplate)
    axios({
      method: 'post',
      url: 'api/template/',
      data: templateFormData,
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({ is_created: true });
      }
    })
    .catch((error) => {
      if(error.response) {
        this.setState({
          error: {
            status: error.response.status + ' ' + error.response.statusText,
            detail: error.response.data.detail,
          }
        });
      }
    });
  }
  // TODO get in function of a name (scrolllist where there is all the name of the templates) and so get by the id
  getTemplate(){
    axios({
      method: 'get',
      url: 'api/template/3',
    })
    .then((response) => {
      if (response.status === 200) {
        this.setState({
          columns: response.data.content,
        });
      }
    })
    .catch((error) => {
      if(error.response) {
        this.setState({
          error: {
            status: error.response.status + ' ' + error.response.statusText,
            detail: error.response.data.detail,
          }
        });
      }
    });
  }
  componentDidMount(){
    this.getTemplate()
  }
  render(){
    if (!this.context.getIsAuthenticated()) {
      return (<Redirect to ="/login"/>);
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      <div className="container">
        <form onSubmit={this.submit_form}>
          <div className="form-group">
            <label>name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-danger">post</button>
          </div>
        </form>
        <button onClick={this.getTemplate}>get</button>
        <div className="col-xs-12">
          <Table columns={columns} data={this.state.data} />  
        </div>
       </div>
    );
  }
}

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
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
  )
}

export default TemplatePlanning;