import * as React from 'react';
import { useState } from 'react';
import { Input, Select, Button, Table, DatePicker, Modal } from 'antd';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DashOutlined,
} from '@ant-design/icons';
import Moment from 'moment';

export default function TransportPrfoile(props) {
  const [ShowFirmHistory, SetShowFirmHistory] = useState(false);
  const [ShowLocationHistory, SetShowLocationHistory] = useState(false);
  const [ShowEquipmentHistory, SetShowShowEquipmentHistory] = useState(false);
  const [SelectedFirmKey, SetNewSelectedFirmKey] = useState(null);
  const [SelectedLocationKey, SetNewSelectedLocationKey] = useState(null);
  const [SelectedEquipmentKey, SetNewSelectedEquipmentKey] = useState(null);

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
            options={props.Profile.AllModels.map((Model) => {
              return {
                value: Model.Id,
                label: Model.Caption,
                type: Model.TypeId,
              };
            }).filter((Model) => {
              return Model.type == props.Profile.Profile.Model.TypeId;
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
              if (SelectedFirmKey != null) {
                Modal.confirm({
                  onOk: () => {
                    props.ProfileHandler(
                      'DeleteFirm',
                      undefined,
                      SelectedFirmKey
                    );
                    SetNewSelectedFirmKey(null);
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
                  SetNewSelectedFirmKey(Record.Key);
                },
              };
            }}
            rowSelection={{
              hideSelectAll: true,
              columnWidth: 0,
              renderCell: () => {
                return null;
              },
              selectedRowKeys: [SelectedFirmKey],
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
                  );
                },
              },
              {
                title: 'Наименование',
                dataIndex: 'FirmId',
                key: 'FirmId',
                render: (Text, Record, Index) => {
                  return (
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
            value={
              props.Profile.Profile.Locations.length != 0
                ? props.Profile.AllWorkConditions.find((Condition) => {
                    return (
                      Condition.Id ==
                      props.Profile.Profile.Locations[0].ConditonsId
                    );
                  }).Caption
                : 'Не указано'
            }
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
              props.ProfileHandler('AddLocation');
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
              if (SelectedLocationKey != null) {
                Modal.confirm({
                  okText: 'Удалить',
                  onOk: () => {
                    props.ProfileHandler(
                      'DeleteLocation',
                      undefined,
                      SelectedLocationKey
                    );
                    SetNewSelectedLocationKey(null);
                  },
                  okButtonProps: {
                    type: 'primary',
                    danger: true,
                    size: 'small',
                  },
                  cancelText: 'Отмена',
                  cancelButtonProps: { size: 'small' },
                  title: 'Подтвердите действие',
                  content: 'Вы действительно хотите удалить данную запись?',
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
                  SetNewSelectedLocationKey(Record.Key);
                },
              };
            }}
            rowSelection={{
              hideSelectAll: true,
              columnWidth: 0,
              renderCell: () => {
                return null;
              },
              selectedRowKeys: [SelectedLocationKey],
            }}
            pagination={false}
            dataSource={props.Profile.Profile.Locations.map(
              (Location, Index) => {
                return {
                  Key: Index,
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
                      onOk={(Time) => {
                        Modal.confirm({
                          onOk: () => {
                            props.ProfileHandler(
                              'EditLocationDate',
                              Time.format(),
                              Index
                            );
                          },
                          okButtonProps: { type: 'primary', size: 'small' },
                          okText: 'Да',
                          cancelText: 'Нет',
                          cancelButtonProps: { size: 'small' },
                          title: 'Подтвердите действие',
                          content: 'Вы действительно хотите изменить дату?',
                        });
                      }}
                      showTime={true}
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
                  return (
                    <Select
                      style={{ width: '160px' }}
                      onChange={(Value) => {
                        Modal.confirm({
                          onOk: () => {
                            props.ProfileHandler(
                              'EditLocationCaption',
                              Value,
                              Index
                            );
                          },
                          okButtonProps: { type: 'primary', size: 'small' },
                          okText: 'Да',
                          cancelText: 'Нет',
                          cancelButtonProps: { size: 'small' },
                          title: 'Подтвердите действие',
                          content:
                            'Вы действительно хотите изменить условия местоположение?',
                        });
                      }}
                      value={Value}
                      size="small"
                      options={props.Profile.AllWorkConditions.map(
                        (Condition) => {
                          return {
                            value: Condition.Id,
                            label: Condition.Caption,
                          };
                        }
                      )}
                    />
                  );
                },
                title: 'Наименование',
                key: 'ConditonsId',
                dataIndex: 'ConditonsId',
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
          Оборудование:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            size="small"
            style={{ width: '135px' }}
            value={
              props.Profile.Profile.Equipments.length > 0
                ? props.Profile.Profile.Equipments[0].ObjectId
                : 'Не указано'
            }
          />
          <Button
            onClick={() => {
              SetShowShowEquipmentHistory(!ShowEquipmentHistory);
            }}
            size="small"
            type="primary"
            icon={
              ShowEquipmentHistory ? <CaretUpOutlined /> : <CaretDownOutlined />
            }
          />
        </div>
      </div>
      {ShowEquipmentHistory ? (
        <>
          <Button
            size="small"
            type="primary"
            style={{ margin: '5px' }}
            onClick={() => {
              props.ProfileHandler(
                'AddEquipment',
                undefined,
                props.Profile.Profile.Equipments.length
              );
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
              if (SelectedEquipmentKey != null) {
                Modal.confirm({
                  okText: 'Удалить',
                  cancelText: 'Отмена',
                  okButtonProps: { size: 'small', danger: true },
                  cancelButtonProps: { size: 'small' },
                  title: 'Подтвердите действие',
                  content: 'Вы действительно хотите удалить данную запись?',
                  onOk: () => {
                    props.ProfileHandler(
                      'DeleteEquipment',
                      undefined,
                      SelectedEquipmentKey
                    );
                    SetNewSelectedEquipmentKey(null);
                  },
                });
              }
            }}
          >
            Удалить
          </Button>
          <Table
            pagination={false}
            onRow={(Record) => {
              return {
                onClick: () => {
                  SetNewSelectedEquipmentKey(Record.Key);
                },
              };
            }}
            rowSelection={{
              hideSelectAll: true,
              columnWidth: 0,
              renderCell: () => {
                return null;
              },
              selectedRowKeys: [SelectedEquipmentKey],
            }}
            rowKey="Key"
            size="small"
            dataSource={props.Profile.Profile.Equipments.map(
              (Equipment, Index) => {
                return {
                  Key: Index,
                  TS: Equipment.TS,
                  ObjectId: Equipment.ObjectId,
                  TerminalID: Equipment.UnitProfileID,
                };
              }
            )}
            columns={[
              {
                title: 'Дата',
                key: 'TS',
                dataIndex: 'TS',
                render: (Text, Record, Index) => {
                  return (
                    <div style={{ cursor: 'pointer' }}>
                      {Moment(Text).format('DD.MM.YYYY hh:mm:ss')}
                    </div>
                  );
                },
              },
              {
                title: 'ID терминала',
                key: 'ObjectId',
                dataIndex: 'ObjectId',
                render: (Text, Record, Index) => {
                  return (
                    <div
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      {Text}
                      <Button
                        onClick={() => {
                          props.ProfileHandler(
                            'ChangeProfileMode',
                            {
                              Mode: 'TerminalProfile',
                              Title: 'Профиль терминала',
                            },
                            Index
                          );
                        }}
                        size="small"
                        type="primary"
                        icon={<DashOutlined />}
                      />
                    </div>
                  );
                },
              },
            ]}
          />
        </>
      ) : null}
    </>
  );
}
