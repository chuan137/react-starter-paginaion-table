import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userHub } from '../store';


export default () =>
  (WrappedComponent) => {
    const InnerHocComponent = props => <WrappedComponent {...props} />;

    const ReduxTable = connect((state, ownProps) => {
      const start = ownProps.page * ownProps.pageSize;
      const end = start + ownProps.pageSize;
      return ({
        data: userHub.selectors.getData(state, start, end),
        total: userHub.selectors.getTotal(state),
        isFetching: userHub.selectors.isFetching(state),
      });
    })(InnerHocComponent);

    class HocComponent extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          page: 0,
          pageSize: 15,
        };
        this.onChagePage = this.onChagePage.bind(this);
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
        return (<ReduxTable
          page={this.state.page}
          pageSize={this.state.pageSize}
          onClickPage={this.chagePage}
          {...this.props}
        />);
      }
    }

    HocComponent.propTypes = {
      cachePageSize: PropTypes.number.isRequired,
      fetchUser: PropTypes.func.isRequired,
    };

    return connect(state => ({
      cachePageSize: userHub.selectors.getPageSize(state),
    }), dispatch => ({
      fetchUser: page => dispatch(userHub.fetch({ page })),
    }))(HocComponent);
  };

