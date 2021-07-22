import * as React from 'react';
import { useState } from 'react';
import {
  Input,
  Checkbox,
  Select,
  Table,
  Button,
  DatePicker,
  Modal,
} from 'antd';
import Moment from 'moment';

export default function TerminalProfile(props) {
  const [SelectedSensorKey, SetNewSelectedSensorKey] = useState(null);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Транспортное средство:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            disabled={true}
            size="small"
            style={{ width: '160px' }}
            value={props.TransportCaption}
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
        <div style={{ display: 'flex', alignItems: 'center' }}>Дата:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DatePicker
            onOk={(Value) => {
              props.ProfileHandler('ChangeEquipmentDate', Value.format());
            }}
            format="DD.MM.YYYY hh:mm:ss"
            size="small"
            showTime={true}
            value={Moment(props.TerminalProfile.TS)}
            style={{ width: '160px' }}
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
        <div style={{ display: 'flex', alignItems: 'center' }}>ID:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            onChange={(Event) => {
              props.ProfileHandler('ChangeTerminalID', Event.target.value);
            }}
            size="small"
            style={{ width: '160px' }}
            value={props.TerminalProfile.ObjectId}
          />
        </div>
      </div>
      {Object.keys(props.TerminalProfile.UnitProfile.Options).length > 0 ? (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              Грузоподъемность:
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                onChange={(Event) => {
                  props.ProfileHandler('ChangeMaxWeight', Event.target.value);
                }}
                size="small"
                style={{ width: '160px' }}
                value={
                  props.TerminalProfile.UnitProfile.Options.truck.maxweight
                }
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              Данные с CAN шины :
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={
                  props.TerminalProfile.UnitProfile.Options.truck.canweight
                }
                onChange={(Event) => {
                  props.ProfileHandler('ChangeCanData', Event.target.checked);
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              Система давления в шинах :
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Select
                size="small"
                value={
                  props.TerminalProfile.UnitProfile.Options.truck.tyresystem
                }
                style={{ width: '160px' }}
                onChange={(Value) => {
                  props.ProfileHandler('ChangeTyreSystem', Value);
                }}
                options={[
                  { value: 'skt', label: 'СКТ' },
                  { value: 'parkm', label: 'ParkMaster' },
                  { value: 'presspro', label: 'Pressure Pro' },
                  { value: 'none', label: 'Не установлена' },
                ]}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
            <span> Датчики давления в подвеске</span>
            <div>
              <Button
                size="small"
                type="primary"
                style={{ marginLeft: '5px' }}
                onClick={() => {
                  props.ProfileHandler('AddSensor');
                }}
              >
                Добавить
              </Button>
              <Button
                size="small"
                danger
                type="primary"
                style={{ margin: '5px' }}
                onClick={() => {
                  if (SelectedSensorKey != null) {
                    Modal.confirm({
                      onOk: () => {
                        props.ProfileHandler(
                          'DeleteSensor',
                          undefined,
                          SelectedSensorKey
                        );
                        SetNewSelectedSensorKey(null);
                      },
                      title: 'Подтвердите действие',
                      content: 'Удалить данный датчик?',
                      cancelButtonProps: { size: 'small' },
                      okButtonProps: { size: 'small', danger: true },
                      okText: 'Удалить',
                      cancelText: 'Отмена',
                    });
                  }
                }}
              >
                Удалить
              </Button>
            </div>
          </div>
          <Table
            rowSelection={{
              selectedRowKeys: [SelectedSensorKey],
              hideSelectAll: true,
              renderCell: () => {
                return null;
              },
            }}
            onRow={(Record) => {
              return {
                onClick: () => {
                  SetNewSelectedSensorKey(Record.Key);
                },
              };
            }}
            pagination={false}
            rowKey="Key"
            dataSource={props.TerminalProfile.UnitProfile.Options.truck.inputs.map(
              (Sensor, Index) => {
                return { Key: Index, id: Sensor.id, k: Sensor.k };
              }
            )}
            columns={[
              {
                title: 'Номер входа',
                key: 'id',
                dataIndex: 'id',
                render: (Value, Record, Index) => {
                  return (
                    <div style={{ cursor: 'pointer' }}>
                      <Select
                        onChange={(Value) => {
                          props.ProfileHandler(
                            'ChangeSensorEnterNumber',
                            Value,
                            Index
                          );
                        }}
                        size="small"
                        value={Value}
                        options={[
                          { value: 0, label: 1 },
                          { value: 1, label: 2 },
                          { value: 2, label: 3 },
                          { value: 3, label: 4 },
                          { value: 4, label: 5 },
                          { value: 5, label: 6 },
                          { value: 6, label: 7 },
                          { value: 7, label: 8 },
                        ]}
                      />
                    </div>
                  );
                },
              },
              {
                title: 'Множитель',
                key: 'k',
                dataIndex: 'k',
                render: (Value, Record, Index) => {
                  return (
                    <div style={{ cursor: 'pointer' }}>
                      <Input
                        size="small"
                        value={Value}
                        style={{ width: '50px' }}
                        onChange={(Event) => {
                          props.ProfileHandler(
                            'ChangeSensorMultiplier',
                            Event.target.value,
                            Index
                          );
                        }}
                      />
                    </div>
                  );
                },
              },
            ]}
            size="small"
          />
        </>
      ) : null}
    </>
  );
}
