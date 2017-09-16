/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fieldPropTypes } from './propTypes';
import Pagination from './Pagination';
import DataList from './DataList';
import reduxTable from '../lib/reduxTableP';
import { userHub } from '../store';

export class DataTable extends Component {
  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Pagination
          page={this.props.page}
          maxPage={Math.ceil(this.props.total / this.props.pageSize) - 1}
          onClickPage={this.props.onClickPage}
        />
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
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onClickPage: PropTypes.func.isRequired,
};

export default reduxTable(userHub)(DataTable);
