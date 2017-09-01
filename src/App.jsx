/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import DataTable from './components/DataTable';
import logo from './logo.svg';
import './App.css';

const fields = [
  {
    id: 1,
    key: 'first_name',
    label: 'Frist Name',
  },
  {
    id: 2,
    key: 'last_name',
    label: 'Last Name',
  },
  {
    id: 3,
    key: 'email',
    label: 'Email',
  },
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <DataTable fields={fields} />
      </div>
    );
  }
}

export default App;
