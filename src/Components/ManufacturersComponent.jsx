import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import ManufacturerProfile from './ManufacturerProfile';
export default function ManufacturersComponent() {
  const [ManufacturersTable, SetNewManufacturersTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const RequestManufacturers = () => {
    ApiFetch('model/Manufacturers', 'GET', undefined, (Response) => {
      SetNewManufacturersTable(Response.data);
    });
  };
  const RequestProfile = () => {
    ApiFetch(
      `model/Manufacturers/${SelectedKey}`,
      'GET',
      undefined,
      (Response) => {
        SetNewProfile(Response.data);
        SetNewShowProfile(true);
      }
    );
  };
  useEffect(RequestManufacturers, []);
  return (
    <div className="FullExtend">
      <Modal
        visible={ShowProfile}
        onCancel={() => {
          SetNewShowProfile(false);
        }}
      >
        <ManufacturerProfile />
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
              SetNewSelectedKey(Record['Id']);
            },
            onDoubleClick: () => {
              RequestProfile();
            },
          };
        }}
        dataSource={ManufacturersTable}
        rowKey="Id"
        size="small"
        columns={[
          {
            title: 'Наименование',
            key: 'Caption',
            dataIndex: 'Caption',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
        ]}
      />
    </div>
  );
}
