import * as React from 'react';
import { useState } from 'react';
import { Input, Select, Button, Table, DatePicker, Modal } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import Moment from 'moment';
export default function TransportPrfoile(props) {
  console.log(props);
  const [ShowFirmHistory, SetShowFirmHistory] = useState(false);
  const [ShowLocationHistory, SetShowLocationHistory] = useState(false);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
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
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Тип ТС:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            onChange={(TypeId) => {
              props.ProfileHandler('ChangeTransportType', TypeId);
            }}
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
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Модель:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            onChange={(ModelId) => {
              props.ProfileHandler('ChangeModel', ModelId);
            }}
            size="small"
            value={props.Profile.Profile.ModelId}
            style={{ width: '160px' }}
            options={props.Profile.AllModels.map((Type) => {
              return { value: Type.Id, label: Type.Caption };
            })}
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
          Организация:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            value={
              props.Profile.Profile.Owners.length > 0
                ? props.Profile.AllFirms.find((Firm) => {
                    return Firm.Id == props.Profile.Profile.Owners[0].FirmId;
                  }).Caption
                : 'Не указано'
            }
            size="small"
            style={{ width: '135px' }}
          />
          <Button
            icon={ShowFirmHistory ? <CaretUpOutlined /> : <CaretDownOutlined />}
            onClick={() => {
              SetShowFirmHistory(!ShowFirmHistory);
            }}
            size="small"
            type="primary"
          />
        </div>
      </div>
      {ShowFirmHistory ? (
        <>
          <Button
            size="small"
            type="primary"
            style={{ margin: '5px' }}
            onClick={() => {
              props.ProfileHandler('AddFirm');
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
              if (SelectedKey != null) {
                Modal.confirm({
                  onOk: () => {
                    props.ProfileHandler('DeleteFirm');
                  },
                  title: 'Подтвердите действие',
                  content: 'Вы действительно хотите удалить данную запись?',
                  okText: 'Удалить',
                  cancelText: 'Отмена',
                  okButtonProps: {
                    type: 'primary',
                    danger: true,
                    size: 'small',
                  },
                  cancelButtonProps: { size: 'small' },
                });
              }
            }}
          >
            Удалить
          </Button>

          <Table
            rowKey="Key"
            onRow={(Record) => {
              return {
                onClick: () => {
                  SetNewSelectedKey(Record.Key);
                },
              };
            }}
            rowSelection={{
              hideSelectAll: true,
              columnWidth: 0,
              renderCell: () => {
                return null;
              },
              selectedRowKeys: [SelectedKey],
            }}
            pagination={false}
            dataSource={props.Profile.Profile.Owners.map((Owner, Index) => {
              return { Key: Index, TS: Owner.TS, FirmId: Owner.FirmId };
            })}
            size="small"
            columns={[
              {
                width: 180,
                title: 'Дата',
                dataIndex: 'TS',
                key: 'TS',
                render: (Text, Record, Index) => {
                  return (
                    <div style={{ cursor: 'pointer' }}>
                      <DatePicker
                        showTime={true}
                        onOk={(NewDate) => {
                          Modal.confirm({
                            onOk: () => {
                              props.ProfileHandler(
                                'EditFirmDate',
                                NewDate.format(),
                                Index
                              );
                            },
                            title: 'Подтвердите изменение',
                            content: 'Вы действительно хотите изменить дату?',
                            okText: 'Да',
                            okButtonProps: { size: 'small' },
                            cancelButtonProps: { size: 'small' },
                            cancelText: 'Нет',
                          });
                        }}
                        size="small"
                        value={Moment(Text)}
                        format="DD.MM.YYYY hh:mm:ss"
                      />
                    </div>
                  );
                },
              },
              {
                title: 'Наименование',
                dataIndex: 'FirmId',
                key: 'FirmId',
                render: (Text, Record, Index) => {
                  return (
                    <div style={{ cursor: 'pointer' }}>
                      <Select
                        onSelect={(FirmId) => {
                          Modal.confirm({
                            onOk: () => {
                              props.ProfileHandler(
                                'EditFirmCaption',
                                FirmId,
                                Index
                              );
                            },
                            title: 'Подтвердите изменение',
                            content:
                              'Вы действительно хотите изменить организацию?',
                            okText: 'Да',
                            okButtonProps: { size: 'small' },
                            cancelButtonProps: { size: 'small' },
                            cancelText: 'Нет',
                          });
                        }}
                        style={{ width: '160px' }}
                        value={Text}
                        size="small"
                        options={props.Profile.AllFirms.map((Type) => {
                          return { value: Type.Id, label: Type.Caption };
                        })}
                      />
                    </div>
                  );
                },
              },
            ]}
          />
        </>
      ) : null}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Местоположение:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            size="small"
            style={{ width: '135px' }}
            value={props.Profile.Profile.Locations[0].Conditions.Caption}
          />
          <Button
            icon={
              ShowLocationHistory ? <CaretUpOutlined /> : <CaretDownOutlined />
            }
            onClick={() => {
              SetShowLocationHistory(!ShowLocationHistory);
            }}
            size="small"
            type="primary"
          />
        </div>
      </div>
      {ShowLocationHistory ? (
        <>
          <Button
            size="small"
            type="primary"
            style={{ margin: '5px' }}
            onClick={() => {
              props.ProfileHandler('AddFirm');
            }}
          >
            Добавить
          </Button>
          <Button size="small" danger type="primary" style={{ margin: '5px' }}>
            Удалить
          </Button>
          <Table
            pagination={false}
            rowKey="TS"
            dataSource={props.Profile.Profile.Locations.map(
              (Location, Index) => {
                return {
                  ConditonsId: Location.ConditonsId,
                  TS: Location.TS,
                };
              }
            )}
            size="small"
            columns={[
              {
                width: 180,
                render: (Value, Record, Index) => {
                  return (
                    <DatePicker
                      value={Moment(Value)}
                      size="small"
                      format="DD.MM.YYYY hh:mm:ss"
                    />
                  );
                },
                title: 'Дата',
                key: 'TS',
                dataIndex: 'TS',
              },
              {
                render: (Value, Record, Index) => {
                  return props.Profile.AllWorkConditions.find((Conditions) => {
                    return Conditions.Id == Value;
                  }).Caption;
                },
                title: 'Наименование',
                key: 'ConditonsId',
                dataIndex: 'ConditonsId',
              },
            ]}
          />
        </>
      ) : null}
    </>
  );
}
