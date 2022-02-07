import * as React from 'react';
import { useState, useEffect } from 'react';
import { message, Modal, Table } from 'antd';
import TableButtonComponent from './TableButtonComponent';
import UnitProfileComponent from './UnitProfileComponent';
import { ApiFetch } from '../Helpers/Helpers';
import Moment from 'moment';

export default function UnitMoveComponent() {
  const [UnitsTable, SetNewUnitsTable] = useState();
  const [UnitProfile, SetNewUnitProfile] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState();
  const [ShowProfile, SetNewShowProfile] = useState(false);

  const AddUnit = () => {
    let PromiseArray = [];
    let NewProfile = {};

    PromiseArray.push(
      ApiFetch('model/Vehicles', 'GET', undefined, (Response) => {
        NewProfile.AllVehicles = Response.data.map((Vehicle) => {
          return { value: Vehicle.Id, label: Vehicle.Caption };
        });
      })
    );
    PromiseArray.push(
      ApiFetch('model/UnitTypes', 'GET', undefined, (Response) => {
        NewProfile.AllUnitType = Response.data.map((Type) => {
          return { value: Type.Id, label: Type.Caption };
        });
      })
    );
    PromiseArray.push(
      ApiFetch('model/UnitStates', 'GET', undefined, (Response) => {
        NewProfile.AllStates = Response.data.map((State) => {
          return { value: State.Id, label: State.Caption };
        });
      })
    );
    return Promise.all(PromiseArray).then(() => {
      if (
        NewProfile.AllUnitType.length > 0 &&
        NewProfile.AllVehicles.length > 0 &&
        NewProfile.AllStates.length > 0
      ) {
        NewProfile.Profile = {
          UnitTypeId: NewProfile.AllUnitType[0].value,
          UnitHistory: [
            {
              Caption: '',
              TS: Moment().format(),
              UnitStateId: NewProfile.AllStates[0].value,
              VehicleId: NewProfile.AllVehicles[0].value,
            },
          ],
        };
        SetNewUnitProfile(NewProfile);
        SetNewShowProfile(true);
      } else {
        message.error(
          'Недостаточно данных для создания агрегатов. Проверьте справочники.'
        );
      }
    });
  };

  const DeleteUnit = () => {
    if (SelectedKey != null) {
      Modal.confirm({
        okText: 'Удалить',
        onOk: () => {
          ApiFetch(`model/Units/${SelectedKey}`, 'DELETE', undefined, () => {
            RequestUnitTable();
          });
        },
        cancelText: 'Отмена',
        title: 'Подтвердите действие',
        content: 'Вы действительно хотите удалить объект?',
        okButtonProps: { size: 'small', danger: true, type: 'primary' },
        cancelButtonProps: { size: 'small' },
      });
    }
  };
  const RequestUnitTable = () => {
    return ApiFetch('model/Units', 'GET', undefined, (Response) => {
      SetNewUnitsTable(Response.data);
    });
  };
  const RequestUnitProfile = () => {
    let Profile = {};
    let PromiseArray = [];
    PromiseArray.push(
      ApiFetch(`model/Units/${SelectedKey}`, 'GET', undefined, (Response) => {
        Profile.Profile = Response.data;
        Profile.Profile.UnitHistory = Response.data.UnitHistory.map(
          (UnitSnapshot) => {
            UnitSnapshot.Edited = false;
            return UnitSnapshot;
          }
        );
      })
    );
    PromiseArray.push(
      ApiFetch('model/UnitTypes', 'GET', undefined, (Response) => {
        Profile.AllUnitType = Response.data.map((Type) => {
          return { value: Type.Id, label: Type.Caption };
        });
      })
    );
    PromiseArray.push(
      ApiFetch('model/UnitStates', 'GET', undefined, (Response) => {
        Profile.AllStates = Response.data.map((State) => {
          return { value: State.Id, label: State.Caption };
        });
      })
    );
    PromiseArray.push(
      ApiFetch('model/Vehicles', 'GET', undefined, (Response) => {
        Profile.AllVehicles = Response.data.map((Vehicle) => {
          return { value: Vehicle.Id, label: Vehicle.Caption };
        });
      })
    );
    return Promise.all(PromiseArray).then(() => {
      SetNewUnitProfile(Profile);
    });
  };

  const UnitProfileHandler = async (Action, Data, Key) => {
    let NewUnitProfile = { ...UnitProfile };
    let PromiseArray = [];
    switch (Action) {
      case 'ChangeUnitCaption':
        NewUnitProfile.Profile.UnitHistory[Key].Edited = true;
        NewUnitProfile.Profile.UnitHistory[Key].Caption = Data;
        SetNewUnitProfile(NewUnitProfile);
        break;
      case 'ChangeUnitType':
        NewUnitProfile.Profile.UnitTypeId = Data;
        SetNewUnitProfile(NewUnitProfile);
        break;
      case 'ChangeUnitState':
        NewUnitProfile.Profile.UnitHistory[Key].Edited = true;
        NewUnitProfile.Profile.UnitHistory[Key].UnitStateId = Data;
        SetNewUnitProfile(NewUnitProfile);
        break;
      case 'ChangeUnitVehicle':
        NewUnitProfile.Profile.UnitHistory[Key].Edited = true;
        NewUnitProfile.Profile.UnitHistory[Key].VehicleId = Data;
        SetNewUnitProfile(NewUnitProfile);
        break;
      case 'ChangeUnitDate':
        NewUnitProfile.Profile.UnitHistory[Key].TS = Data.format();
        SetNewUnitProfile(NewUnitProfile);
        break;
      case 'AddUnitSnapshot':
        NewUnitProfile.Profile.UnitHistory.unshift({
          Caption: '',
          TS: Moment().format(),
          UnitStateId: NewUnitProfile.AllStates[0].value,
          VehicleId: NewUnitProfile.AllVehicles[0].value,
        });
        SetNewUnitProfile(NewUnitProfile);
        break;
      case 'SaveUnit':
        if (
          NewUnitProfile.Profile.UnitHistory.every((Snapshot) => {
            return Snapshot.Caption.length > 0;
          })
        ) {
          let NewUnitId = null;
          if (!('Id' in NewUnitProfile.Profile)) {
            await ApiFetch(
              'model/Units',
              'POST',
              NewUnitProfile.Profile,
              (Response) => {
                NewUnitId = Response.data.Id;
              }
            );
          }
          NewUnitProfile.Profile.UnitHistory.forEach((UnitSnapshot) => {
            if (UnitSnapshot.Edited || !('UnitId' in UnitSnapshot)) {
              PromiseArray.push(
                ApiFetch(
                  `model/UnitHistory/${
                    NewUnitId != null
                      ? `${NewUnitId}`
                      : NewUnitProfile.Profile.Id
                  }`,
                  'UnitId' in UnitSnapshot ? 'PATCH' : 'POST',
                  NewUnitId != null
                    ? Object.assign(UnitSnapshot, { UnitId: NewUnitId })
                    : UnitSnapshot,
                  (Response) => {}
                )
              );
            }
          });

          Promise.all(PromiseArray).then(() => {
            RequestUnitTable().then(() => {
              SetNewShowProfile(false);
            });
          });
        } else {
          message.warning('Заполните наименование у всех снимков агрегата');
        }

        break;

      case 'DeleteUnitSnapshot':
        if (NewUnitProfile.Profile.UnitHistory.length != 1) {
          if ('UnitId' in NewUnitProfile.Profile.UnitHistory[Key]) {
            ApiFetch(
              `model/UnitHistory/${NewUnitProfile.Profile.UnitHistory[Key].UnitId}/${NewUnitProfile.Profile.UnitHistory[Key].TS}`,
              'DELETE',
              undefined,
              (Response) => {}
            ).then(() => {
              ApiFetch(
                `model/UnitHistory/${NewUnitProfile.Profile.UnitHistory[Key].UnitId}`,
                'GET',
                undefined,
                (Response) => {
                  NewUnitProfile.Profile.UnitHistory.splice(Key, 1);
                  SetNewUnitProfile(NewUnitProfile);
                }
              );
            });
          } else {
            NewUnitProfile.Profile.UnitHistory.splice(Key, 1);
            SetNewUnitProfile(NewUnitProfile);
          }
        } else {
          if ('UnitId' in NewUnitProfile.Profile.UnitHistory[Key]) {
            ApiFetch(`model/Units/${SelectedKey}`, 'DELETE', undefined, () => {
              RequestUnitTable().then(() => {
                SetNewShowProfile(false);
              });
            });
          } else {
            message.warning(
              'Должен остаться хотябы один снимок состояния агрегата'
            );
          }
        }

        break;
    }
  };
  useEffect(RequestUnitTable, []);
  return (
    <>
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        okButtonProps={{ size: 'small', type: 'primary' }}
        cancelButtonProps={{ size: 'small' }}
        title="Профиль агрегата"
        visible={ShowProfile}
        onCancel={() => {
          SetNewShowProfile(false);
          SetNewUnitProfile(null);
        }}
        onOk={() => {
          UnitProfileHandler('SaveUnit');
        }}
        okText="Сохранить"
      >
        <UnitProfileComponent
          Profile={UnitProfile}
          UnitProfileHandler={UnitProfileHandler}
        />
      </Modal>
      <TableButtonComponent
        onAdd={() => {
          AddUnit();
        }}
        onDelete={() => {
          DeleteUnit();
        }}
      />
      <Table
        scroll={{ y: 700 }}
        pagination={false}
        size="small"
        dataSource={UnitsTable}
        rowKey="Id"
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
              SetNewSelectedKey(Record['Id']);
            },
            onDoubleClick: () => {
              RequestUnitProfile().then(() => {
                SetNewShowProfile(true);
              });
            },
          };
        }}
        columns={[
          {
            title: 'Наименование',
            dataIndex: 'Caption',
            key: 'Caption',
            render: (Value, Record, Index) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
          },
          {
            title: 'Тип агрегата',
            dataIndex: 'UnitType',
            key: 'UnitType',
            render: (Value, Record, Index) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  {Record.UnitType.Caption}
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
}
