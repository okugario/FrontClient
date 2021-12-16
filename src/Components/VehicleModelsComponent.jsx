import * as React from 'react';
import { Button, Input, message, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import TableButtonComponent from './TableButtonComponent';
export default function VehicleModelsComponent(props) {
  const InputRef = React.createRef();
  const [ModelsTable, SetNewModelsTable] = useState(null);
  const [VehicleTypes, SetNewVehicleTypes] = useState(null);
  const [Manufacturers, SetNewManufacturers] = useState(null);
  const [SelectedKey, SetNewSelectedKey] = useState(null);
  const RequestVehicleModels = () => {
    ApiFetch('model/VehicleModels', 'GET', undefined, (Response) => {
      SetNewModelsTable(
        Response.data.map((Model, Index) => {
          Model.Key = Index;
          Model.Edit = false;
          Model.Edited = false;
          return Model;
        })
      );
    });
  };
  const RequestVehicleType = () => {
    ApiFetch('model/VehicleTypes', 'GET', undefined, (Response) => {
      SetNewVehicleTypes(
        Response.data.map((Type) => {
          return { value: Type.Id, label: Type.Caption };
        })
      );
    });
  };

  const AddModel = () => {
    if (
      ModelsTable.every((Model) => {
        return !Model.Edited;
      })
    ) {
      let NewModelsTable = [...ModelsTable];
      NewModelsTable.unshift({
        Caption: '',
        Edited: true,
        Edit: false,
        ManftId: Manufacturers.find((Manufacturer) => {
          return Manufacturer.label == '-';
        }).value,
        TypeId: VehicleTypes.find((Type) => {
          return Type.label == '-';
        }).value,
        Key: NewModelsTable.length + 1,
      });
      SetNewModelsTable(NewModelsTable);
    } else {
      message.warning('Сначала сохраните модель');
    }
  };
  const CancelEdited = (Index) => {
    let NewModelsTable = [...ModelsTable];
    if ('Id' in NewModelsTable[Index]) {
      NewModelsTable[Index].Edited = false;
    } else {
      NewModelsTable.splice(Index, 1);
    }
    SetNewModelsTable(NewModelsTable);
  };
  const RequestVehicleManufacturers = () => {
    ApiFetch('model/Manufacturers', 'GET', undefined, (Response) => {
      SetNewManufacturers(
        Response.data.map((Type) => {
          return { value: Type.Id, label: Type.Caption };
        })
      );
    });
  };
  const EditCaption = (Index) => {
    if (
      ModelsTable.every((Model) => {
        return !Model.Edited;
      })
    ) {
      let NewModelsTable = [...ModelsTable];
      NewModelsTable[Index].Edited = true;
      SetNewModelsTable(NewModelsTable);
    } else {
      message.warning('Сначала сохраните модель');
    }
  };
  const RecordEdit = (Index, Data, ColumnId) => {
    if (ModelsTable.every((Model) => !Model.Edit)) {
      let NewModelsTable = [...ModelsTable];
      NewModelsTable[Index][ColumnId] = Data;
      NewModelsTable[Index].Edit = true;
      SetNewModelsTable(NewModelsTable);
    } else {
      message.warning('Сначала сохраните модель');
    }
  };

  const SaveCaption = (Index) => {
    if (InputRef.current.input.value.length != 0) {
      let NewModelsTable = [...ModelsTable];
      NewModelsTable[Index].Caption = InputRef.current.input.value;
      NewModelsTable[Index].Edited = false;
      NewModelsTable[Index].Edit = true;
      SetNewModelsTable(NewModelsTable);
    } else {
      message.warning('Заполните наименование модели');
    }
  };
  useEffect(() => {
    RequestVehicleModels();
    RequestVehicleType();
    RequestVehicleManufacturers();
  }, []);
  return (
    <>
      <TableButtonComponent
        onAdd={() => {
          AddModel();
        }}
      />
      <Table
        rowSelection={{
          selectedRowKeys: [SelectedKey],
          renderCell: () => null,
          columnWidth: '1px',
        }}
        scroll={{ y: 700 }}
        pagination={false}
        dataSource={ModelsTable}
        rowKey="Key"
        size="small"
        columns={[
          {
            title: 'Модель',
            dataIndex: 'Caption',
            key: 'Caption',
            render: (Value, Record, Index) => {
              return Record.Edited ? (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: '150px' }}>
                    <Input size="small" defaultValue={Value} ref={InputRef} />
                  </div>
                  <div
                    style={{
                      marginLeft: '10px',
                      display: 'flex',
                      width: '160px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        SaveCaption(Index);
                      }}
                    >
                      Применить
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        CancelEdited(Index);
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    SetNewSelectedKey(Index);
                  }}
                  style={{ cursor: 'pointer' }}
                  onDoubleClick={() => {
                    EditCaption(Index);
                  }}
                >
                  {Value}
                </div>
              );
            },
          },
          {
            title: 'Производитель',
            dataIndex: 'ManftId',
            key: 'ManftId',
            render: (Value, Record, Index) => (
              <div
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => {
                  SetNewSelectedKey(Index);
                }}
              >
                <Select
                  size="small"
                  value={Value}
                  options={Manufacturers}
                  onChange={(Value) => {
                    RecordEdit(Index, Value, 'ManftId');
                  }}
                />
              </div>
            ),
          },

          {
            title: 'Тип транспорта',
            dataIndex: 'TypeId',
            key: 'TypeId',
            render: (Value, Record, Index) => (
              <div
                onClick={() => {
                  SetNewSelectedKey(Index);
                }}
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Select
                  size="small"
                  value={Value}
                  options={VehicleTypes}
                  onChange={(Value) => {
                    RecordEdit(Index, Value, 'TypeId');
                  }}
                />
                {Record.Edit ? (
                  <div
                    style={{
                      width: '160px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button size="small" type="primary">
                      Сохранить
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        RequestVehicleModels();
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                ) : null}
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
