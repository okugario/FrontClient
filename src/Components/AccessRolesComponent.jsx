import * as React from 'react';
import AccessRoleProfileComponent from './AccessRoleProfileComponent';
import { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { Button, Table, Modal } from 'antd';
export default function AccessRolesComponent(props) {
  const [RolesTable, SetNewRolesTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [AccessRoleProfile, SetNewAccessRoleProfile] = useState(null);
  const RequestRolesTable = () => {
    return ApiFetch('model/AccessRoles', 'GET', undefined, (Response) => {
      SetNewRolesTable(
        Response.data.map((Role) => {
          return {
            Rolename: Role.rolename,
            Comment: Role.comment,
            Key: Role.rolename,
          };
        })
      );
    });
  };
  const RequestRole = () => {
    let Profile = {};
    let PromiseArray = [];
    PromiseArray.push(
      ApiFetch(
        `model/AccessRoles/${SelectedKey}`,
        'GET',
        undefined,
        (Response) => {
          if (!('config_categories' in Response.data.options)) {
            Response.data.options.config_categories = [];
          }
          Profile.Profile = Response.data;
        }
      )
    );
    PromiseArray.push(
      ApiFetch('model/ConfigSchemes', 'GET', undefined, (Response) => {
        Profile.ConfigCategoriesAll = Response.data
          .find((Scheme) => {
            return Scheme.Caption == 'ApplicationMenu';
          })
          .Options.items.map((Element) => {
            return { title: Element.caption, key: Element.id };
          });
      })
    );

    return Promise.all(PromiseArray).then(() => {
      SetNewAccessRoleProfile(Profile);
    });
  };
  useEffect(RequestRolesTable, []);
  return (
    <>
      <Modal
        onCancel={() => {
          SetNewShowProfile(false);
        }}
        destroyOnClose={true}
        title="Профиль роли"
        cancelButtonProps={{ size: 'small' }}
        okButtonProps={{ size: 'small', type: 'primary' }}
        visible={ShowProfile}
        okText="Сохранить"
      >
        <AccessRoleProfileComponent Profile={AccessRoleProfile} />
      </Modal>
      <div
        style={{
          width: '200px',
          display: 'flex',
          justifyContent: 'space-evenly',
          marginBottom: '5px',
        }}
      >
        <Button size="small" type="primary">
          Добавить
        </Button>
        <Button size="small" danger type="primary">
          Удалить
        </Button>
      </div>
      <Table
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record.Rolename);
            },
            onDoubleClick: () => {
              RequestRole().then(() => {
                SetNewShowProfile(true);
              });
            },
          };
        }}
        rowSelection={{
          columnWidth: 0,
          selectedRowKeys: [SelectedKey],
          hideSelectAll: true,
          renderCell: () => {
            return null;
          },
        }}
        scroll={{ y: 700 }}
        pagination={false}
        rowKey="Key"
        dataSource={RolesTable}
        size="small"
        columns={[
          {
            title: 'Роль',
            dataIndex: 'Rolename',
            key: 'Rolename',
            render: (Value, Record, index) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
          },
          {
            title: 'Описание',
            dataIndex: 'Comment',
            key: 'Comment',
            render: (Value, Record, index) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
          },
        ]}
      />
    </>
  );
}
