import * as React from 'react';
import { Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
export default function VehicleModelsComponent(props) {
  const [ModelsTable, SetNewModelsTable] = useState(null);
  const RequestModels = () => {
    ApiFetch('model/VehicleModels', 'GET', undefined, (Response) => {
      SetNewModelsTable(Response.data);
    });
  };
  useEffect(RequestModels, []);
  return (
    <Table
      scroll={{ y: 700 }}
      pagination={false}
      dataSource={ModelsTable}
      rowKey="Key"
      size="small"
      columns={[
        {
          title: 'Модель',
          dataIndex: 'Caption',
          key: 'Caption',
        },
        {
          title: 'Производитель',
          dataIndex: 'ManftId',
          key: 'ManftId',
          render: (Value) => <Select size="small" value={Value} />,
        },

        {
          title: 'Тип транспорта',
          dataIndex: 'TypeId',
          key: 'TypeId',
          render: (Value) => <Select size="small" value={Value} />,
        },
      ]}
    />
  );
}
