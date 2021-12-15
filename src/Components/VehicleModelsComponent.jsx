import * as React from 'react';
import { Button, Input, message, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
export default function VehicleModelsComponent(props) {
  const InputRef = React.createRef();
  const [ModelsTable, SetNewModelsTable] = useState(null);
  const [VehicleTypes, SetNewVehicleTypes] = useState(null);
  const [Manufacturers, SetNewManufacturers] = useState(null);
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
  const CancelEdited = (Index) => {
    let NewModelsTable = [...ModelsTable];
    NewModelsTable[Index].Edited = false;
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
      message.warning('Завершите редактирование модели');
    }
  };
  const SaveCaption = (Index) => {
    let NewModelsTable = [...ModelsTable];
    NewModelsTable[Index].Caption = InputRef.current.input.value;
    NewModelsTable[Index].Edited = false;
    SetNewModelsTable(NewModelsTable);
  };
  useEffect(() => {
    RequestVehicleModels();
    RequestVehicleType();
    RequestVehicleManufacturers();
  }, []);
  return (
    <Table
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
                    Сохранить
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
          render: (Value) => (
            <Select size="small" value={Value} options={Manufacturers} />
          ),
        },

        {
          title: 'Тип транспорта',
          dataIndex: 'TypeId',
          key: 'TypeId',
          render: (Value) => (
            <Select size="small" value={Value} options={VehicleTypes} />
          ),
        },
      ]}
    />
  );
}
