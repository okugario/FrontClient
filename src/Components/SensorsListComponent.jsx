import * as React from 'react';
import { Select, Card, Input, Button } from 'antd';
export default function SensorsListComponent(props) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '170px',

          padding: '10px',
        }}
      >
        <Button type="primary" size="small">
          Добавить
        </Button>
        <Button type="primary" danger size="small">
          Удалить
        </Button>
      </div>
      <div style={{ height: '100px', overflow: 'auto', width: '100%' }}>
        {props.DataSource.map((Item, Index) => {
          return (
            <Card
              key={Index}
              style={{
                width: '200px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Номер входа</span>

                <Select
                  defaultValue={Item.id}
                  size="small"
                  options={[
                    { value: 0, label: 1 },
                    { value: 1, label: 2 },
                    { value: 2, label: 3 },
                    { value: 3, label: 4 },
                  ]}
                >
                  {Item.id + 1}
                </Select>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                }}
              >
                <span>Множитель</span>
                <Input
                  size="small"
                  style={{ width: '45px' }}
                  defaultValue={Item.k}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
