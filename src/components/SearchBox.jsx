import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputGroupButton } from 'reactstrap';

class SearchBox extends Component {
  handleClick(e) {
    // console.log('clear', this.input.value);
    if (this.input.value) {
      this.input.value = '';
      this.props.reset();
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.onSearch(e.target.value);
      e.target.blur();
    }
  }

  render() {
    return (
      <InputGroup>
        <Input
          type="search"
          placeholder="Search"
          onKeyPress={e => this.handleKeyPress(e)}
          getRef={(input) => { this.input = input; }}
        />
        <InputGroupButton onClick={() => this.handleClick()}>
          Clear
        </InputGroupButton>
      </InputGroup>
    );
  }
}

SearchBox.defaultProps = {
  className: '',
  style: {},
};

SearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default SearchBox;
