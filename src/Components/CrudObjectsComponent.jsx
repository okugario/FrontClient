import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, message, Input, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import { inject, observer } from 'mobx-react';

const ObjectsComponent = inject('ProviderStore')(
  observer((props) => {
    const InputRef = React.createRef();
    const [SelectedKey, SetNewSelectedKey] = useState(null);
    const [ObjectsTable, SetNewObjectsTable] = useState(null);

    const RequestTable = () => {
      return ApiFetch(
        `model/${props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id}`,
        'GET',
        undefined,
        (Response) => {
          SetNewObjectsTable(
            Response.data.map((Object, Index) => {
              Object.Index = Index;
              Object.Edit = false;
              return Object;
            })
          );
        }
      );
    };
    const ObjectsHandler = (Action, Index) => {
      let NewObjectsTable = [...ObjectsTable];
      switch (Action) {
        case 'EditObject':
          if (
            ObjectsTable.some((Object) => {
              return Object.Edit;
            })
          ) {
            message.warn('Сохраните объект');
          } else {
            NewObjectsTable[Index].Edit = true;
            SetNewObjectsTable(NewObjectsTable);
          }

          break;
        case 'AddObject':
          if (
            NewObjectsTable.some((Object) => {
              return Object.Edit;
            })
          ) {
            message.warn('Сохраните объект');
          } else {
            NewObjectsTable.unshift({
              Caption: '',
              Edit: true,
              Index: NewObjectsTable.length,
            });
            SetNewObjectsTable(NewObjectsTable);
          }

          break;
        case 'SaveObject':
          if (InputRef.current.input.value.length != 0) {
            if (
              NewObjectsTable.some((Object) => {
                return Object.Caption == InputRef.current.input.value;
              })
            ) {
              message.warn('Укажите другое наименование');
            } else {
              NewObjectsTable[Index].Caption = InputRef.current.input.value;

              ApiFetch(
                `model/${
                  props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id
                }${
                  'Id' in NewObjectsTable[Index]
                    ? `/${NewObjectsTable[Index].Id}`
                    : ''
                }`,
                'Id' in NewObjectsTable[Index] ? 'PATCH' : 'POST',
                NewObjectsTable[Index],
                (Response) => {
                  RequestTable();
                }
              );
            }
          } else {
            message.warn('Заполните наименование объекта');
          }

          break;
        case 'EditCancel':
          if ('Id' in NewObjectsTable[Index]) {
            NewObjectsTable[Index].Edit = false;
          } else {
            NewObjectsTable.splice(Index, 1);
          }

          SetNewObjectsTable(NewObjectsTable);
          break;
        case 'DeleteObject':
          if (
            'Id' in
            NewObjectsTable.find((Object) => {
              return Object.Index == Index;
            })
          ) {
            ApiFetch(
              `model/${
                props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id
              }/${
                NewObjectsTable.find((Object) => {
                  return Object.Index == Index;
                }).Id
              }`,
              'DELETE',
              undefined,
              (Response) => {
                RequestTable();
              }
            );
          } else {
            NewObjectsTable.splice(
              NewObjectsTable.findIndex((Object) => {
                return Object.Index == Index;
              }),
              1
            );
            SetNewObjectsTable(NewObjectsTable);
          }

          break;
      }
    };
    useEffect(RequestTable, [props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id]);
    return (
      <div className="FullExtend">
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
              ObjectsHandler('AddObject');
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

                  onOk: () => {
                    ObjectsHandler('DeleteObject', SelectedKey);
                  },
                });
              }
            }}
          >
            Удалить
          </Button>
        </div>
        <Table
          scroll={{ scrollToFirstRowOnChange: true, y: 700 }}
          pagination={false}
          rowSelection={{
            columnWidth: 0,
            selectedRowKeys: [SelectedKey],
            hideSelectAll: true,
            renderCell: () => {
              return null;
            },
          }}
          onRow={(Record) => {
            return {
              onClick: () => {
                SetNewSelectedKey(Record['Index']);
              },
              onDoubleClick: () => {
                ObjectsHandler('EditObject', Record['Index']);
              },
            };
          }}
          dataSource={ObjectsTable}
          rowKey="Index"
          size="small"
          columns={[
            {
              title: 'Наименование',
              key: 'Caption',
              dataIndex: 'Caption',
              render: (Text, Record, Index) => {
                if (Record.Edit) {
                  return (
                    <>
                      <Input
                        defaultValue={Record['Caption']}
                        size="small"
                        style={{ width: '150px' }}
                        ref={InputRef}
                      />
                      <Button
                        onClick={() => {
                          ObjectsHandler('SaveObject', Index);
                        }}
                        size="small"
                        type="primary"
                        style={{ marginLeft: '10px' }}
                      >
                        Сохранить
                      </Button>
                      <Button
                        onClick={() => {
                          ObjectsHandler('EditCancel', Index);
                        }}
                        size="small"
                        style={{ marginLeft: '10px' }}
                      >
                        Отмена
                      </Button>
                    </>
                  );
                } else {
                  return <div style={{ cursor: 'pointer' }}>{Text}</div>;
                }
              },
            },
          ]}
        />
      </div>
    );
  })
);
export default ObjectsComponent;
