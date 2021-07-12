import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import WorkConditionsProfileComponent from './WorkConditionsProfileComponent';
import { ApiFetch } from '../Helpers/Helpers';
export default function WorkConditionsComponent(props) {
  const [WorkConditionsTable, SetNewWorkConditionsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [WorkConditionsProfile, SetNewWorkConditionsProfile] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const WorkConditionsHandler = (Action, Data) => {
    let NewProfile = { ...WorkConditionsProfile };
    switch (Action) {
      case 'ChangeCaption':
        NewProfile.Profile.Caption = Data;
        SetNewWorkConditionsProfile(NewProfile);
        break;
      case 'ChangeContractor':
        NewProfile.Profile.ContractorId = Data;
        SetNewWorkConditionsProfile(NewProfile);
        break;
      case 'ChangeCustomer':
        NewProfile.Profile.CustomerId = Data;
        SetNewWorkConditionsProfile(NewProfile);
        break;
      case 'ChangeRegion':
        NewProfile.Profile.RegionId = Data;
        SetNewWorkConditionsProfile(NewProfile);
        break;
      case 'ChangeShiftStart':
        NewProfile.Profile.ShiftStart = Data;
        SetNewWorkConditionsProfile(NewProfile);
        break;
      case 'ChangeLoadZone':
        NewProfile.Profile.LoadZone = Data;
        SetNewWorkConditionsProfile(NewProfile);
        break;
      case 'ChangeIdlePay':
        NewProfile.Profile.IdlePay = Data;
        SetNewWorkConditionsProfile(NewProfile);
        break;
      case 'ChangeGrouping':
        NewProfile.Profile.Grouping = Data;
        SetNewWorkConditionsProfile(NewProfile);
        break;
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
    return Promise.all(PromiseArray).then(() => {
      SetNewWorkConditionsProfile(NewProfile);
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
          SetNewShowProfile(false);
        }}
        title="Профиль условий работы"
        width="450px"
        visible={ShowProfile}
        okButtonProps={{ size: 'small', type: 'primary' }}
        okText="Сохранить"
        maskClosable={false}
        cancelButtonProps={{ size: 'small' }}
        cancelText="Отмена"
      >
        <WorkConditionsProfileComponent
          Profile={WorkConditionsProfile}
          ProfileHandler={WorkConditionsHandler}
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
