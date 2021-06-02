import * as React from 'react';
import { Input, Select } from 'antd';
export default function TransportPrfoile(props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Наименование:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            size="small"
            style={{ width: '160px' }}
            value={props.Profile.Profile.caption}
          />
        </div>
      </div>
      <div
        style={{
          paddingTop: '10px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Номер АТ:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            size="small"
            style={{ width: '160px' }}
            disabled
            value={props.Profile.Profile.Id}
          />
        </div>
      </div>
      <div
        style={{
          paddingTop: '10px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Тип ТС:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            size="small"
            value={props.Profile.Profile.Model.TypeId}
            style={{ width: '160px' }}
            options={props.Profile.AllTypes.map((Type) => {
              return { value: Type.Id, label: Type.Caption };
            })}
          />
        </div>
      </div>
      <div
        style={{
          paddingTop: '10px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Модель:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            size="small"
            value={props.Profile.Profile.Model.Id}
            style={{ width: '160px' }}
            options={props.Profile.AllModels.map((Type) => {
              return { value: Type.Id, label: Type.Caption };
            })}
          />
        </div>
      </div>
      <div
        style={{
          paddingTop: '10px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Организация:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            size="small"
            style={{ width: '160px' }}
            options={props.Profile.AllFirms.map((Type) => {
              return { value: Type.Id, label: Type.Caption };
            })}
          />
        </div>
      </div>
    </div>
  );
}
