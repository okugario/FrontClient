import * as React from 'react';
import { DatePicker, Select, Table, Button } from 'antd';
export default function DiggerOrderProfile(props) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Дата:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DatePicker size="small" />
        </div>
      </div>
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Смена:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            size="small"
            options={[
              { value: 1, label: 1 },
              { value: 2, label: 2 },
            ]}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Условия работы:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select size="small" />
        </div>
      </div>
      <div
        style={{
          width: '160px',
          display: 'flex',
          justifyContent: 'space-between',
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
        size="small"
        columns={[
          { title: 'Экскаватор', key: 'Digger', dataIndex: 'Digger' },
          { title: 'Вид груза', key: 'LoadType', dataIndex: 'LoadType' },
          { title: 'Объем', key: 'Value', dataIndex: 'Value' },
          {
            title: 'Время начала',
            key: 'StartTime',
            dataIndex: 'StartTime',
          },
        ]}
      />
    </>
  );
}
