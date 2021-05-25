import * as React from 'react';
import { Checkbox } from 'antd';
export default function CheckListComponent(props) {
  return (
    <div style={{ height: '100px', overflow: 'auto', width: '100%' }}>
      {props.DataSource.map((Item) => {
        return (
          <div key={Item.gid}>
            <Checkbox defaultChecked={Item.include} /> {Item.name}
          </div>
        );
      })}
    </div>
  );
}
