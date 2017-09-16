import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default dataHub =>
  (WrappedComponent) => {
    const InnerHocComponent = props => <WrappedComponent {...props} />;

    const ReduxTable = connect((state, ownProps) => {
      const start = ownProps.page * ownProps.pageSize;
      const end = start + ownProps.pageSize;
      return ({
        data: dataHub.selectors.getData(state, start, end),
        total: dataHub.selectors.getTotal(state),
        isFetching: dataHub.selectors.isFetching(state),
      });
    })(InnerHocComponent);

    class HocComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          page: 0,
          pageSize: 15,
        };
        this.chagePage = this.chagePage.bind(this);
      }

      componentWillMount() {
        this.props.fetchUser(0);
      }

      chagePage(p) {
        this.setState({ page: p });
        // calculate which page to fetch
        const cachePageSize = this.props.cachePageSize;
        const cachePage = Math.floor((((p + 1) * this.state.pageSize) - 1) / cachePageSize);
        this.props.fetchUser(cachePage);
      }

      render() {
        const { cachePageSize, fetchUser, ...restProps } = this.props;

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
      fetchUser: PropTypes.func.isRequired,
    };

    return connect(state => ({
      cachePageSize: dataHub.selectors.getPageSize(state),
    }), dispatch => ({
      fetchUser: page => dispatch(dataHub.fetch({ page })),
    }))(HocComponent);
  };
