import * as React from 'react';
import { Button, Card, Input, Select } from 'antd';
export default function GeozoneEditor(props) {
  return (
    <div>
      <Card
        title="Геозона"
        size="small"
        actions={[
          <Button size="small" type="primary">
            Сохранить
          </Button>,
          <Button
            size="small"
            onClick={() => {
              props.GeozoneEditorHandler('Close');
            }}
          >
            Отмена
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Название:</div>
            <div>
              <Input size="small" />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Цвет:</div>
            <div>
              <Input size="small" />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Тип:</div>
            <div>
              <Select size="small" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}