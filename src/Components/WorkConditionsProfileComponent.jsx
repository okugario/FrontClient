import * as React from 'react';
import { Input, Select, DatePicker } from 'antd';
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
          <Input size="small" style={{ width: '160px' }} />
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
          <Select size="small" style={{ width: '160px' }} />
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
          <Select size="small" style={{ width: '160px' }} />
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
          <Select size="small" style={{ width: '160px' }} />
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
          <DatePicker size="small" style={{ width: '160px' }} showTime={true} />
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
          <Input size="small" style={{ width: '160px' }} />
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
          <Input size="small" style={{ width: '160px' }} />
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
          <Select size="small" style={{ width: '160px' }} />
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
    </>
  );
}
