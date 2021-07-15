import * as React from 'react';
import { Input, Select, TimePicker, Table, Button } from 'antd';
import { DashOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Moment from 'moment';
export default function WorkConditionsProfile(props) {
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Наименование:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            onChange={(Event) => {
              props.ProfileHandler('ChangeCaption', Event.target.value);
            }}
            size="small"
            style={{ width: '160px' }}
            value={props.Profile.Profile.Caption}
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
        <div style={{ display: 'flex', alignItems: 'center' }}>Подрядчик:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            value={props.Profile.Profile.ContractorId}
            size="small"
            style={{ width: '160px' }}
            onChange={(Value) => {
              props.ProfileHandler('ChangeContractor', Value);
            }}
            options={props.Profile.AllFirms}
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
        <div style={{ display: 'flex', alignItems: 'center' }}>Заказчик:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            onChange={(Value) => {
              props.ProfileHandler('ChangeCustomer', Value);
            }}
            value={props.Profile.Profile.CustomerId}
            size="small"
            style={{ width: '160px' }}
            options={props.Profile.AllFirms}
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
        <div style={{ display: 'flex', alignItems: 'center' }}>Участок:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            onChange={(Value) => {
              props.ProfileHandler('ChangeRegion', Value);
            }}
            value={props.Profile.Profile.RegionId}
            size="small"
            style={{ width: '160px' }}
            options={props.Profile.AllRegions}
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
          Начало смены:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TimePicker
            size="small"
            style={{ width: '160px' }}
            showTime={true}
            showSecond={false}
            format="hh:mm"
            onOk={(Value) => {
              props.ProfileHandler('ChangeShiftStart', Value.format('hh:mm'));
            }}
            value={Moment(props.Profile.Profile.Options.ShiftStart, 'hh:mm')}
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
          Зона погрузки:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            onChange={(Event) => {
              props.ProfileHandler('ChangeLoadZone', Event.target.value);
            }}
            size="small"
            style={{ width: '160px' }}
            value={props.Profile.Profile.Options.LoadZone}
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
          Простой с оплатой:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            onChange={(Event) => {
              props.ProfileHandler('ChangeIdlePay', Event.target.value);
            }}
            size="small"
            style={{ width: '160px' }}
            value={props.Profile.Profile.Options.IdlePay}
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
          Группировка рейсов:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            onChange={(Value) => {
              props.ProfileHandler('ChangeGrouping', Value);
            }}
            size="small"
            value={props.Profile.Profile.Options.Grouping}
            style={{ width: '160px' }}
            options={[
              { value: 'By50', label: 'По 50' },
              { value: 'By100', label: 'По 100' },
              { value: 'ByRate', label: 'По тарифу' },
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
          Тариф по времени:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input size="small" style={{ width: '160px' }} disabled={true} />
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
          Тариф оплаты:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input disabled={true} size="small" style={{ width: '160px' }} />
        </div>
      </div>
      <div
        style={{
          width: '160px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '5px',
        }}
      >
        <Button
          size="small"
          type="primary"
          onClick={() => {
            props.ProfileHandler('AddPassport');
          }}
        >
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
              SetNewSelectedKey(Record['Key']);
            },
          };
        }}
        pagination={false}
        rowSelection={{
          columnWidth: 0,
          selectedRowKeys: [SelectedKey],
          hideSelectAll: true,
          renderCell: () => {
            return null;
          },
        }}
        rowKey="Key"
        size="small"
        dataSource={props.Profile.Profile.DiggerPassports.map(
          (Passport, Index) => {
            return {
              Key: Index,
              TS: Passport.TS,
              DiggerModelId: props.Profile.AllDiggerModels.find((Model) => {
                return Model.Id == Passport.DiggerModelId;
              }).Caption,
            };
          }
        )}
        columns={[
          {
            title: 'Время',
            dataIndex: 'TS',
            key: 'TS',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  {Moment(Value).format('DD:MM:YYYY hh:mm:ss')}
                </div>
              );
            },
          },
          {
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  {Value}
                  <Button
                    onClick={() => {
                      props.ProfileHandler(
                        'RequestLoadsPassport',
                        undefined,
                        Index
                      );
                    }}
                    size="small"
                    type="primary"
                    icon={<DashOutlined />}
                    style={{ marginLeft: '10px' }}
                  />
                </div>
              );
            },
            title: 'Модель экскаватора',
            dataIndex: 'DiggerModelId',
            key: 'DiggerModelId',
          },
        ]}
      />
    </>
  );
}
