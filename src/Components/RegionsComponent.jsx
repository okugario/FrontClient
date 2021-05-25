import * as React from 'react';
import { useEffect, useState } from 'react';
import RegionProfile from './RegionProfile';
import { Table, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
export default function RegionsComponent() {
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [RegionsTable, SetNewRegionsTable] = useState(null);
  const [Profile, SetNewProfile] = useState(null);
  const RequestTable = () => {
    ApiFetch('model/Regions', 'GET', undefined, (Response) => {
      SetNewRegionsTable(Response.data);
    });
  };
  const RequestProfile = () => {
    ApiFetch(`model/Regions/${SelectedKey}`, 'GET', undefined, (Response) => {
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
        <RegionProfile />
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
        dataSource={RegionsTable}
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
