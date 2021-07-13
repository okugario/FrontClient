import * as React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
export default function ProfilePageHandler(props) {
  return (
    <div style={{ display: 'flex' }}>
      {props.ShowBackIcon ? (
        <div style={{ width: '20px' }}>
          <ArrowLeftOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => {
              props.OnBack();
            }}
          />
        </div>
      ) : (
        <div style={{ width: '20px' }} />
      )}
      {props.Title}
    </div>
  );
}
