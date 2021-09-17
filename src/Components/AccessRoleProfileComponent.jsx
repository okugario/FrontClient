import * as React from 'react';
import { Input, Collapse, Tree } from 'antd';
const { TextArea } = Input;
const { Panel } = Collapse;
export default function AccessRoleProfile(props) {
  console.log(props);
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
            value={props.Profile.Profile.rolename}
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
          <TextArea size="small" value={props.Profile.Profile.comment} />
        </div>
      </div>
      <Collapse>
        <Panel header="Меню пользователя" key="UserMenu">
          <Tree
            height={200}
            treeData={props.Profile.ConfigCategoriesAll}
            checkable={true}
            selectable={false}
          />
        </Panel>
      </Collapse>
      <Collapse>
        <Panel header="Участки" key="Regions">
          <Tree
            height={200}
            treeData={props.Profile.AllRegions}
            checkable={true}
            selectable={false}
          />
        </Panel>
      </Collapse>
    </>
  );
}
