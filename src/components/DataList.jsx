import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import classNames from 'classnames';
import _ from 'lodash';

import { fieldPropTypes } from './propTypes';

function DataList({ fields, data }) {
  return (
    <div className="user-list">
      <Table>
        <thead>
          <tr className="table-header">
            <th>#</th>
            {fields.map(field =>
              (<th key={field.id}>
                {field.label}
              </th>),
            )}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.map((item, vIndex) =>
              (<tr key={item.id} className={classNames({ darkline: vIndex % 2 === 0 })}>
                <th scope="row">
                  {vIndex + 1}
                </th>
                {fields.map(field =>
                  (<td key={field.id}>
                    {_.get(item, field.key)}
                  </td>),
                )}
                <td />
              </tr>),
            )}
        </tbody>
      </Table>
    </div>
  );
}

DataList.propTypes = {
  fields: fieldPropTypes.isRequired,
  data: PropTypes.array.isRequired,
};

export default DataList;
