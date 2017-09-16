import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

export default dataHub =>
  (WrappedComponent) => {
    const InnerHocComponent = props => <WrappedComponent {...props} />;

    const ReduxTable = connect((state, ownProps) => ({
      data: dataHub.selectors.getData(state, ownProps),
      total: dataHub.selectors.getTotal(state),
      isFetching: dataHub.selectors.isFetching(state),
    }))(InnerHocComponent);

    class HocComponent extends React.Component {
      constructor(props) {
        super(props);
        this.chagePage = this.chagePage.bind(this);
        this.state = { page: 0, pageSize: 11 };
      }

      componentWillMount() {
        this.props.fetchData(0);
      }

      chagePage(p) {
        // calculate which page to fetch
        const cachePageSize = this.props.cachePageSize;
        const cachePage = Math.floor((((p + 1) * this.state.pageSize) - 1) / cachePageSize);
        this.props.fetchData(cachePage);
        this.setState({ page: p });
      }

      render() {
        const restProps = _.omit(this.props, 'cachePageSize', 'fetchData');
        return (<ReduxTable
          page={this.state.page}
          pageSize={this.state.pageSize}
          onClickPage={this.chagePage}
          {...restProps}
        />);
      }
    }

    HocComponent.propTypes = {
      cachePageSize: PropTypes.number.isRequired,
      fetchData: PropTypes.func.isRequired,
    };

    return connect(state => ({
      cachePageSize: dataHub.selectors.getPageSize(state),
    }), dispatch => ({
      fetchData: page => dispatch(dataHub.fetch({ page })),
    }))(HocComponent);
  };
