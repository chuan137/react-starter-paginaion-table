import React, { Component } from 'react';
import { fieldPropTypes } from './propTypes';
import serviceApi from '../api/service';
import DataList from './DataList';

export class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: null,
    };
  }

  componentWillMount() {
    serviceApi.fetch().then(response =>
      this.setState({
        data: response,
      }),
    ).catch(error => this.setState({ error }));
  }

  render() {
    return (
      <DataList fields={this.props.fields} data={this.state.data} />
    );
  }
}

DataTable.propTypes = {
  fields: fieldPropTypes.isRequired,
};

export default DataTable;
