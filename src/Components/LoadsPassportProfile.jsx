import * as React from 'react';
import { useState } from 'react';
import { Select, Table, Button, Input, Modal } from 'antd';

export default function LoadsPassportProfile(props) {
  console.log(props);
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
          Условия работы:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            onChange={(Value) => {
              props.ProfileHandler('ChangeWorkConditions', Value);
            }}
            value={props.Profile.Profile.ConditonsId}
            size="small"
            style={{ width: '160px' }}
            options={props.Profile.AllWorkConditions.map((WorkCondition) => {
              return { value: WorkCondition.Id, label: WorkCondition.Caption };
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
          Модель экскаватора:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            onChange={(Value) => {
              props.ProfileHandler('ChangeDiggerModel', Value);
            }}
            value={props.Profile.Profile.DiggerModelId}
            size="small"
            style={{ width: '160px' }}
            options={props.Profile.AllDiggerModels.map((DiggerModel) => {
              return { value: DiggerModel.Id, label: DiggerModel.Caption };
            })}
          />
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
            props.ProfileHandler('AddStandart');
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
                content: 'Вы действительно хотите удалить объект?',
                okButtonProps: { type: 'primary', size: 'small', danger: true },
                okText: 'Удалить',
                onOk: () => {
                  props.ProfileHandler('DeleteStandart', SelectedKey);
                },
                cancelButtonProps: { size: 'small' },
                cancelText: 'Отмена',
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
            onDoubleClick: () => {},
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
        rowKey="Key"
        size="small"
        pagination={false}
        dataSource={props.Profile.Profile.Options.Trucks.map((Truck, Index) => {
          return {
            Key: Index,
            LoadTypeId: Truck.LoadTypeId,
            TruckModelId: Truck.TruckModelId,
            Volume: Truck.Volume,
            Weight: Truck.Weight,
          };
        })}
        columns={[
          {
            title: 'Модель самосвала',
            key: 'TruckModelId',
            dataIndex: 'TruckModelId',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  <Select
                    value={Value}
                    onChange={(Value) => {
                      props.ProfileHandler('ChangeTruckModel', Value, Index);
                    }}
                    size="small"
                    style={{ width: '160px' }}
                    options={props.Profile.AllTruckModels.map((Model) => {
                      return { value: Model.Id, label: Model.Caption };
                    })}
                  />
                </div>
              );
            },
          },
          {
            title: 'Вид груза',
            key: 'LoadTypeId',
            dataIndex: 'LoadTypeId',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  <Select
                    style={{ width: '140px' }}
                    onChange={(Value) => {
                      props.ProfileHandler('ChangeLoadType', Value, Index);
                    }}
                    value={Value}
                    size="small"
                    options={props.Profile.AllLoadTypes.map((Type) => {
                      return { value: Type.Id, label: Type.Caption };
                    })}
                  />
                </div>
              );
            },
          },
          {
            title: 'Объем',
            key: 'Volume',
            dataIndex: 'Volume',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  <Input
                    size="small"
                    value={Value}
                    onChange={(Event) => {
                      props.ProfileHandler(
                        'ChangeVolume',
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
            title: 'Вес',
            key: 'Weight',
            dataIndex: 'Weight',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  <Input
                    size="small"
                    value={Value}
                    onChange={(Event) => {
                      props.ProfileHandler(
                        'ChangeWeight',
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
      />
    </>
  );
}
