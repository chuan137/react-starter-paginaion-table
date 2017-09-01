import PropTypes from 'prop-types';

export const fieldPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.string,
  }),
);

export default fieldPropTypes;
