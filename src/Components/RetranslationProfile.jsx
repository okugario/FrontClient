import { Input, Checkbox, Select } from 'antd';
import RetranslationObjectTable from './RetranslationObjectTableComponent';
import * as React from 'react';
export default function RetranslationProfile(props) {
  return (
    <>
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
          <div style={{ display: 'flex', alignItems: 'center' }}>ID:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              disabled
              size="small"
              style={{ width: '100px' }}
              value={props.Profile.Id}
            />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Наименование:
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              onChange={(Event) => {
                props.RetranslationHandler('ChangeCaption', Event.target.value);
              }}
              size="small"
              style={{ width: '100px' }}
              value={props.Profile.Caption}
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>Включен:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={props.Profile.Active}
              onChange={(Event) => {
                props.RetranslationHandler(
                  'ChangeActive',
                  Event.target.checked
                );
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>Адрес:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              size="small"
              style={{ width: '100px' }}
              value={props.Profile.Options.Url}
              onChange={(Event) => {
                props.RetranslationHandler('ChangeUrl', Event.target.value);
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
            }}
          >
            Протокол
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}></div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>Название:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Select
              onChange={(Value) => {
                props.RetranslationHandler('ChangeProtocolName', Value);
              }}
              value={props.Profile.Options.Protocol.Name}
              style={{ width: '150px' }}
              size="small"
              options={[
                { label: 'Wialon IPS', value: 'WialonIPS' },
                {
                  label: 'NIS',
                  value: 'NIS',
                },
                {
                  label: 'Wialon Retranslator',
                  value: 'WialonRetranslator',
                },
              ]}
            />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>Версия:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Select
              onChange={(Value) => {
                props.RetranslationHandler('ChangeProtocolVersion', Value);
              }}
              value={props.Profile.Options.Protocol.Ver}
              style={{ width: '50px' }}
              size="small"
              options={[
                {
                  label: '1',
                  value: 1,
                  title:
                    'Вес с датчиков по аналоговому входу (вес не меньше нуля).Акселерометр не передается.',
                },
                {
                  label: '2',
                  value: 2,
                  title:
                    'Вес с датчиков по аналоговому входу с двумя одинаковыми значениями (вес не меньше единицы)',
                },
                {
                  label: '3',
                  value: 3,
                  title:
                    "Отправляет вес параметром с округлением (вес не может быть меньше нуля, название параметра 'weight')",
                },
                {
                  label: '4',
                  value: 4,
                  title:
                    "Вес отправляется параметром 'sensor1','sensor2 (могут быть меньше нуля)",
                },
              ]}
            />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Число записей:
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              type="number"
              onChange={(Event) => {
                props.RetranslationHandler(
                  'ChangeProtocolLimit',
                  Event.target.valueAsNumber
                );
              }}
              size="small"
              style={{ width: '100px' }}
              value={props.Profile.Options.Protocol.Limit}
            />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>Пауза:</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              type="number"
              onChange={(Event) => {
                props.RetranslationHandler(
                  'ChangeProtocolPause',
                  Event.target.valueAsNumber
                );
              }}
              size="small"
              style={{ width: '100px' }}
              value={props.Profile.Options.Protocol.Pause}
            />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            paddingTop: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
            }}
          >
            Объекты
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}></div>
        </div>
      </div>
      <RetranslationObjectTable
        Objects={props.Profile.Objects}
        RetranslationHandler={props.RetranslationHandler}
      />
    </>
  );
}
