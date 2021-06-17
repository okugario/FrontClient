import * as React from 'react';
import { useState } from 'react';
import { Input, Select, Button, Table, DatePicker, Modal } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import Moment from 'moment';
export default function TransportPrfoile(props) {
  console.log(props);
  const [ShowFirmHistory, SetShowFirmHistory] = useState(false);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Наименование:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            size="small"
            style={{ width: '160px' }}
            value={props.Profile.Profile.caption}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Номер АТ:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            size="small"
            style={{ width: '160px' }}
            disabled
            value={props.Profile.Profile.Id}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Тип ТС:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            size="small"
            value={props.Profile.Profile.Model.TypeId}
            style={{ width: '160px' }}
            options={props.Profile.AllTypes.map((Type) => {
              return { value: Type.Id, label: Type.Caption };
            })}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>Модель:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            size="small"
            value={props.Profile.Profile.Model.Id}
            style={{ width: '160px' }}
            options={props.Profile.AllModels.map((Type) => {
              return { value: Type.Id, label: Type.Caption };
            })}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Организация:
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            value={
              props.Profile.AllFirms.find((Firm) => {
                return Firm.Id == props.Profile.Profile.Owners[0].FirmId;
              }).Caption
            }
            size="small"
            style={{ width: '135px' }}
          />
          <Button
            icon={ShowFirmHistory ? <CaretUpOutlined /> : <CaretDownOutlined />}
            onClick={() => {
              SetShowFirmHistory(!ShowFirmHistory);
            }}
            size="small"
            type="primary"
          />
        </div>
      </div>
      {ShowFirmHistory ? (
        <>
          <Button
            size="small"
            type="primary"
            style={{ margin: '5px' }}
            onClick={() => {
              props.ProfileHandler('AddFirm');
            }}
          >
            Добавить
          </Button>
          <Button size="small" danger type="primary" style={{ margin: '5px' }}>
            Удалить
          </Button>

          <Table
            rowKey="Key"
            onRow={(Record) => {
              return {
                onClick: () => {
                  SetNewSelectedKey(Record.Key);
                },
              };
            }}
            rowSelection={{
              hideSelectAll: true,
              columnWidth: 0,
              renderCell: () => {
                return null;
              },
              selectedRowKeys: [SelectedKey],
            }}
            pagination={false}
            dataSource={props.Profile.Profile.Owners.map((Owner, Index) => {
              return { Key: Index, TS: Owner.TS, FirmId: Owner.FirmId };
            })}
            size="small"
            columns={[
              {
                title: 'Дата',
                dataIndex: 'TS',
                key: 'TS',
                render: (Text, Record, Index) => {
                  return (
                    <div style={{ cursor: 'pointer' }}>
                      <DatePicker
                        showTime={true}
                        onOk={() => {
                          Modal.confirm({
                            title: 'Подтвердите изменение',
                            content: 'Вы действительно хотите изменить дату?',
                            okText: 'Да',
                            okButtonProps: { size: 'small' },
                            cancelButtonProps: { size: 'small' },
                            cancelText: 'Нет',
                          });
                        }}
                        size="small"
                        value={Moment(Text)}
                        format="DD.MM.YYYY hh:mm:ss"
                      />
                    </div>
                  );
                },
              },
              {
                title: 'Наименование',
                dataIndex: 'FirmId',
                key: 'FirmId',
                render: (Text, Record, Index) => {
                  return (
                    <div style={{ cursor: 'pointer' }}>
                      <Select
                        onSelect={() => {
                          Modal.confirm({
                            title: 'Подтвердите изменение',
                            content:
                              'Вы действительно хотите изменить организацию?',
                            okText: 'Да',
                            okButtonProps: { size: 'small' },
                            cancelButtonProps: { size: 'small' },
                            cancelText: 'Нет',
                          });
                        }}
                        style={{ width: '160px' }}
                        value={Text}
                        size="small"
                        options={props.Profile.AllFirms.map((Type) => {
                          return { value: Type.Id, label: Type.Caption };
                        })}
                      />
                    </div>
                  );
                },
              },
            ]}
          />
        </>
      ) : null}
    </>
  );
}
