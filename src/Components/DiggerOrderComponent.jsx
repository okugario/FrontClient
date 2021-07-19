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
  const RequestDiggerTable = () => {
    ApiFetch('model/DiggerOrders', 'GET', undefined, (Response) => {
      SetNewDiggerTable(
        Response.data.map((Object, Index) => {
          return {
            Key: Index,
            Date: Object.ShiftCode,
            Shift: Object.ShiftCode,
            Conditions: Object.Conditions.Caption,
            ConditionsId: Object.ConditionsId,
          };
        })
      );
    });
  };
  const RequestProfile = () => {
    ApiFetch(
      `model/DiggerOrders/${DiggerTable[SelectedKey].ConditionsId}/${DiggerTable[SelectedKey].Shift}`,
      'GET',
      undefined,
      (Response) => {
        SetNewProfile(Response.data);
        SetNewShowProfile(true);
      }
    );
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
        <DiggerOrderProfile Profile={Profile} />
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
