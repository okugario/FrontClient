import * as React from 'react';
import { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { Table, Modal, Button } from 'antd';
import ConfigSchemesProfile from './ConfigSchemesProfile';
export default function ConfigSchemesComponent() {
  const [SchemesTable, SetNewSchemesTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Scheme, SetNewScheme] = useState(null);
  const RequestScheme = (SchemeId) => {
    return ApiFetch(
      `model/ConfigSchemes/${SchemeId}`,
      'GET',
      undefined,
      (Response) => {
        SetNewScheme(Response.data);
      }
    );
  };
  const RequestSchemesTable = () => {
    ApiFetch('model/ConfigSchemes', 'GET', undefined, (Response) => {
      SetNewSchemesTable(Response.data);
    });
  };
  useEffect(RequestSchemesTable, []);
  return (
    <>
      <Modal
        okText="Сохранить"
        onCancel={() => {
          SetNewShowProfile(false);
        }}
        title="Схема настроек"
        visible={ShowProfile}
        cancelButtonProps={{ size: 'small' }}
        okButtonProps={{ size: 'small' }}
      >
        <ConfigSchemesProfile Scheme={Scheme} />
      </Modal>
      <div
        style={{
          width: '200px',
          display: 'flex',
          justifyContent: 'space-evenly',
          marginBottom: '5px',
        }}
      >
        <Button size="small" type="primary" onClick={() => {}}>
          Добавить
        </Button>
        <Button size="small" danger type="primary" onClick={() => {}}>
          Удалить
        </Button>
      </div>
      <Table
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record.Id);
            },
            onDoubleClick: () => {
              RequestScheme(Record.Id).then(() => {
                SetNewShowProfile(true);
              });
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
        rowKey="Id"
        pagination={false}
        dataSource={SchemesTable}
        size="small"
        columns={[
          {
            title: 'Наименование',
            dataIndex: 'Caption',
            key: 'Caption',
            render: (Value) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
          },
        ]}
      />
    </>
  );
}
