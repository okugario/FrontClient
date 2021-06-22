import * as React from 'react';
import { useState, useEffect } from 'react';
import TransportProfile from './TransportProfile';
import { Table, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import Moment from 'moment';

export default function TransportComponent() {
  const [TransportTable, SetNewTransportTable] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [Profile, SetNewProfile] = useState(null);

  const TransportProfileHandler = (Action, Data, Index) => {
    let NewProfile = { ...Profile };
    switch (Action) {
      case 'AddFirm':
        NewProfile.Profile.Owners.push({
          TS: Moment().format(),
          VehicleId: Profile.Profile.Id,
          FirmId: Profile.AllFirms[0].Id,
        });
        SetNewProfile(NewProfile);
        break;
      case 'DeleteFirm':
        NewProfile.Profile.Owners.splice(
          NewProfile.Profile.Owners.findIndex((Firm) => {
            return Firm.Key == SelectedKey;
          }),
          1
        );
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
        title="Профиль транспорта"
        width="450px"
        okText="Сохранить"
        okButtonProps={{ size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
        visible={ShowProfile}
        onCancel={() => {
          SetNewShowProfile(false);
        }}
      >
        <TransportProfile
          Profile={Profile}
          ProfileHandler={TransportProfileHandler}
        />
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
