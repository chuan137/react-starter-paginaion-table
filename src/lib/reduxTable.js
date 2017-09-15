import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindRoutineCreators } from 'redux-saga-routines';
import { fetch } from './routines';
import { getTableData, getTableTotal } from '../lib/selectors';

export default ({ table }) =>
  (WrappedComponent) => {
    const mapStateToProps = (state, ownProps) => ({
      data: getTableData(state, table, ownProps.page, ownProps.pageSize),
      total: getTableTotal(state, table),
    });

    const mapDispatchToProps = dispatch => ({
      ...bindRoutineCreators({ fetch }, dispatch),
    });


    class HocComponent extends React.Component {
      componentWillMount() {
        this.props.fetch.trigger({ table });
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    HocComponent.propTypes = {
      fetch: PropTypes.func.isRequired,
    };

    return connect(mapStateToProps, mapDispatchToProps)(HocComponent);
  };

// export default connect(mapStateToProps, mapDispatchToProps)(hoc);
