/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'reactstrap';
import { fieldPropTypes } from './propTypes';
import DataList from './DataList';
import reduxTable from '../lib/reduxTable';

export class DataTable extends Component {
  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Pagination size={this.props.total} />
        <DataList
          fields={this.props.fields}
          data={this.props.data}
        />
      </div>
    );
  }
}

DataTable.propTypes = {
  fields: fieldPropTypes.isRequired,
  data: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};


export default reduxTable({ table: 'mytable' })(DataTable);
