import * as React from 'react';
import { useEffect, useState, createRef } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { Table, Modal, Button, message } from 'antd';
import ConfigSchemesProfile from './ConfigSchemesProfile';
export default function ConfigSchemesComponent() {
  const [SchemesTable, SetNewSchemesTable] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [ShowProfile, SetNewShowProfile] = useState(false);
  const [Scheme, SetNewScheme] = useState(null);
  const [OptionsValid, SetNewOptionsValid] = useState(true);
  const RequestScheme = (SchemeId) => {
    return ApiFetch(
      `model/ConfigSchemes/${SchemeId}`,
      'GET',
      undefined,
      (Response) => {
        SetNewScheme(Response.data);
      }
    );
  };
  const SchemeHandler = (Action, Data) => {
    let NewScheme = Scheme != null ? Scheme : { Caption: '', Options: {} };
    switch (Action) {
      case 'CloseScheme':
        SetNewScheme(null);
        SetNewShowProfile(false);

        break;
      case 'AddScheme':
        SetNewScheme(NewScheme);
        SetNewShowProfile(true);
        break;
      case 'ChangeCaption':
        NewScheme.Caption = Data;
        SetNewScheme(NewScheme);
        break;
      case 'ChangeOptions':
        try {
          NewScheme.Options = JSON.parse(Data);
          SetNewScheme(NewScheme);
          SetNewOptionsValid(true);
        } catch (Error) {
          SetNewOptionsValid(false);
        }
        break;
      case 'SaveScheme':
        if (OptionsValid) {
          ApiFetch(
            `model/ConfigSchemes${'Id' in Scheme ? `/${Scheme.Id}` : ''}`,
            'Id' in Scheme ? 'PATCH' : 'POST',
            Scheme,
            (Response) => {
              RequestSchemesTable().then(() => {
                SetNewShowProfile(false);
              });
            }
          ).catch(() => {
            message.warning('Укажите корректное наименование');
          });
        } else {
          message.warning('Некорректная схема');
        }
        break;
      case 'DeleteScheme':
        ApiFetch(
          `model/ConfigSchemes/${SelectedKey}`,
          'DELETE',
          undefined,
          (Response) => {
            RequestSchemesTable().then(() => {
              SetNewShowProfile(false);
            });
          }
        );
        break;
    }
  };
  const RequestSchemesTable = () => {
    return ApiFetch('model/ConfigSchemes', 'GET', undefined, (Response) => {
      SetNewSchemesTable(Response.data);
    });
  };
  useEffect(RequestSchemesTable, []);
  return (
    <>
      <Modal
        destroyOnClose={true}
        onOk={() => {
          SchemeHandler('SaveScheme');
        }}
        okText="Сохранить"
        onCancel={() => {
          SchemeHandler('CloseScheme');
        }}
        title="Схема настроек"
        visible={ShowProfile}
        cancelButtonProps={{ size: 'small' }}
        okButtonProps={{ size: 'small' }}
      >
        <ConfigSchemesProfile SchemeHandler={SchemeHandler} Scheme={Scheme} />
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
            SchemeHandler('AddScheme');
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
                title: 'Подтвердите действие',
                content: 'Удалить выбранный объект?',
                okButtonProps: { type: 'primary', size: 'small', danger: true },
                cancelButtonProps: { size: 'small' },
                okText: 'Удалить',
                cancelText: 'Отмена',
                onOk: () => {
                  SchemeHandler('DeleteScheme');
                },
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
              SetNewSelectedKey(Record.Id);
            },
            onDoubleClick: () => {
              RequestScheme(Record.Id).then(() => {
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
        scroll={{ y: 700 }}
        rowKey="Id"
        pagination={false}
        dataSource={SchemesTable}
        size="small"
        columns={[
          {
            title: 'Наименование',
            dataIndex: 'Caption',
            key: 'Caption',
            render: (Value) => {
              return <div style={{ cursor: 'pointer' }}>{Value}</div>;
            },
          },
        ]}
      />
    </>
  );
}
