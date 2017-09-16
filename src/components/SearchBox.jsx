import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

class SearchBox extends Component {
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.onSearch(e.target.value);
      e.target.blur();
    }
  }

  render() {
    const { style, className } = this.props;
    return (
      <div className={className} style={style}>
        <Input
          type="search"
          placeholder="Search"
          onKeyPress={e => this.handleKeyPress(e)}
        />
      </div>
    );
  }
}

SearchBox.defaultProps = {
  className: '',
  style: {},
};

SearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SearchBox;
