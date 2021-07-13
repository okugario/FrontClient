import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import WorkConditionsProfile from './WorkConditionsProfile';
import { ApiFetch, CheckUniqale } from '../Helpers/Helpers';
import Moment from 'moment';
import ProfilePageHandler from './ProfilePageHandler';
import LoadsPassportProfile from './LoadsPassportProfile';
export default function WorkConditionsComponent(props) {
  const [ProfileMode, SetNewProfileMode] = useState({
    Title: 'Профиль условий работы',
    Mode: 'WorkConditions',
  });
  const [WorkConditionsTable, SetNewWorkConditionsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [Profile, SetNewProfile] = useState(null);
  const [LoadProfile, SetNewLoadProfile] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const LoadsPassportHandler = (Action, Data, Index) => {
    let NewProfile = { ...LoadProfile };
    switch (Action) {
      case 'ChangeTruckModel':
        NewProfile.Profile.Options.Trucks[Index].TruckModelId = Data;
        SetNewLoadProfile(NewProfile);
        break;
      case 'ChangeLoadType':
        NewProfile.Profile.Options.Trucks[Index].LoadTypeId = Data;
        SetNewLoadProfile(NewProfile);
        break;
      case 'ChangeVolume':
        NewProfile.Profile.Options.Trucks[Index].Volume = Data;
        SetNewLoadProfile(NewProfile);
        break;
      case 'ChangeWeight':
        NewProfile.Profile.Options.Trucks[Index].Weight = Data;
        SetNewLoadProfile(NewProfile);
        break;
      case 'ChangeDate':
        NewProfile.Profile.TS = Data;
        SetNewLoadProfile(NewProfile);
        break;
      case 'ChangeDiggerModel':
        NewProfile.Profile.DiggerModelId = Data;
        SetNewLoadProfile(NewProfile);
        break;
      case 'ChangeWorkCondition':
        NewProfile.Profile.ConditonsId = Data;
        SetNewLoadProfile(NewProfile);
        break;
      case 'AddStandart':
        NewProfile.Profile.Options.Trucks.push({
          LoadTypeId: NewProfile.AllLoadTypes[0].Id,
          TruckModelId: NewProfile.AllTruckModels[0].Id,
          Volume: 0,
          Weight: 0,
        });
        SetNewLoadProfile(NewProfile);
        break;
      case 'DeleteStandart':
        NewProfile.Profile.Options.Trucks.splice(Data, 1);
        SetNewLoadProfile(NewProfile);
        break;
      case 'ChangeTime':
        NewProfile.Profile.TS = Data;
        SetNewLoadProfile(NewProfile);
        break;
      case 'SaveProfile':
        if (
          NewProfile.Profile.Options.Trucks.every((Truck) => {
            return Truck.Volume > 0 && Truck.Weight > 0;
          })
        ) {
          if (CheckUniqale(NewProfile.Profile.Options.Trucks)) {
            ApiFetch(
              `model/DiggerPassports${
                'DiggerModel' in NewProfile.Profile &&
                'Conditions' in NewProfile.Profile
                  ? `/${NewProfile.Profile.ConditonsId}/${NewProfile.Profile.DiggerModelId}/${NewProfile.Profile.TS}`
                  : ''
              }`,
              'DiggerModel' in NewProfile.Profile &&
                'Conditions' in NewProfile.Profile
                ? 'PATCH'
                : 'POST',
              NewProfile.Profile,
              (Response) => {}
            );
          } else {
            message.warning('Повторяющееся значение в строках');
          }
        } else {
          message.warning('Заполните поля объем и вес правильно');
        }

        break;
    }
  };
  const WorkConditionsHandler = (Action, Data, Index) => {
    let PromiseArray = [];
    let NewProfile = { ...Profile };
    switch (Action) {
      case 'AddPassport':
        PromiseArray.push(
          ApiFetch('model/VehicleModels', 'GET', undefined, (Response) => {
            NewProfile.AllDiggerModels = Response.data.filter((Model) => {
              return Model.Type.Caption == 'Экскаватор';
            });
            NewProfile.AllTruckModels = Response.data.filter((Model) => {
              return Model.Type.Caption == 'Самосвал';
            });
          })
        );
        PromiseArray.push(
          ApiFetch('model/LoadTypes', 'GET', undefined, (Response) => {
            NewProfile.AllLoadTypes = Response.data;
          })
        );
        PromiseArray.push(
          ApiFetch('model/WorkConditions', 'GET', undefined, (Response) => {
            NewProfile.AllWorkConditions = Response.data;
          })
        );
        Promise.all(PromiseArray).then(() => {
          NewProfile.Profile = {
            TS: Moment('08:00:00', 'hh:mm:ss').format(),
            Options: {
              Trucks: [],
            },
            ConditonsId: NewProfile.AllWorkConditions[0].Id,
            DiggerModelId: NewProfile.AllDiggerModels[0].Id,
          };
          SetNewLoadProfile(NewProfile);
          WorkConditionsHandler('ChangeProfileMode', {
            Title: 'Профиль паспорта загрузки',
            Mode: 'LoadingPassport',
          });
        });
        break;
      case 'RequestLoadsPassport':
        PromiseArray.push(
          ApiFetch(
            `model/DiggerPassports/${Profile.Profile.DiggerPassports[Index].ConditonsId}/${Profile.Profile.DiggerPassports[Index].DiggerModelId}/${Profile.Profile.DiggerPassports[Index].TS}`,
            'GET',
            undefined,
            (Response) => {
              NewProfile.Profile = Response.data;
            }
          )
        );
        PromiseArray.push(
          ApiFetch('model/VehicleModels', 'GET', undefined, (Response) => {
            NewProfile.AllDiggerModels = Response.data.filter((Model) => {
              return Model.Type.Caption == 'Экскаватор';
            });
            NewProfile.AllTruckModels = Response.data.filter((Model) => {
              return Model.Type.Caption == 'Самосвал';
            });
          })
        );
        PromiseArray.push(
          ApiFetch('model/LoadTypes', 'GET', undefined, (Response) => {
            NewProfile.AllLoadTypes = Response.data;
          })
        );
        PromiseArray.push(
          ApiFetch('model/WorkConditions', 'GET', undefined, (Response) => {
            NewProfile.AllWorkConditions = Response.data;
          })
        );
        Promise.all(PromiseArray).then(() => {
          SetNewLoadProfile(NewProfile);
          WorkConditionsHandler('ChangeProfileMode', {
            Title: 'Профиль паспорта загрузки',
            Mode: 'LoadingPassport',
          });
        });
        break;
      case 'ChangeProfileMode':
        SetNewProfileMode(Data);
        break;
      case 'ChangeCaption':
        NewProfile.Profile.Caption = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeContractor':
        NewProfile.Profile.ContractorId = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeCustomer':
        NewProfile.Profile.CustomerId = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeRegion':
        NewProfile.Profile.RegionId = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeShiftStart':
        NewProfile.Profile.ShiftStart = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeLoadZone':
        NewProfile.Profile.LoadZone = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeIdlePay':
        NewProfile.Profile.IdlePay = Data;
        SetNewProfile(NewProfile);
        break;
      case 'ChangeGrouping':
        NewProfile.Profile.Grouping = Data;
        SetNewProfile(NewProfile);
        break;
    }
  };
  const GetProfile = (Mode) => {
    switch (Mode) {
      case 'WorkConditions':
        return (
          <WorkConditionsProfile
            Profile={Profile}
            ProfileHandler={WorkConditionsHandler}
          />
        );
      case 'LoadingPassport':
        return (
          <LoadsPassportProfile
            Profile={LoadProfile}
            ProfileHandler={LoadsPassportHandler}
          />
        );
    }
  };

  const RequestWorkConditionsProfile = () => {
    let NewProfile = {};
    let PromiseArray = [];
    PromiseArray.push(
      ApiFetch(
        `model/WorkConditions/${SelectedKey}`,
        'GET',
        undefined,
        (Response) => {
          NewProfile.Profile = Response.data;
          if (!('ShiftStart' in NewProfile.Profile)) {
            NewProfile.Profile.ShiftStart = '08:00';
          }
          if (!('LoadZone' in NewProfile.Profile)) {
            NewProfile.Profile.LoadZone = 70;
          }
          if (!('IdlePay' in NewProfile.Profile)) {
            NewProfile.Profile.IdlePay = 0;
          }
          if (!('Grouping' in NewProfile.Profile)) {
            NewProfile.Profile.Grouping = 'By100';
          }
        }
      )
    );
    PromiseArray.push(
      ApiFetch('model/Firms', 'GET', undefined, (Response) => {
        NewProfile.AllFirms = Response.data.map((Firm) => {
          return { value: Firm.Id, label: Firm.Caption };
        });
      })
    );
    PromiseArray.push(
      ApiFetch('model/Regions', 'GET', undefined, (Response) => {
        NewProfile.AllRegions = Response.data.map((Region) => {
          return {
            value: Region.Id,
            label: Region.Caption,
          };
        });
      })
    );
    PromiseArray.push(
      ApiFetch('model/VehicleModels', 'GET', undefined, (Response) => {
        NewProfile.AllDiggerModels = Response.data.filter((Model) => {
          return Model.Type.Caption == 'Экскаватор';
        });
      })
    );
    return Promise.all(PromiseArray).then(() => {
      SetNewProfile(NewProfile);
    });
  };
  const RequestTable = () => {
    ApiFetch('model/WorkConditions', 'GET', undefined, (Response) => {
      SetNewWorkConditionsTable(Response.data);
    });
  };
  useEffect(RequestTable, []);
  return (
    <>
      <Modal
        onCancel={() => {
          SetNewProfileMode({
            Title: 'Профиль условий работы',
            Mode: 'WorkConditions',
          });
          SetNewShowProfile(false);
        }}
        title={
          <ProfilePageHandler
            Title={ProfileMode.Title}
            ShowBackIcon={ProfileMode.Mode == 'LoadingPassport'}
            OnBack={() => {
              WorkConditionsHandler('ChangeProfileMode', {
                Title: 'Профиль условий работы',
                Mode: 'WorkConditions',
              });
            }}
          />
        }
        visible={ShowProfile}
        onOk={() => {
          ProfileMode.Mode == 'LoadingPassport'
            ? LoadsPassportHandler('SaveProfile')
            : WorkConditionsHandler('SaveProfile');
        }}
        okButtonProps={{ size: 'small', type: 'primary' }}
        okText="Сохранить"
        maskClosable={false}
        cancelButtonProps={{ size: 'small' }}
        cancelText="Отмена"
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
        <Button size="small" type="primary" onClick={() => {}}>
          Добавить
        </Button>
        <Button
          size="small"
          danger
          type="primary"
          onClick={() => {
            if (SelectedKey != null) {
              Modal.confirm({
                okText: 'Удалить',
                cancelText: 'Отмена',
                okButtonProps: {
                  size: 'small',
                  type: 'primary',
                  danger: true,
                },
                cancelButtonProps: { size: 'small' },
                title: 'Подтвердите действие',
                content: 'Вы действительно хотите удалить объект?',

                onOk: () => {},
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
              SetNewSelectedKey(Record['Id']);
            },
            onDoubleClick: () => {
              RequestWorkConditionsProfile().then(() => {
                SetNewShowProfile(true);
              });
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
        scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
        pagination={false}
        rowKey="Id"
        dataSource={WorkConditionsTable}
        size="small"
        columns={[
          {
            title: 'Наименование',
            key: 'Caption',
            dataIndex: 'Caption',
            render: (Value) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
          },
        ]}
      />
    </>
  );
}
