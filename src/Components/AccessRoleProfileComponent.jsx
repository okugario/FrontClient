import * as React from 'react';
import { Input, Collapse } from 'antd';
const { TextArea } = Input;
const { Panel } = Collapse;
export default function AccessRoleProfile() {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Роль:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            onChange={(Event) => {}}
            size="small"
            style={{ width: '160px' }}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Пояснение:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextArea size="small" />
        </div>
      </div>
      <Collapse>
        <Panel header="Меню пользователя" key="UserMenu"></Panel>
      </Collapse>
      <Collapse>
        <Panel header="Справочники" key="ConfigCategories"></Panel>
      </Collapse>
      <Collapse>
        <Panel header="Участки" key="Regions"></Panel>
      </Collapse>
    </>
  );
}
