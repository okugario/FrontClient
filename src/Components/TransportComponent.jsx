import * as React from 'react';
import { useState, useEffect } from 'react';
import TransportProfile from './TransportProfile';
import { Table, Modal, Button, message } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import Moment from 'moment';
import ProfilePageHandler from './ProfilePageHandler';
import TerminalProfileComponent from './TerminalProfileComponent';

export default function TransportComponent() {
  const [TransportTable, SetNewTransportTable] = useState(null);
  const [ProfileMode, SetNewProfileMode] = useState({
    Mode: 'TransportProfile',
    Title: 'Профиль транспорта',
  });
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [Profile, SetNewProfile] = useState(null);
  const [TerminalIndex, SetNewTerminalIndex] = useState(null);

  const TransportProfileHandler = (Action, Data, Index) => {
    let NewProfile = { ...Profile };

    switch (Action) {
      case 'DeleteTransport':
        ApiFetch(
          `model/Vehicles/${SelectedKey}`,
          'DELETE',
          undefined,
          (Response) => {
            RequestTransportTable();
          }
        );
        break;
      case 'AddTransport':
        NewProfile = {
          AllTypes: [],
          AllModels: [],
          Profile: {
            Caption: '',
            ModelId: '',
            Model: {},
            Owners: [],
            Equipments: [],
            Locations: [],
          },
        };
        let PromiseArray = [];
        PromiseArray.push(
          ApiFetch('model/VehicleModels', 'GET', undefined, (Response) => {
            NewProfile.AllModels = Response.data;
            NewProfile.Profile.ModelId = Response.data.find((Model) => {
              return Model.Caption == '-';
            }).Id;
          })
        );
        PromiseArray.push(
          ApiFetch('model/VehicleTypes', 'GET', undefined, (Response) => {
            NewProfile.AllTypes = Response.data;
            NewProfile.Profile.Model.TypeId = Response.data.find((Type) => {
              return Type.Caption == '-';
            }).Id;
          })
        );
        PromiseArray.push(
          ApiFetch('model/Firms', 'GET', undefined, (Response) => {
            NewProfile.AllFirms = Response.data;
          })
        );
        PromiseArray.push(
          ApiFetch('model/WorkConditions', 'GET', undefined, (Response) => {
            NewProfile.AllWorkConditions = Response.data;
          })
        );
        Promise.all(PromiseArray).then(() => {
          SetNewProfile(NewProfile);
          SetNewShowProfile(true);
        });

        break;
      case 'ChangeProfileMode':
        if (Data.Mode == 'TransportProfile') {
          const NewProfile = { ...Profile };
          ApiFetch(
            `model/Vehicles/${SelectedKey}`,
            'GET',
            undefined,
            (Response) => {
              NewProfile.Profile.Equipments = Response.data.Equipments;
              SetNewProfile(NewProfile);
              SetNewProfileMode(Data);
              SetNewTerminalIndex(Index);
            }
          );
        } else {
          SetNewProfileMode(Data);
          SetNewTerminalIndex(Index);
        }

        break;
      case 'AddFirm':
        NewProfile.Profile.Owners.push({
          TS: Moment().format(),
          VehicleId: Profile.Profile.Id,
          FirmId: Profile.AllFirms[0].Id,
        });
        SetNewProfile(NewProfile);
        break;
      case 'DeleteFirm':
        NewProfile.Profile.Owners.splice(Index, 1);
        SetNewProfile(NewProfile);
        break;
      case 'ChangeCaption':
        NewProfile.Profile.Caption = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeTransportType':
        NewProfile.Profile.Model.TypeId = Data;
        NewProfile.Profile.ModelId = NewProfile.AllModels.find((Model) => {
          return Model.TypeId == Data;
        }).Id;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeModel':
        NewProfile.Profile.ModelId = Data;
        SetNewProfile(NewProfile);
        break;
      case 'EditFirmDate':
        NewProfile.Profile.Owners[Index].TS = Data;
        SetNewProfile(NewProfile);
        break;
      case 'EditFirmCaption':
        NewProfile.Profile.Owners[Index].FirmId = Data;
        SetNewProfile(NewProfile);
        break;
      case 'EditLocationCaption':
        NewProfile.Profile.Locations[Index].ConditonsId = Data;
        SetNewProfile(NewProfile);
        break;
      case 'EditLocationDate':
        NewProfile.Profile.Locations[Index].TS = Data;
        SetNewProfile(NewProfile);
        break;
      case 'DeleteLocation':
        NewProfile.Profile.Locations.splice(Index, 1);
        SetNewProfile(NewProfile);
        break;
      case 'AddLocation':
        NewProfile.Profile.Locations.push({
          TS: Moment().format(),
          VehicleId: NewProfile.Profile.Id,
          ConditonsId: Profile.AllWorkConditions[0].Id,
        });
        SetNewProfile(NewProfile);
        break;

      case 'ChangeCanData':
        NewProfile.Profile.Equipments[
          TerminalIndex
        ].UnitProfile.Options.truck.canweight = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeMaxWeight':
        NewProfile.Profile.Equipments[
          TerminalIndex
        ].UnitProfile.Options.truck.maxweight = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeTyreSystem':
        NewProfile.Profile.Equipments[
          TerminalIndex
        ].UnitProfile.Options.truck.tyresystem = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeTerminalID':
        NewProfile.Profile.Equipments[TerminalIndex].ObjectId = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeEquipmentDate':
        NewProfile.Profile.Equipments[TerminalIndex].TS = Data;
        SetNewProfile(NewProfile);
        break;
      case 'DeleteEquipment':
        Profile.Profile.Equipments.splice(Index, 1);
        SetNewProfile(NewProfile);
        break;
      case 'AddEquipment':
        NewProfile.Profile.Equipments.push({
          TS: Moment().format(),
          VehicleId: NewProfile.Profile.Id,

          UnitProfile: {
            Options: {
              truck: {
                canweight: false,
                inputs: [],
                maxweight: 50,
                tyresystem: 'skt',
              },
            },
          },
        });
        SetNewProfile(NewProfile);
        TransportProfileHandler(
          'ChangeProfileMode',
          {
            Mode: 'TerminalProfile',
            Title: 'Профиль терминала',
          },
          NewProfile.Profile.Equipments.length - 1
        );

        break;
      case 'AddSensor':
        NewProfile.Profile.Equipments[
          TerminalIndex
        ].UnitProfile.Options.truck.inputs.push({
          id: 0,
          k: 0.1,
        });
        SetNewProfile(NewProfile);
        break;

      case 'ChangeSensorEnterNumber':
        NewProfile.Profile.Equipments[
          TerminalIndex
        ].UnitProfile.Options.truck.inputs[Index].id = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeSensorMultiplier':
        NewProfile.Profile.Equipments[
          TerminalIndex
        ].UnitProfile.Options.truck.inputs[Index].k = Data;
        SetNewProfile(NewProfile);
        break;
      case 'DeleteSensor':
        NewProfile.Profile.Equipments[
          TerminalIndex
        ].UnitProfile.Options.truck.inputs.splice(Index, 1);
        SetNewProfile(NewProfile);
        break;
      case 'SaveProfile':
        if (ProfileMode.Mode == 'TransportProfile') {
          if (
            Profile.Profile.Caption != '' &&
            TransportTable.every((Transport) => {
              return Transport.Caption != Profile.Profile.Caption;
            })
          ) {
            ApiFetch(
              `model/Vehicles${
                'Id' in NewProfile.Profile ? `/${NewProfile.Profile.Id}` : ''
              }`,
              'Id' in NewProfile.Profile ? 'PATCH' : 'POST',
              NewProfile.Profile,
              (Response) => {
                RequestTransportTable().then(() => {
                  SetNewShowProfile(false);
                });
              }
            );
          } else {
            message.warning('Укажите корректное наименование');
          }
        } else {
          ApiFetch(
            `model/VehicleEquipments${
              'UnitProfileID' in NewProfile.Profile.Equipments[TerminalIndex]
                ? `/${NewProfile.Profile.Equipments[TerminalIndex].VehicleId}`
                : ''
            }${
              'UnitProfileID' in NewProfile.Profile.Equipments[TerminalIndex]
                ? `/${NewProfile.Profile.Equipments[TerminalIndex].TS}`
                : ''
            }`,
            'UnitProfileID' in NewProfile.Profile.Equipments[TerminalIndex]
              ? 'PATCH'
              : 'POST',
            NewProfile.Profile.Equipments[TerminalIndex],
            (Response) => {
              TransportProfileHandler('ChangeProfileMode', {
                Mode: 'TransportProfile',
                Title: 'Профиль транспорта',
              });
            }
          );
        }

        break;
    }
  };
  const GetProfile = (ModalMode) => {
    switch (ModalMode) {
      case 'TransportProfile':
        return (
          <TransportProfile
            Profile={Profile}
            ProfileHandler={TransportProfileHandler}
          />
        );
      case 'TerminalProfile':
        return (
          <TerminalProfileComponent
            TransportCaption={Profile.Profile.Caption}
            TerminalProfile={Profile.Profile.Equipments[TerminalIndex]}
            ProfileHandler={TransportProfileHandler}
          />
        );
    }
  };
  const RequestTransportTable = () => {
    return ApiFetch('model/Vehicles', 'GET', undefined, (Response) => {
      SetNewTransportTable(Response.data);
    });
  };
  const RequestProfile = () => {
    let NewProfile = {};
    let PromiseArray = [];
    PromiseArray.push(
      ApiFetch('model/VehicleModels', 'GET', undefined, (Response) => {
        NewProfile.AllModels = Response.data;
      })
    );
    PromiseArray.push(
      ApiFetch('model/VehicleTypes', 'GET', undefined, (Response) => {
        NewProfile.AllTypes = Response.data;
      })
    );
    PromiseArray.push(
      ApiFetch('model/Firms', 'GET', undefined, (Response) => {
        NewProfile.AllFirms = Response.data;
      })
    );
    PromiseArray.push(
      ApiFetch('model/WorkConditions', 'GET', undefined, (Response) => {
        NewProfile.AllWorkConditions = Response.data;
      })
    );
    PromiseArray.push(
      ApiFetch(
        `model/Vehicles/${SelectedKey}`,
        'GET',
        undefined,
        (Response) => {
          NewProfile.Profile = Response.data;
        }
      )
    );

    return Promise.all(PromiseArray).then(() => {
      SetNewProfile(NewProfile);
    });
  };
  useEffect(RequestTransportTable, []);
  return (
    <div className="FullExtend">
      <Modal
        maskClosable={false}
        onOk={() => {
          TransportProfileHandler('SaveProfile');
        }}
        destroyOnClose={true}
        title={
          <ProfilePageHandler
            ProfileHandler={TransportProfileHandler}
            Title={ProfileMode.Title}
            BackIcon={ProfileMode.Mode != 'TransportProfile'}
          />
        }
        width="450px"
        okText="Сохранить"
        okButtonProps={{ size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
        visible={ShowProfile}
        onCancel={() => {
          TransportProfileHandler('ChangeProfileMode', {
            Mode: 'TransportProfile',
            Title: 'Профиль транспорта',
          });
          SetNewShowProfile(false);
        }}
      >
        {GetProfile(ProfileMode.Mode)}
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
            TransportProfileHandler('AddTransport');
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
                okButtonProps: { size: 'small', danger: true, type: 'primary' },
                okText: 'Удалить',
                cancelText: 'Отмена',
                cancelButtonProps: { size: 'small' },
                onOk: () => {
                  TransportProfileHandler('DeleteTransport');
                },
                title: 'Подтвердите действие',
                content:
                  'Вы действительно хотите удалить транспортное средство?',
              });
            }
          }}
        >
          Удалить
        </Button>
      </div>
      <Table
        scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record.Id);
            },
            onDoubleClick: () => {
              RequestProfile().then(() => {
                SetNewShowProfile(true);
              });
            },
          };
        }}
        pagination={false}
        rowSelection={{
          columnWidth: 0,
          selectedRowKeys: [SelectedKey],
          hideSelectAll: true,
          renderCell: () => {
            return null;
          },
        }}
        rowKey="Id"
        size="small"
        dataSource={TransportTable}
        columns={[
          {
            title: 'Наименование',
            key: 'caption',
            dataIndex: 'Caption',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
          {
            title: 'ID терминала',
            key: 'TerminalID',
            dataIndex: 'TerminalID',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
          {
            title: 'Тип',
            key: 'Type',
            dataIndex: 'Type',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
          {
            title: 'Дата добавления',
            key: 'AddDate',
            dataIndex: 'AddDate',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
          {
            title: 'Последние данные',
            key: 'LastData',
            dataIndex: 'LastData',
            render: (Record) => {
              return <div style={{ cursor: 'pointer' }}>{Record}</div>;
            },
          },
        ]}
      />
    </div>
  );
}
