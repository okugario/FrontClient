import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import TransportModelProfile from './TransportModelProfile';
export default function TransportModelComponent() {
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [TransportModelTable, SetNewTransportModelTable] = useState(null);
  const [Profile, SetNewProfile] = useState(null);
  const RequestTable = () => {
    ApiFetch('model/VehicleModels', 'GET', undefined, (Response) => {
      SetNewTransportModelTable(Response.data);
    });
  };
  const RequestProfile = () => {
    ApiFetch(
      `model/VehicleModels/${SelectedKey}`,
      'GET',
      undefined,
      (Response) => {
        SetNewProfile(Response.data);
        SetNewShowProfile(true);
      }
    );
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
        <TransportModelProfile />
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
        rowKey="Id"
        dataSource={TransportModelTable}
        size="small"
        columns={[
          {
            title: 'Наименование',
            id: 'Caption',
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
