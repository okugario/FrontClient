import * as React from 'react';
import { useState, useEffect } from 'react';
import TransportProfile from './TransportProfile';
import { Table, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import Moment from 'moment';
import ProfilePageHandler from './ProfilePageHandler';
import TerminalProfileComponent from './TerminalProfileComponent';

export default function TransportComponent() {
  const [TerminalProfile, SetNewTerminalProfile] = useState(null);
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
    let NewTerminalProfile = { ...TerminalProfile };

    switch (Action) {
      case 'ChangeProfileMode':
        SetNewProfileMode(Data);
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
        SetNewProfile(NewProfile);
        break;
      case 'ChangeModel':
        NewProfile.Profile.ModelId = Data;
        SetNewProfile(NewProfile);
        break;
      case 'SaveProfile':
        ApiFetch(
          `model/Vehicles/${NewProfile.Profile.Id}`,
          'PATCH',
          NewProfile.Profile,
          (Response) => {
            SetNewShowProfile(false);
          }
        );
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
          TS: Moment(),
          VehicleId: NewProfile.Id,
          ConditonsId: Profile.AllWorkConditions[0].Id,
        });
        SetNewProfile(NewProfile);
        break;
      case 'RequestTerminalProfile':
        SetNewTerminalIndex(Index);
        ApiFetch(`model/UnitProfiles/${Data}`, 'GET', undefined, (Response) => {
          SetNewTerminalProfile(Response.data);
          TransportProfileHandler('ChangeProfileMode', {
            Mode: 'TerminalProfile',
            Title: 'Профиль терминала',
          });
        });

        break;
      case 'ChangeCanData':
        NewTerminalProfile.Options.truck.canweight = Data;
        SetNewTerminalProfile(NewTerminalProfile);
        break;
      case 'ChangeMaxWeight':
        NewTerminalProfile.Options.truck.maxweight = Data;
        SetNewTerminalProfile(NewTerminalProfile);
        break;
      case 'ChangeTyreSystem':
        NewTerminalProfile.Options.truck.tyresystem = Data;
        SetNewTerminalProfile(NewTerminalProfile);
        break;
      case 'ChangeTerminalID':
        NewTerminalProfile.Equipments[TerminalIndex].ObjectId = Data;
        SetNewTerminalProfile(NewTerminalProfile);
        break;
      case 'ChangeEquipmentDate':
        NewTerminalProfile.Equipments[TerminalIndex].TS = Data;
        SetNewTerminalProfile(NewTerminalProfile);
        break;
      case 'DeleteEquipment':
        Profile.Profile.Equipments.splice(Index, 1);
        SetNewTerminalProfile(NewProfile);
        break;
      case 'AddEquipment':
        SetNewTerminalProfile({
          Options: {
            truck: {
              canweight: false,
              inputs: [],
              maxweight: 50,
              tyresystem: 'skt',
            },
          },
        });
        TransportProfileHandler('ChangeProfileMode', {
          Mode: 'TerminalProfile',
          Title: 'Профиль терминала',
        });
        break;
      case 'AddSensor':
        NewTerminalProfile.Options.truck.inputs.push({
          id: 0,
          k: 0.1,
        });
        SetNewTerminalProfile(NewTerminalProfile);
        break;

      case 'ChangeSensorEnterNumber':
        NewTerminalProfile.Options.truck.inputs[Index].id = Data;
        SetNewTerminalProfile(NewTerminalProfile);
        break;
      case 'ChangeSensorMultiplier':
        NewTerminalProfile.Options.truck.inputs[Index].k = Data;
        SetNewTerminalProfile(NewTerminalProfile);
        break;
      case 'DeleteSensor':
        NewTerminalProfile.Options.truck.inputs.splice(Index, 1);
        SetNewTerminalProfile(NewTerminalProfile);
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
            TerminalID={
              TerminalIndex != null
                ? Profile.Profile.Equipments[TerminalIndex].ObjectId
                : null
            }
            TransportCaption={Profile.Profile.Caption}
            Profile={TerminalProfile}
            Date={
              TerminalIndex != null
                ? Profile.Profile.Equipments[TerminalIndex].TS
                : Moment()
            }
            ProfileHandler={TransportProfileHandler}
          />
        );
    }
  };
  const RequestTransportTable = () => {
    ApiFetch('model/Vehicles', 'GET', undefined, (Response) => {
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

    Promise.all(PromiseArray).then(() => {
      SetNewProfile(NewProfile);
      SetNewShowProfile(true);
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
      <Table
        scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record.Id);
            },
            onDoubleClick: () => {
              RequestProfile();
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
