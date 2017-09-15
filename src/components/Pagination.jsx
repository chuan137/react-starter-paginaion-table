import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const Pages = ({ page, maxPage, onClickPage }) => (
  <Pagination>
    <PaginationItem disabled={page === 0}>
      <PaginationLink previous onClick={() => onClickPage(0)} />
    </PaginationItem>
    {_.range(maxPage + 1).map(i => (
      <PaginationItem active={page === i} key={i}>
        <PaginationLink onClick={() => onClickPage(i)}>
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ))}
    <PaginationItem disabled={page === maxPage}>
      <PaginationLink next onClick={() => onClickPage(maxPage)} />
    </PaginationItem>
  </Pagination>
);

Pages.propTypes = {
  page: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  onClickPage: PropTypes.func.isRequired,
};

export default Pages;
