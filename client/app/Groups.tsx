import * as React from 'react';
import * as shuffle from 'shuffle-array';
import * as fetch from 'isomorphic-fetch';
import { computeGroups } from './utils';
require('es6-promise').polyfill();

const url = 'http://127.0.0.1:3030/employees';
const MIN_GROUP_SIZE = 3;
const MAX_GROUP_SIZE = 5;

export interface State {
  employees: string[];
}

class Groups extends React.Component<any, State> {

  constructor(props) {
    super(props);
    this.state = {
      employees: []
    };
  }

  fetchData() {
    return fetch(url)
    .then((response => response.json()));
  }

  componentDidMount() {
    // Get employees
    let self = this;
    this.fetchData()
    .then((data) => self.setState({
      employees: data.map((val) => val.name)
    }))
    .catch((err) => { throw Error(err); });
  }

  renderList(header: string, items: string[]) {
    return (
      <div className='col-md-auto'>
        <ul className='list-group'>
          <li className='list-group-item active'>{header}</li>
          {items.map((item) => <li className='list-group-item'>{item}</li>)}
        </ul>
      </div>
    );
  }

  renderGroups(list: string[]): any {
    shuffle(list);
    console.log(list);
    let groups: number[] = computeGroups(list.length, MIN_GROUP_SIZE, MAX_GROUP_SIZE);
    console.log(groups);
    let rendered: any[] = [];
    let len: number = 0;
    groups.map((val: number, index: number) => {
      rendered.push(this.renderList('Group' + (index + 1), list.slice(len, len + val)));
      len += val;
    });
    return rendered;
  }

  render() {
    const groups = this.renderGroups(this.state.employees);
    return (
      <div className='row' style={{margin: 'auto'}}>{groups}</div>
    );
  }
}

export default Groups;
