import * as React from 'react';
import { useState, useEffect } from 'react';
import { Table, Modal } from 'antd';
import { TableSorter, ApiFetch } from '../Helpers/Helpers';
import RetranslationProfile from './RetranslationProfile';
export default function RetranslationComponent() {
  const [RetranslationTable, SetNewTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const RequestProfile = () => {
    ApiFetch(
      `model/RetransTargets/${SelectedKey}`,
      'GET',
      undefined,
      (Response) => {
        SetNewProfile(Response.data);
        SetNewShowProfile(true);
      }
    );
  };
  const RequestTable = () => {
    ApiFetch('model/RetransTargets', 'GET', undefined, (Response) => {
      SetNewTable(Response.data);
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
        {<RetranslationProfile Profile={Profile} />}
      </Modal>
      <Table
        scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
        rowKey="Id"
        size="small"
        dataSource={RetranslationTable}
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
            defaultSortOrder: 'ascend',
            sorter: TableSorter('Caption'),
            title: 'Наименование',
            dataIndex: 'Caption',
            key: 'Caption',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
          {
            title: 'Включен',
            dataIndex: 'Active',
            key: 'Active',
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
