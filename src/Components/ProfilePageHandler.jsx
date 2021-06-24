import * as React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
export default function ProfilePageHandler(props) {
  return (
    <div style={{ display: 'flex' }}>
      {props.BackIcon ? (
        <div style={{ width: '20px' }}>
          <ArrowLeftOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => {
              props.ProfileHandler('ChangeProfileMode', {
                Mode: 'TransportProfile',
                Title: 'Профиль транспорта',
              });
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
