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
            onChange={(Event) => {
              props.SchemeHandler('ChangeCaption', Event.target.value);
            }}
            size="small"
            style={{ width: '160px' }}
            defaultValue={props.Scheme.Caption}
          />
        </div>
      </div>
      <TextArea
        onChange={(Event) => {
          props.SchemeHandler('ChangeOptions', Event.target.value);
        }}
        rows={7}
        defaultValue={JSON.stringify(props.Scheme.Options)}
      />
    </>
  );
}
