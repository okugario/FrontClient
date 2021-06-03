import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, message, Input, Modal } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';

export default function RegionsComponent() {
  const InputRef = React.createRef();
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const [RegionsTable, SetNewRegionsTable] = useState(null);
  const [DeleteModalVisible, SetNewDeleteModalVisible] = useState(false);
  const RequestTable = () => {
    return ApiFetch('model/Regions', 'GET', undefined, (Response) => {
      SetNewRegionsTable(
        Response.data.map((Region, Index) => {
          Region.Index = Index;
          Region.Edit = false;
          return Region;
        })
      );
    });
  };
  const RegionsHandler = (Action, Index) => {
    let NewRegionsTable = [...RegionsTable];
    switch (Action) {
      case 'EditRegion':
        if (
          RegionsTable.some((Region) => {
            return Region.Edit;
          })
        ) {
          message.warn('Сохраните участок');
        } else {
          NewRegionsTable[Index].Edit = true;
          SetNewRegionsTable(NewRegionsTable);
        }

        break;
      case 'AddRegion':
        if (
          NewRegionsTable.some((Region) => {
            return Region.Edit;
          })
        ) {
          message.warn('Сохраните участок');
        } else {
          NewRegionsTable.unshift({
            Caption: '',
            Edit: true,
            Index: NewRegionsTable.length,
          });
          SetNewRegionsTable(NewRegionsTable);
        }

        break;
      case 'SaveRegion':
        if (InputRef.current.input.value.length != 0) {
          if (
            NewRegionsTable.some((Region) => {
              return Region.Caption == InputRef.current.input.value;
            })
          ) {
            message.warn('Укажите другое наименование');
          } else {
            NewRegionsTable[Index].Caption = InputRef.current.input.value;

            ApiFetch(
              `model/Regions${
                'Id' in NewRegionsTable[Index]
                  ? `/${NewRegionsTable[Index].Id}`
                  : ''
              }`,
              'Id' in NewRegionsTable[Index] ? 'PATCH' : 'POST',
              NewRegionsTable[Index],
              (Response) => {
                RequestTable();
              }
            );
          }
        } else {
          message.warn('Заполните наименование участка');
        }

        break;
      case 'EditCancel':
        if ('Id' in NewRegionsTable[Index]) {
          NewRegionsTable[Index].Edit = false;
        } else {
          NewRegionsTable.splice(Index, 1);
        }

        SetNewRegionsTable(NewRegionsTable);
        break;
      case 'DeleteRegion':
        if (
          'Id' in
          NewRegionsTable.find((Region) => {
            return Region.Index == Index;
          })
        ) {
          ApiFetch(
            `model/Regions/${
              NewRegionsTable.find((Region) => {
                return Region.Index == Index;
              }).Id
            }`,
            'DELETE',
            undefined,
            (Response) => {
              RequestTable().then(() => {
                SetNewDeleteModalVisible(false);
              });
            }
          );
        } else {
          NewRegionsTable.splice(
            NewRegionsTable.findIndex((Region) => {
              return Region.Index == Index;
            }),
            1
          );
          SetNewRegionsTable(NewRegionsTable);
          SetNewDeleteModalVisible(false);
        }

        break;
    }
  };
  useEffect(RequestTable, []);
  return (
    <div className="FullExtend">
      <Modal
        visible={DeleteModalVisible}
        okText="Удалить"
        okButtonProps={{ size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
        title="Подтвердите действие"
        onCancel={() => {
          SetNewDeleteModalVisible(false);
        }}
        onOk={() => {
          RegionsHandler('DeleteRegion', SelectedKey);
        }}
      >
        Вы действительно хотите удалить участок?
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
            RegionsHandler('AddRegion');
          }}
        >
          Добавить
        </Button>
        <Button
          size="small"
          danger
          type="primary"
          onClick={() => {
            SetNewDeleteModalVisible(true);
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
              RegionsHandler('EditRegion', Record['Index']);
            },
          };
        }}
        dataSource={RegionsTable}
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
                        RegionsHandler('SaveRegion', Index);
                      }}
                      size="small"
                      type="primary"
                      style={{ marginLeft: '10px' }}
                    >
                      Сохранить
                    </Button>
                    <Button
                      onClick={() => {
                        RegionsHandler('EditCancel', Index);
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
}
