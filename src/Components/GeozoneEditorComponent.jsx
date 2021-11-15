import * as React from 'react';
import { Button, Card, Input, Select, Popconfirm } from 'antd';
import { ChromePicker } from 'react-color';
import reactCSS from 'reactcss';
import { useState } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Fill, Stroke, Style, Text } from 'ol/style';

const GeozoneEditor = inject('ProviderStore')(
  observer((props) => {
    const [PickerColor, SetNewPickerColor] = useState({
      r: '24',
      g: '144',
      b: '255',
      a: '0.3',
    });
    const [ShowColorPicker, SetNewShowColorPicker] = useState(false);
    const Styles = reactCSS({
      default: {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${PickerColor.r}, ${PickerColor.g}, ${PickerColor.b}, ${PickerColor.a})`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    const ChangeGeozoneName = (NewName) => {
      props.ProviderStore.CurrentTab.Options.CurrentFeature.setStyle(
        new Style({
          text: new Text({ text: NewName, font: 'bold 20px sans-serif' }),
          stroke:
            props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle().getStroke(),

          fill: props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle().getFill(),
        })
      );
    };
    const ChangeGeozoneColor = (Color) => {
      SetNewPickerColor(Color);
      props.ProviderStore.CurrentTab.Options.CurrentFeature.setStyle(
        new Style({
          text: props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle().getText(),
          stroke: new Stroke({
            color: `rgb(${Color.r},${Color.g},${Color.b})`,
          }),
          fill: new Fill({
            color: `rgba(${Color.r},${Color.g},${Color.b},${Color.a})`,
          }),
        })
      );
    };
    return (
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '10px',
            width: '200px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Название:</div>
            <div style={{ width: '120px' }}>
              <Input
                size="small"
                onChange={(Event) => {
                  ChangeGeozoneName(Event.target.value);
                }}
              />
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

            <div
              style={Styles.swatch}
              onClick={() => {
                SetNewShowColorPicker(true);
              }}
            >
              <div style={Styles.color} />
            </div>
            {ShowColorPicker ? (
              <div style={Styles.popover}>
                <div
                  style={Styles.cover}
                  onClick={() => {
                    SetNewShowColorPicker(false);
                  }}
                />
                <ChromePicker
                  color={PickerColor}
                  onChange={(Color) => {
                    ChangeGeozoneColor(Color.rgb);
                  }}
                />
              </div>
            ) : null}
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
              <Select
                defaultValue="Polygon"
                size="small"
                options={[
                  { label: 'Полигон', value: 'Polygon' },
                  { label: 'Окружность', value: 'Circle' },
                ]}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  })
);
export default GeozoneEditor;
