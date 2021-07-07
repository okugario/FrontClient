import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import Moment from 'moment';
import LoadsPassportProfile from './LoadsPassportProfile';

export default function LoadsPassportComponent(props) {
  const [PassportsTable, SetNewPassportsTable] = useState([]);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Profile, SetNewProfile] = useState(null);
  const RequestPassportsTable = () => {
    ApiFetch('model/DiggerPassports', 'GET', undefined, (Response) => {
      SetNewPassportsTable(
        Response.data.map((Passport, Index) => {
          return {
            Key: Index,
            TS: Passport.TS,
            DiggerModel: Passport.DiggerModel.Caption,
            DiggerModelId: Passport.DiggerModel.Id,
            Conditons: Passport.Conditions.Caption,
            ConditonsId: Passport.Conditions.Id,
          };
        })
      );
    });
  };
  const RequestLoadsPassport = () => {
    let PromiseArray = [];
    let NewProfile = {};
    PromiseArray.push(
      ApiFetch(
        `model/DiggerPassports/${PassportsTable[SelectedKey].ConditonsId}/${PassportsTable[SelectedKey].DiggerModelId}/${PassportsTable[SelectedKey].TS}`,
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
    return Promise.all(PromiseArray).then(() => {
      SetNewProfile(NewProfile);
    });
  };
  useEffect(RequestPassportsTable, []);
  return (
    <>
      <Modal
        visible={ShowProfile}
        title="Паспорт загрузки"
        okButtonProps={{ type: 'primary', size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
        okText="Сохранить"
        cancelText="Отмена"
        onCancel={() => {
          SetNewShowProfile(false);
        }}
      >
        <LoadsPassportProfile Profile={Profile} />
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
        dataSource={PassportsTable}
        size="small"
        onRow={(Record) => {
          return {
            onClick: () => {
              SetNewSelectedKey(Record['Key']);
            },
            onDoubleClick: () => {
              RequestLoadsPassport().then(() => {
                SetNewShowProfile(true);
              });
            },
          };
        }}
        columns={[
          {
            key: 'TS',
            title: 'Время',
            dataIndex: 'TS',
            render: (Value) => {
              return (
                <div style={{ cursor: 'pointer' }}>
                  {Moment(Value).format('DD.MM.YYYY hh:mm:ss')}
                </div>
              );
            },
          },
          {
            render: (Value) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
            key: 'DiggerModel',
            title: 'Модель экскаватора',
            dataIndex: 'DiggerModel',
          },
          {
            render: (Value) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
            key: 'Conditons',
            dataIndex: 'Conditons',
            title: 'Условия работы',
          },
        ]}
      />
    </>
  );
}
