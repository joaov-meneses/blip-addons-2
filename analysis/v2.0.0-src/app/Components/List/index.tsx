import * as React from 'react';

export type ListProps = {
    children: React.ReactChild | React.ReactChild[];
};

export const List = ({
    children
}: ListProps): JSX.Element => {
  return (
    <ul style={{fontSize: "0.875rem", marginTop: "0.5rem", color: "#607b99"}}>
        <li>{children}</li>
    </ul>
  );
};
  
