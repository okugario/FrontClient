import * as React from 'react';
import { Input } from 'antd';
const { TextArea } = Input;
export default function ConfigSchemesProfile(props) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Наименование:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            size="small"
            style={{ width: '160px' }}
            value={props.Scheme.Caption}
          />
        </div>
      </div>
      <TextArea rows={7} defaultValue={JSON.stringify(props.Scheme.Options)} />
    </>
  );
}
