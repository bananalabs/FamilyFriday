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

  renderGroups(list) {
    shuffle(list);
    let groups = computeGroups(list.length, MIN_GROUP_SIZE, MAX_GROUP_SIZE);
    let rendered = [];
    let len = 0;
    groups.map((val, index) => {
      rendered.push(<div>Group {index + 1}</div>);
      for (let i = 0; i < val; i++) {
        rendered.push(<p>{list[len + i]}</p>);
      }
      len += val;
    });
    return rendered;
  }

  render() {
    const groups = this.renderGroups(this.state.employees);
    return (
      <div>{groups}</div>
    );
  }
}

export default Groups;
