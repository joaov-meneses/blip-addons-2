import * as React from 'react';

import { HOME_ITEM_ID } from '~/Constants';

export const HomeItem = (): JSX.Element => {
  return (
    <li id={HOME_ITEM_ID} className="relative">
      <a href="/applications">
        <span className="sidebar-title" style={{ marginLeft: 0 }}>
          Home
        </span>
        <span className="sidebar-subtitle" style={{ marginLeft: 0 }}></span>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            margin: '0.9rem 0.6rem',
          }}
        ></div>
      </a>
    </li>
  );
};
