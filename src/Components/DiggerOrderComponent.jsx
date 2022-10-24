import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, DatePicker, Select, Button, Modal, message } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import Moment from 'moment';
import { inject, observer } from 'mobx-react';
const DiggerOrderComponent = inject('ProviderStore')(
  observer((props) => {
    const [DiggerOrdersTable, SetNewDiggerOrdersTable] = useState([]);
    const [DiggerList, SetNewDiggerList] = useState(null);
    const [LoadTypesList, SetNewLoadTypesList] = useState(null);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const DiggerOrderHandler = (Action, Data, Index) => {
      let NewDiggerOrdersTable = [...DiggerOrdersTable];
      switch (Action) {
        case 'Delete':
          if ('Vehicle' in NewDiggerOrdersTable[SelectedKey]) {
            ApiFetch(
              `model/DiggerOrders/${NewDiggerOrdersTable[SelectedKey].VehicleId}/${NewDiggerOrdersTable[SelectedKey].TS}`,
              'DELETE',
              undefined,
              (Response) => {
                RequestDiggerOrders();
                SetNewSelectedKey(null);
              }
            );
          } else {
            NewDiggerOrdersTable.splice(SelectedKey, 1);
            SetNewDiggerOrdersTable(NewDiggerOrdersTable);
            SetNewSelectedKey(null);
          }
          break;
        case 'ChangeDigger':
          NewDiggerOrdersTable[Index].VehicleId = Data;
          SetNewDiggerOrdersTable(NewDiggerOrdersTable);
          break;
        case 'ChangeLoadType':
          if (
            NewDiggerOrdersTable.some((Order) => {
              return Order.Edited;
            }) &&
            NewDiggerOrdersTable[Index].Edited == false
          ) {
            message.warning('Сохраните предыдущий наряд');
          } else {
            NewDiggerOrdersTable[Index].LoadTypeId = Data;
            NewDiggerOrdersTable[Index].Edited = true;
            SetNewDiggerOrdersTable(NewDiggerOrdersTable);
          }

          break;
        case 'ChangeDate':
          NewDiggerOrdersTable[Index].TS = Data.format();
          SetNewDiggerOrdersTable(NewDiggerOrdersTable);
          break;
        case 'AddDiggerOrder':
          if (
            NewDiggerOrdersTable.some((Orders) => {
              return Orders.Edited;
            })
          ) {
            message.warning('Сохраните предыдущий объект');
          } else {
            NewDiggerOrdersTable.push({
              TS: Moment('08:00:00', 'HH:mm:ss').format(),
              VehicleId: DiggerList[0].value,
              LoadTypeId: LoadTypesList[0].value,
              Edited: true,
              Options: {},
            });
            SetNewDiggerOrdersTable(NewDiggerOrdersTable);
          }

          break;
        case 'Cancel':
          if ('Vehicle' in Data) {
            ApiFetch(
              `model/DiggerOrders/${Data.VehicleId}/${Data.TS}`,
              'GET',
              undefined,
              (Response) => {
                NewDiggerOrdersTable[Index] = Response.data;
                SetNewDiggerOrdersTable(NewDiggerOrdersTable);
              }
            );
          } else {
            NewDiggerOrdersTable.splice(Index, 1);
            SetNewDiggerOrdersTable(NewDiggerOrdersTable);
          }

          break;
        case 'Save':
          ApiFetch(
            `model/DiggerOrders${
              'Vehicle' in Data ? `/${Data.VehicleId}/${Data.TS}` : ''
            } `,

            `${'Vehicle' in Data ? 'PATCH' : 'POST'}`,
            Data,
            (Response) => {
              RequestDiggerOrders();
            }
          ).catch(() => {
            message.warning(
              'Выберете другой экскаватор или дату для сохранения'
            );
          });
          break;
      }
    };
    const RequestDiggerOrders = () => {
      if (
        props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id ==
        'DiggerOrders'
      ) {
        ApiFetch('model/DiggerOrders', 'GET', undefined, (Response) => {
          SetNewDiggerOrdersTable(
            Response.data.map((DiggerOrder) => {
              DiggerOrder.Edited = false;
              return DiggerOrder;
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
      }
    };
    useEffect(RequestDiggerOrders, [
      props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id,
    ]);
    return (
      <>
        <div
          style={{
            width: '200px',
            display: 'flex',
            justifyContent: 'space-evenly',
            marginBottom: '5px',
          }}
        >
          <Button
            size="small"
            type="primary"
            onClick={() => {
              DiggerOrderHandler('AddDiggerOrder');
            }}
          >
            Добавить
          </Button>
          <Button
            size="small"
            danger
            type="primary"
            onClick={() => {
              if (
                SelectedKey != null &&
                DiggerOrdersTable.length > SelectedKey
              ) {
                Modal.confirm({
                  title: 'Подтвердите действие',
                  content: 'Вы действитенльно хотите удалить объект?',
                  okText: 'Удалить',
                  cancelText: 'Отмена',
                  okButtonProps: {
                    type: 'primary',
                    danger: true,
                    size: 'small',
                  },
                  cancelButtonProps: { size: 'small' },
                  onOk: () => {
                    DiggerOrderHandler('Delete');
                  },
                });
              }
            }}
          >
            Удалить
          </Button>
        </div>
        <Table
          scroll={{ y: 700 }}
          rowSelection={{
            columnWidth: 0,
            selectedRowKeys: [SelectedKey],
            hideSelectAll: true,
            renderCell: () => {
              return null;
            },
          }}
          onRow={(Record) => {
            return {
              onClick: () => {
                SetNewSelectedKey(Record['Key']);
              },
            };
          }}
          pagination={false}
          rowKey="Key"
          dataSource={DiggerOrdersTable.map((DiggerOrder, Index) => {
            DiggerOrder.Key = Index;
            return DiggerOrder;
          })}
          size="small"
          columns={[
            {
              title: 'Дата',
              key: 'TS',
              dataIndex: 'TS',
              render: (Value, Record, Index) => {
                return (
                  <div style={{ cursor: 'pointer' }}>
                    <DatePicker
                      disabled={'Vehicle' in Record}
                      showTime={true}
                      onOk={(Moment) => {
                        DiggerOrderHandler('ChangeDate', Moment, Index);
                      }}
                      size="small"
                      value={Moment(Value)}
                      format="DD.MM.YYYY HH:mm:ss"
                    />
                  </div>
                );
              },
            },
            {
              title: 'Экскаватор',
              key: 'VehicleId',
              dataIndex: 'VehicleId',
              render: (Value, Record, Index) => {
                return (
                  <div style={{ cursor: 'pointer' }}>
                    <Select
                      disabled={'Vehicle' in Record}
                      size="small"
                      options={DiggerList}
                      value={Value}
                      onChange={(NewValue) => {
                        DiggerOrderHandler('ChangeDigger', NewValue, Index);
                      }}
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
                  <div style={{ display: 'flex', cursor: 'pointer' }}>
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
                      {Record.Edited ? (
                        <>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              DiggerOrderHandler('Save', Record);
                            }}
                          >
                            Сохранить
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              DiggerOrderHandler('Cancel', Record, Index);
                            }}
                          >
                            Отмена
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              },
            },
          ]}
        />
      </>
    );
  })
);
export default DiggerOrderComponent;
