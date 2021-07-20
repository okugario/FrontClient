import * as React from 'react';
import { useEffect, useState } from 'react';
import Moment from 'moment';
import { Table, Modal, Button } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import DiggerOrderProfile from './DiggerOrderProfile';
export default function DiggerOrderComponent(props) {
  const [DiggerTable, SetNewDiggerTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const DiggerOrderHandler = (Action, Data, Index) => {
    let NewProfile = { ...Profile };
    switch (Action) {
      case 'AddLoadType':
        NewProfile.Profile.Options.LoadDiggerOrders.push({
          Digger: NewProfile.AllDiggers[0].value,
          LoadType: NewProfile.AllLoadTypes[0].value,
          Value: 0,
          StartTime:
            NewProfile.Profile.ShiftCode.toString().slice(7) == '1'
              ? '8:00:00'
              : '20:00:00',
        });
        SetNewProfile(NewProfile);
        break;
    }
  };
  const RequestDiggerTable = () => {
    ApiFetch('model/DiggerOrders', 'GET', undefined, (Response) => {
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
          NewProfile.Profile.Options.LoadDiggerOrders = [];
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
  };
  useEffect(RequestDiggerTable, []);
  return (
    <>
      <Modal
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
        <Button size="small" type="primary" onClick={() => {}}>
          Добавить
        </Button>
        <Button size="small" danger type="primary" onClick={() => {}}>
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
