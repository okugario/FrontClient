import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, DatePicker, Select, Button } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import Moment from 'moment';
let ActionHistoryMap = new Map();
export default function DiggerOrderComponent(props) {
  const [DiggerOrdersTable, SetNewDiggerOrdersTable] = useState(null);
  const [DiggerList, SetNewDiggerList] = useState(null);
  const [LoadTypesList, SetNewLoadTypesList] = useState(null);
  const DiggerOrderHandler = (Action, Data, Index) => {
    let NewDiggerOrdersTable = [...DiggerOrdersTable];
    switch (Action) {
      case 'ChangeDigger':
        NewDiggerOrdersTable[Index].VehicleId = Data;
        NewDiggerOrdersTable[Index].Edited = true;
        SetNewDiggerOrdersTable(NewDiggerOrdersTable);
        break;
      case 'ChangeLoadType':
        NewDiggerOrdersTable[Index].LoadTypeId = Data;
        NewDiggerOrdersTable[Index].Edited = true;
        SetNewDiggerOrdersTable(NewDiggerOrdersTable);
        break;
      case 'ChangeDate':
        NewDiggerOrdersTable[Index].TS = Data.format();
        NewDiggerOrdersTable[Index].Edited = true;
        SetNewDiggerOrdersTable(NewDiggerOrdersTable);
        break;
    }
  };
  const RequestDiggerOrders = () => {
    ApiFetch('model/DiggerOrders', 'GET', undefined, (Response) => {
      SetNewDiggerOrdersTable(
        Response.data.map((Order, Index) => {
          Order.Key = Index;
          Order.Edited = false;
          return Order;
        })
      );
    });
    ApiFetch('/model/LoadTypes', 'GET', undefined, (Response) => {
      SetNewLoadTypesList(
        Response.data.map((Type) => {
          return { label: Type.Caption, value: Type.Id };
        })
      );
    });

    new Promise((resolve, reject) => {
      ApiFetch('model/VehicleTypes', 'GET', undefined, (TypeResponse) => {
        let DiggerTypeId = TypeResponse.data.find((Type) => {
          return Type.Caption == 'Экскаватор';
        }).Id;

        ApiFetch('model/Vehicles', 'GET', undefined, (VehiclesResponse) => {
          resolve(
            VehiclesResponse.data
              .filter((Vehicle) => {
                return Vehicle.Model.TypeId == DiggerTypeId;
              })
              .map((Digger) => {
                return { value: Digger.Id, label: Digger.Caption };
              })
          );
        });
      });
    }).then((Digger) => {
      SetNewDiggerList(Digger);
    });
  };
  useEffect(RequestDiggerOrders, []);
  return (
    <>
      <Table
        pagination={false}
        rowKey="Key"
        dataSource={DiggerOrdersTable}
        size="small"
        columns={[
          {
            title: 'Дата',
            key: 'TS',
            dataIndex: 'TS',
            render: (Value, Record, Index) => {
              return (
                <DatePicker
                  showTime={true}
                  onOk={(Moment) => {
                    DiggerOrderHandler('ChangeDate', Moment, Index);
                  }}
                  size="small"
                  value={Moment(Value)}
                  format="DD.MM.YYYY HH:mm:ss"
                />
              );
            },
          },
          {
            title: 'Экскаватор',
            key: 'VehicleId',
            dataIndex: 'VehicleId',
            render: (Value, Record, Index) => {
              return (
                <Select
                  size="small"
                  options={DiggerList}
                  value={Value}
                  onChange={(NewValue) => {
                    DiggerOrderHandler('ChangeDigger', NewValue, Index);
                  }}
                />
              );
            },
          },
          {
            title: 'Вид груза',
            key: 'LoadTypeId',
            dataIndex: 'LoadTypeId',
            render: (Value, Record, Index) => {
              return (
                <div style={{ display: 'flex' }}>
                  <Select
                    size="small"
                    options={LoadTypesList}
                    value={Value}
                    onChange={(NewValue) => {
                      DiggerOrderHandler('ChangeLoadType', NewValue, Index);
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      width: '170px',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Button type="primary" size="small">
                      Сохранить
                    </Button>
                    <Button size="small">Отмена</Button>
                  </div>
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
}
