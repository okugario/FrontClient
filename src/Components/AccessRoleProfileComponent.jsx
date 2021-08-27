import * as React from 'react';
import { Input, Collapse, Tree } from 'antd';
const { TextArea } = Input;
const { Panel } = Collapse;
export default function AccessRoleProfile(props) {
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
            value={props.Profile.rolename}
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
          <TextArea size="small" value={props.Profile.comment} />
        </div>
      </div>
      <Collapse>
        <Panel header="Меню пользователя" key="UserMenu">
          <Tree />
        </Panel>
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
