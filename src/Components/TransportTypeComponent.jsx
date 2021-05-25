import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Modal } from 'antd';
import TransportTypeProfile from './TransportTypeProfile';
import { ApiFetch } from '../Helpers/Helpers';
export default function TransportTypeComponent() {
  const [TransportTypeTable, SetNewTransportTypeTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const RequestProfile = () => {
    ApiFetch(
      `model/VehicleTypes/${SelectedKey}`,
      'GET',
      undefined,
      (Response) => {
        SetNewProfile(Response.data);
        SetNewShowProfile(true);
      }
    );
  };
  const RequestTable = () => {
    ApiFetch('model/VehicleTypes', 'GET', undefined, (Response) => {
      SetNewTransportTypeTable(Response.data);
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
        <TransportTypeProfile />
      </Modal>
      <Table
        scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
        rowKey="Id"
        dataSource={TransportTypeTable}
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
      />
    </div>
  );
}
