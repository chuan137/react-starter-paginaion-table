/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fieldPropTypes } from './propTypes';
import SearchBox from './SearchBox';
import Pagination from './Pagination';
import DataList from './DataList';
import reduxTable from '../lib/reduxTableP';
import { userHub } from '../store';

const styles = {
  searchBox: {
    width: '20rem', marginBottom: '2rem',
  },
  pagination: {
    marginTop: '2rem',
  },
};

export class DataTable extends Component {
  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <div className="ml-auto" style={styles.searchBox}>
          <SearchBox
            onSearch={v => this.props.setFilter(v)}
            reset={this.props.resetFilter}
          />
        </div>
        <DataList
          fields={this.props.fields}
          data={this.props.data}
        />
        <div style={styles.pagination}>
          <Pagination
            page={this.props.page}
            maxPage={Math.ceil(this.props.total / this.props.pageSize) - 1}
            onClickPage={this.props.onClickPage}
            style={styles.pagination}
          />
        </div>
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
  setFilter: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
};

export default reduxTable(userHub)(DataTable);
