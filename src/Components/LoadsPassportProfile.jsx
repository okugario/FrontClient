import * as React from 'react';
import { Select, Table, Button, Input } from 'antd';
export default function LoadsPassportProfile(props) {
  console.log(props);
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
        <Button size="small" type="primary" onClick={() => {}}>
          Добавить
        </Button>
        <Button size="small" danger type="primary" onClick={() => {}}>
          Удалить
        </Button>
      </div>
      <Table
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
            render: (Value) => {
              return (
                <Select
                  value={Value}
                  size="small"
                  style={{ width: '160px' }}
                  options={props.Profile.AllTruckModels.map((Model) => {
                    return { value: Model.Id, label: Model.Caption };
                  })}
                />
              );
            },
          },
          {
            title: 'Вид груза',
            key: 'LoadTypeId',
            dataIndex: 'LoadTypeId',
            render: (Value) => {
              return (
                <Select
                  value={Value}
                  size="small"
                  style={{ width: '160px' }}
                  options={props.Profile.AllLoadTypes.map((Type) => {
                    return { value: Type.Id, label: Type.Caption };
                  })}
                />
              );
            },
          },
          {
            title: 'Объем',
            key: 'Volume',
            dataIndex: 'Volume',
            render: (Value) => {
              return <Input size="small" value={Value} />;
            },
          },
          {
            title: 'Вес',
            key: 'Weight',
            dataIndex: 'Weight',
            render: (Value) => {
              return <Input size="small" value={Value} />;
            },
          },
        ]}
      />
    </>
  );
}
