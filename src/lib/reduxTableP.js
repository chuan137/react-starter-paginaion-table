/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindRoutineCreators } from 'redux-saga-routines';
import { fetch } from './routines';
import { getTableData, getTableTotal, getTableIsFetching } from '../lib/selectors';
import { pageSize as fetchPageSize } from '../api/service';


export default ({ table }) =>
  (WrappedComponent) => {
    class InnerHocComponent extends React.Component {
      componentWillMount() {
        this.props.fetch.trigger({ table });
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    InnerHocComponent.propTypes = {
      fetch: PropTypes.func.isRequired,
    };

    const ReduxTable = connect((state, ownProps) => ({
      data: getTableData(
        state,
        table,
        ownProps.page * ownProps.pageSize,
        (ownProps.page + 1) * ownProps.pageSize),
      total: getTableTotal(state, table),
      isFetchingData: getTableIsFetching(state, table),
    }), dispatch => ({
      ...bindRoutineCreators({ fetch }, dispatch),
    }))(InnerHocComponent);

    class HocComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          page: 0,
          pageSize: 15,
        };
        this.onChagePage = this.onChagePage.bind(this);
      }

      onChagePage(p) {
        // calculate which page to fetch
        const page = Math.floor((((p + 1) * this.state.pageSize) - 1) / fetchPageSize);
        this.props.fetch.trigger({ table, page });
        this.setState({ page: p });
      }

      render() {
        return (<ReduxTable
          page={this.state.page}
          pageSize={this.state.pageSize}
          onClickPage={this.onChagePage}
          {...this.props}
        />);
      }
    }

    return connect(null, dispatch => ({
      ...bindRoutineCreators({ fetch }, dispatch),
    }))(HocComponent);
  };

