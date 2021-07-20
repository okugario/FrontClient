import * as React from 'react';
import { DatePicker, Select, Table, Button, Input, TimePicker } from 'antd';
import Moment from 'moment';
export default function DiggerOrderProfile(props) {
  console.log(props);
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
          <DatePicker
            onOk={(Moment) => {}}
            size="small"
            format="DD.MM.YYYY"
            value={Moment(
              props.Profile.Profile.ShiftCode.toString().slice(0, 7)
            )}
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
        <div style={{ display: 'flex', alignItems: 'center' }}>Смена:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            value={props.Profile.Profile.ShiftCode.toString().slice(7)}
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
          <Select
            size="small"
            options={props.Profile.AllWorkConditions}
            value={props.Profile.Profile.ConditionsId}
          />
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
        <Button
          size="small"
          type="primary"
          onClick={() => {
            props.ProfileHandler('AddLoadType');
          }}
        >
          Добавить
        </Button>
        <Button size="small" danger type="primary" onClick={() => {}}>
          Удалить
        </Button>
      </div>
      <Table
        pagination={false}
        rowKey="Key"
        dataSource={props.Profile.Profile.Options.LoadDiggerOrders.map(
          (DiggerOrder, Index) => {
            DiggerOrder.Key = Index;
            return DiggerOrder;
          }
        )}
        size="small"
        columns={[
          {
            title: 'Экскаватор',
            key: 'Digger',
            dataIndex: 'Digger',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  <Select
                    size="small"
                    options={props.Profile.AllDiggers}
                    value={Value}
                  />
                </div>
              );
            },
          },
          {
            title: 'Вид груза',
            key: 'LoadType',
            dataIndex: 'LoadType',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  <Select
                    size="small"
                    value={Value}
                    options={props.Profile.AllLoadTypes}
                  />
                </div>
              );
            },
          },
          {
            title: 'Объем',
            key: 'Value',
            dataIndex: 'Value',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  <Input size="small" value={Value} style={{ width: '50px' }} />
                </div>
              );
            },
          },
          {
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  <TimePicker size="small" value={Moment(Value, 'hh:mm:ss')} />
                </div>
              );
            },
            title: 'Время начала',
            key: 'StartTime',
            dataIndex: 'StartTime',
          },
        ]}
      />
    </>
  );
}
