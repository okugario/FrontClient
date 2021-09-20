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
            onChange={(Event) => {
              props.RoleProfileHandler('ChangeCaption', Event.target.value);
            }}
            value={props.Profile.Profile.rolename}
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
          <TextArea
            size="small"
            value={props.Profile.Profile.comment}
            onChange={(Event) => {
              props.RoleProfileHandler('ChangeComment', Event.target.value);
            }}
          />
        </div>
      </div>
      <Collapse>
        <Panel header="Меню пользователя" key="UserMenu">
          <Tree
            onCheck={(Checked) => {
              props.RoleProfileHandler('ChangeCategories', Checked);
            }}
            height={200}
            treeData={props.Profile.ConfigCategoriesAll}
            checkable={true}
            selectable={false}
            checkedKeys={props.Profile.Profile.options.config_categories}
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
            checkedKeys={props.Profile.Profile.options.config_regions}
            onCheck={(Checked) => {
              props.RoleProfileHandler('ChangeRegions', Checked);
            }}
          />
        </Panel>
      </Collapse>
    </>
  );
}
