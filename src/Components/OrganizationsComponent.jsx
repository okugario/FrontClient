import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import OrganizationProfile from './OrganizationProfile';
export default function OrganizationsComponent() {
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const [OrganizationsTable, SetNewOrganozationsTable] = useState(null);
  const RequestTable = () => {
    ApiFetch('model/Firms', 'GET', undefined, (Response) => {
      SetNewOrganozationsTable(Response.data);
    });
  };
  const RequestProfile = () => {
    ApiFetch(`model/Firms/${SelectedKey}`, 'GET', undefined, (Response) => {
      SetNewProfile(Response.data);
      SetNewShowProfile(true);
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
        <OrganizationProfile />
      </Modal>
      <Table
        scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
        dataSource={OrganizationsTable}
        size="small"
        rowKey="Id"
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
              SetNewSelectedKey(Record['Id']);
            },
            onDoubleClick: () => {
              RequestProfile();
            },
          };
        }}
        columns={[
          {
            title: 'Наименование',
            id: 'Caption',
            dataIndex: 'Caption',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
          {
            title: 'Собственная организация',
            id: 'Own',
            dataIndex: 'Own',
            render: (Record) => {
              return (
                <div style={{ cursor: 'pointer' }}>{Record ? 'Да' : 'Нет'}</div>
              );
            },
          },
        ]}
      />
    </div>
  );
}
