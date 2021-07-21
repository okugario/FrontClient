import * as React from 'react';
import { useState } from 'react';
import {
  DatePicker,
  Select,
  Table,
  Button,
  Input,
  TimePicker,
  Modal,
} from 'antd';
import Moment from 'moment';

export default function DiggerOrderProfile(props) {
  const [SelectedKey, SetNewSelectedKey] = useState(null);

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
            onSelect={(Moment) => {
              props.ProfileHandler('ChangeDate', Moment);
            }}
            size="small"
            format="DD.MM.YYYY"
            value={Moment(
              Math.trunc(props.Profile.Profile.ShiftCode / 10).toString()
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
            onChange={(Value) => {
              props.ProfileHandler('ChangeShift', Value);
            }}
            value={props.Profile.Profile.ShiftCode % 10}
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
            onChange={(Value) => {
              props.ProfileHandler('ChangeWorkConditions', Value);
            }}
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
            props.ProfileHandler('AddLoadDiggerOrder');
          }}
        >
          Добавить
        </Button>
        <Button
          size="small"
          danger
          type="primary"
          onClick={() => {
            if (SelectedKey != null) {
              Modal.confirm({
                title: 'Подтвердите действие',
                okButtonProps: { type: 'primary', size: 'small', danger: true },
                okText: 'Удалить',
                cancelButtonProps: { size: 'small' },
                cancelText: 'Отмена',
                content: 'Вы действительно хотите удалить объект?',
                onOk: () => {
                  props.ProfileHandler(
                    'DeleteLoadDiggerOrder',
                    undefined,
                    SelectedKey
                  );
                },
              });
            }
          }}
        >
          Удалить
        </Button>
      </div>
      <Table
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record['Key']);
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
                    onChange={(Value) => {
                      props.ProfileHandler('ChangeLoadDigger', Value, Index);
                    }}
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
                    onChange={(Value) => {
                      props.ProfileHandler('ChangeLoadType', Value, Index);
                    }}
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
                  <Input
                    size="small"
                    value={Value}
                    style={{ width: '50px' }}
                    onChange={(Event) => {
                      props.ProfileHandler(
                        'ChangeValue',
                        Event.target.value,
                        Index
                      );
                    }}
                  />
                </div>
              );
            },
          },
          {
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  <TimePicker
                    size="small"
                    value={Moment(Value, 'hh:mm:ss')}
                    onOk={(Moment) => {
                      props.ProfileHandler('ChangeOrderDate', Moment, Index);
                    }}
                  />
                </div>
              );
            },
            width: 120,
            title: 'Время начала',
            key: 'StartTime',
            dataIndex: 'StartTime',
          },
        ]}
      />
    </>
  );
}
