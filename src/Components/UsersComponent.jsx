import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import UserProfile from './UserProfile';

export default function UsersComponent() {
  const [UsersTable, SetNewUsersTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [Profile, SetNewProfile] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const RequestUserTable = () => {
    ApiFetch('/model/Users', 'GET', undefined, (Response) => {
      SetNewUsersTable(Response.data);
    });
  };
  const RequestProfile = () => {
    ApiFetch(`model/Users/${SelectedKey}`, 'GET', undefined, (Response) => {
      SetNewProfile(Response.data);
      SetNewShowProfile(true);
    });
  };
  useEffect(RequestUserTable, []);
  return (
    <div className="FullExtend">
      <Modal
        visible={ShowProfile}
        onCancel={() => {
          SetNewShowProfile(false);
        }}
      >
        <UserProfile />
      </Modal>
      <Table
        scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
        pagination={false}
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record['Username']);
            },
            onDoubleClick: () => {
              RequestProfile();
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
        dataSource={UsersTable}
        size="small"
        columns={[
          {
            title: 'Логин',
            key: 'Username',
            dataIndex: 'Username',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
          {
            title: 'Роль',
            key: 'Rolename',
            dataIndex: 'Rolename',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
          {
            title: 'Доступ',
            key: 'Enabled',
            dataIndex: 'Enabled',
            render: (Record) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  {Record ? 'Включен' : 'Выключен'}
                </div>
              );
            },
          },
        ]}
        rowKey="Username"
      />
    </div>
  );
}
