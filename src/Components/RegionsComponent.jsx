import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
export default function RegionsComponent() {
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [RegionsTable, SetNewRegionsTable] = useState(null);
  const RequestTable = () => {
    ApiFetch('model/Regions', 'GET', undefined, (Response) => {
      SetNewRegionsTable(Response.data);
    });
  };
  useEffect(RequestTable, []);
  return (
    <div className="FullExtend">
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
            onDoubleClick: () => {},
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
