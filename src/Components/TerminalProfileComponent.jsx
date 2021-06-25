import * as React from 'react';
import { Input, Checkbox, Select } from 'antd';
export default function TerminalProfile(props) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Грузоподъемность:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            size="small"
            style={{ width: '160px' }}
            value={props.Profile.Options.truck.maxweight}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Данные с CAN шины :
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox checked={props.Profile.Options.truck.canweight} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Система давления в шинах :
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select size="small" style={{ width: '160px' }} />
        </div>
      </div>
    </>
  );
}
