import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import RoleProfile from './RoleProfile';
export default function RolesComponent() {
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const [RolesTable, SetNewRolesTable] = useState(null);
  const RequestProfile = () => {
    ApiFetch(
      `model/AccessRoles/${SelectedKey}`,
      'GET',
      undefined,
      (Response) => {
        SetNewProfile(Response.data);
        SetNewShowProfile(true);
      }
    );
  };
  const RequestTable = () => {
    ApiFetch('model/AccessRoles', 'GET', undefined, (Response) => {
      SetNewRolesTable(Response.data);
    });
  };
  useEffect(RequestTable, []);
  return (
    <div className="FullExtend">
      <Modal
        visible={ShowProfile}
        onCancel={() => {
          SetNewShowProfile(false);
        }}
      >
        <RoleProfile />
      </Modal>
      <Table
        scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
        pagination={false}
        rowSelection={{
          columnWidth: 0,
          selectedRowKeys: [SelectedKey],
          hideSelectAll: true,
          renderCell: () => {
            return null;
          },
        }}
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record['rolename']);
            },
            onDoubleClick: () => {
              RequestProfile();
            },
          };
        }}
        size="small"
        rowKey="rolename"
        dataSource={RolesTable}
        columns={[
          {
            title: 'Наименование',
            id: 'rolename',
            dataIndex: 'rolename',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
          {
            title: 'Комментарий',
            id: 'comment',
            dataIndex: 'comment',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
        ]}
      />
    </div>
  );
}
