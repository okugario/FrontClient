import * as React from 'react';
import { Input, Select, TimePicker, Table } from 'antd';
import Moment from 'moment';
export default function WorkConditionsProfileComponent(props) {
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
            value={Moment(props.Profile.Profile.ShiftStart, 'hh:mm')}
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
            value={props.Profile.Profile.LoadZone}
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
            value={props.Profile.Profile.IdlePay}
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
            value={props.Profile.Profile.Grouping}
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
      <Table size="small" />
    </>
  );
}
