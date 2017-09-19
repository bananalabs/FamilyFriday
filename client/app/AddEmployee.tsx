import * as React from 'react';

const url = 'http://127.0.0.1:3030/employees';

export interface State {
  name: string;
}

class AddEmployee extends React.Component<any, State> {

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  addEmployee(name) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: name})
    })
    .then(() => console.log('Employee Added'))
    .catch((err) => console.log(err));
  }


  handleChange(event) {
    this.setState({name: event.target.value});
  }

  onAdd() {
    this.addEmployee(this.state.name);
  }

  render() {
    return (
      <div style={{marginTop: '20px', marginLeft: '20px'}}>
        <input type='text' className='form-control' placeholder='Employee Name'
              style={{width: '50%'}} onChange={this.handleChange.bind(this)}/>
        <br/>
        <a className='btn btn-primary' href='/'
           onClick={this.onAdd.bind(this)}>Add</a>
      </div>
    );
  }
}

export default AddEmployee;
