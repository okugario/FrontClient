import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Table, DatePicker } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import Moment from 'moment';

export default function LoadsPassportComponent(props) {
  const [PassportsTable, SetNewPassportsTable] = useState([]);
  const RequestPassportsTable = () => {
    ApiFetch('model/DiggerPassports', 'GET', undefined, (Response) => {
      SetNewPassportsTable(
        Response.data.map((Passport, Index) => {
          return {
            Key: Index,
            TS: Passport.TS,
            DiggerModel: Passport.DiggerModel.Caption,
            Conditons: Passport.Conditions.Caption,
          };
        })
      );
    });
  };
  useEffect(RequestPassportsTable, []);
  return (
    <>
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
        pagination={false}
        rowKey="Key"
        dataSource={PassportsTable}
        size="small"
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
