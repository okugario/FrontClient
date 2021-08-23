import * as React from 'react';
import { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { Button, Table } from 'antd';
export default function AccessRolesComponent(props) {
  const [RolesTable, SetNewRolesTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const RequestRoles = () => {
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
  useEffect(RequestRoles, []);
  return (
    <>
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
          { title: 'Роль', dataIndex: 'Rolename', key: 'Rolename' },
          { title: 'Описание', dataIndex: 'Comment', key: 'Comment' },
        ]}
      />
    </>
  );
}
