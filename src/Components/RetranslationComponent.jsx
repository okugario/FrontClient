import * as React from 'react';
import { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
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
  const RetranslationHandler = (Operation, Data) => {
    switch (Operation) {
      case 'AddRetranslation':
        SetNewProfile({
          Caption: '',
          Active: false,
          Options: {
            Protocol: { Limit: 50, Name: 'WialonIPS', Pause: 30, Ver: 1 },
            Url: '',
          },
          Objects: [],
        });
        SetNewShowProfile(true);
        break;
    }
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
        width="400px"
        title="Профиль ретранслятора"
        visible={ShowProfile}
        onCancel={() => {
          SetNewShowProfile(false);
        }}
        okButtonProps={{ size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
      >
        <RetranslationProfile Profile={Profile} />
      </Modal>
      <div
        style={{
          width: '200px',
          display: 'flex',
          justifyContent: 'space-evenly',
          marginBottom: '5px',
        }}
      >
        <Button
          size="small"
          type="primary"
          onClick={() => {
            RetranslationHandler('AddRetranslation');
          }}
        >
          Добавить
        </Button>
        <Button size="small" danger type="primary">
          Удалить
        </Button>
      </div>
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
