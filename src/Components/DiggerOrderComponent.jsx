import * as React from 'react';
import { useEffect, useState } from 'react';
import Moment from 'moment';
import { Table, Modal, Button, message } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import DiggerOrderProfile from './DiggerOrderProfile';
export default function DiggerOrderComponent(props) {
  const [DiggerTable, SetNewDiggerTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const DiggerOrderHandler = (Action, Data, Index) => {
    let NewProfile = Profile != null ? { ...Profile } : {};
    let PromiseArray = [];
    switch (Action) {
      case 'SaveProfile':
        if (
          NewProfile.Profile.Options.LoadDiggerOrders.every((Order) => {
            return Order.Value != 0 && !isNaN(Order.Value);
          })
        ) {
          ApiFetch(
            `model/DiggerOrders${
              'Conditions' in Profile.Profile
                ? `/${NewProfile.Profile.ConditionsId}/${NewProfile.Profile.ShiftCode}`
                : ''
            }`,
            `${'Conditions' in NewProfile.Profile ? 'PATCH' : 'POST'}`,
            NewProfile.Profile,
            (Response) => {
              RequestDiggerTable().then(() => {
                SetNewShowProfile(false);
              });
            }
          ).catch(() => {
            message.warning('Нельзя сохранить наряд с такими данными');
          });
        } else {
          message.warning('Заполните поле объема правильно');
        }

        break;
      case 'AddDiggerOrderProfile':
        NewProfile = {
          Profile: {
            ShiftCode: Number(Moment().format('YYYYDDD') + '1'),
            Options: { LoadDiggerOrders: [] },
          },
        };
        PromiseArray.push(
          ApiFetch('model/WorkConditions', 'GET', undefined, (Response) => {
            NewProfile.AllWorkConditions = Response.data.map(
              (WorkCondition) => {
                return {
                  value: WorkCondition.Id,
                  label: WorkCondition.Caption,
                };
              }
            );
            NewProfile.Profile.ConditionsId =
              NewProfile.AllWorkConditions[0].value;
          })
        );
        PromiseArray.push(
          ApiFetch('model/Vehicles', 'GET', undefined, (VehicleResponse) => {
            ApiFetch('model/VehicleTypes', 'GET', undefined, (TypeResponse) => {
              let DiggerTypeId = TypeResponse.data.find((Type) => {
                return Type.Caption == 'Экскаватор';
              }).Id;

              NewProfile.AllDiggers = VehicleResponse.data
                .filter((Vehicle) => {
                  return Vehicle.Model.TypeId == DiggerTypeId;
                })
                .map((Digger) => {
                  return { value: Digger.Id, label: Digger.Caption };
                });
            });
          })
        );
        PromiseArray.push(
          ApiFetch('model/LoadTypes', 'GET', undefined, (Response) => {
            NewProfile.AllLoadTypes = Response.data.map((Type) => {
              return { value: Type.Id, label: Type.Caption };
            });
          })
        );
        Promise.all(PromiseArray).then(() => {
          SetNewProfile(NewProfile);
          SetNewShowProfile(true);
        });
        break;
      case 'AddLoadDiggerOrder':
        NewProfile.Profile.Options.LoadDiggerOrders.push({
          Digger: NewProfile.AllDiggers[0].value,
          LoadType: NewProfile.AllLoadTypes[0].value,
          Value: 0,
          StartTime:
            NewProfile.Profile.ShiftCode % 10 == '1' ? '8:00:00' : '20:00:00',
        });
        SetNewProfile(NewProfile);
        break;
      case 'ChangeDate':
        NewProfile.Profile.ShiftCode = Number(
          Data.format('YYYYDDD') + (NewProfile.Profile.ShiftCode % 10)
        );
        SetNewProfile(NewProfile);
        break;
      case 'ChangeShift':
        NewProfile.Profile.ShiftCode =
          Math.trunc(NewProfile.Profile.ShiftCode / 10) * 10 + Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeWorkConditions':
        NewProfile.Profile.ConditionsId = Data;
        SetNewProfile(NewProfile);
        break;
      case 'DeleteLoadDiggerOrder':
        NewProfile.Profile.Options.LoadDiggerOrders.splice(Index);
        SetNewProfile(NewProfile);
        SetNewSelectedKey(null);
        break;
      case 'ChangeLoadDigger':
        NewProfile.Profile.Options.LoadDiggerOrders[Index].Digger = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeLoadType':
        NewProfile.Profile.Options.LoadDiggerOrders[Index].LoadType = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeValue':
        NewProfile.Profile.Options.LoadDiggerOrders[Index].Value = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeOrderDate':
        NewProfile.Profile.Options.LoadDiggerOrders[Index].StartTime =
          Data.format('HH:mm:ss');
        SetNewProfile(NewProfile);
        break;
      case 'DeleteDigger':
        ApiFetch(
          `model/DiggerOrders/${DiggerTable[SelectedKey].ConditionsId}/${DiggerTable[SelectedKey].Shift}`,
          'DELETE',
          undefined,
          (Response) => {
            SetNewSelectedKey(null);
            RequestDiggerTable();
          }
        );
        break;
    }
  };
  const RequestDiggerTable = () => {
    return ApiFetch('model/DiggerOrders', 'GET', undefined, (Response) => {
      SetNewDiggerTable(
        Response.data.map((DiggerOrder, Index) => {
          return {
            Key: Index,
            Date: DiggerOrder.ShiftCode,
            Shift: DiggerOrder.ShiftCode,
            Conditions: DiggerOrder.Conditions.Caption,
            ConditionsId: DiggerOrder.ConditionsId,
          };
        })
      );
    });
  };
  const RequestProfile = () => {
    let PromiseArray = [];
    let NewProfile = {};
    PromiseArray.push(
      ApiFetch(
        `model/DiggerOrders/${DiggerTable[SelectedKey].ConditionsId}/${DiggerTable[SelectedKey].Shift}`,
        'GET',
        undefined,
        (Response) => {
          NewProfile.Profile = Response.data;
          if (!('LoadDiggerOrders' in NewProfile.Profile.Options)) {
            NewProfile.Profile.Options.LoadDiggerOrders = [];
          }
        }
      )
    );
    PromiseArray.push(
      ApiFetch('model/WorkConditions', 'GET', undefined, (Response) => {
        NewProfile.AllWorkConditions = Response.data.map((WorkCondition) => {
          return { value: WorkCondition.Id, label: WorkCondition.Caption };
        });
      })
    );
    PromiseArray.push(
      new Promise((resolve, reject) => {
        ApiFetch('model/Vehicles', 'GET', undefined, (VehicleResponse) => {
          ApiFetch('model/VehicleTypes', 'GET', undefined, (TypeResponse) => {
            let DiggerTypeId = TypeResponse.data.find((Type) => {
              return Type.Caption == 'Экскаватор';
            }).Id;

            NewProfile.AllDiggers = VehicleResponse.data
              .filter((Vehicle) => {
                return Vehicle.Model.TypeId == DiggerTypeId;
              })
              .map((Digger) => {
                return { value: Digger.Id, label: Digger.Caption };
              });
            resolve(NewProfile.AllDiggers);
          });
        });
      })
    );
    PromiseArray.push(
      ApiFetch('model/LoadTypes', 'GET', undefined, (Response) => {
        NewProfile.AllLoadTypes = Response.data.map((Type) => {
          return { value: Type.Id, label: Type.Caption };
        });
      })
    );
    Promise.all(PromiseArray).then(() => {
      SetNewProfile(NewProfile);
      SetNewShowProfile(true);
    });
  };
  useEffect(RequestDiggerTable, []);
  return (
    <>
      <Modal
        width="550px"
        maskClosable={false}
        title="Наряд экскаватора"
        visible={ShowProfile}
        okButtonProps={{ type: 'primary', size: 'small' }}
        okText="Сохранить"
        cancelText="Отмена"
        cancelButtonProps={{ size: 'small' }}
        onCancel={() => {
          SetNewShowProfile(false);
        }}
        onOk={() => {
          DiggerOrderHandler('SaveProfile');
        }}
      >
        <DiggerOrderProfile
          Profile={Profile}
          ProfileHandler={DiggerOrderHandler}
        />
      </Modal>
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
            DiggerOrderHandler('AddDiggerOrderProfile');
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
                onOk: () => {
                  DiggerOrderHandler('DeleteDigger');
                },
                title: 'Подтвердите действие',
                content: 'Вы действительно хотите удалить объект?',
                cancelText: 'Отмена',
                okText: 'Удалить',
                cancelButtonProps: { size: 'small' },
                okButtonProps: { size: 'small', danger: true, type: 'primary' },
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
            onDoubleClick: () => {
              RequestProfile();
            },
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
        pagination={false}
        rowKey="Key"
        dataSource={DiggerTable}
        size="small"
        columns={[
          {
            title: 'Дата',
            dataIndex: 'Date',
            key: 'Date',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  {Moment(Value.toString().slice(0, 7), 'YYYYDDD').format(
                    'DD.MM.YYYY'
                  )}
                </div>
              );
            },
          },
          {
            title: 'Смена',
            dataIndex: 'Shift',
            key: 'Shift',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  {Value.toString().slice(7)}
                </div>
              );
            },
          },
          {
            render: (Value, Record, Index) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
            title: 'Условия работы',
            key: 'Conditions',
            dataIndex: 'Conditions',
          },
        ]}
      />
    </>
  );
}
