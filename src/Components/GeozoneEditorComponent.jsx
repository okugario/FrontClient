import * as React from 'react';
import { Button, Card, Input, Select } from 'antd';
import { ChromePicker } from 'react-color';
import reactCSS from 'reactcss';
import { useState } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Draw } from 'ol/interaction';
import { ApiFetch } from '../Helpers/Helpers';
import { useEffect } from 'react';

const GeozoneEditor = inject('ProviderStore')(
  observer((props) => {
    const [PickerColor, SetNewPickerColor] = useState(
      props.ProviderStore.CurrentTab.Options.CurrentFeature != null
        ? props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle()
            .getFill()
            .getColor()
        : 'rgba(24,144,255,0.3)'
    );
    const [CurrentRegionId, SetNewCurrentRegionId] =
      useState('Выберите регион');
    const [GeozoneType, SetNewGeozoneType] = useState('Выберите тип');
    const [GeozoneName, SetNewGeozoneName] = useState(null);
    const [ShowColorPicker, SetNewShowColorPicker] = useState(false);
    const [AllRegions, SetNewAllRegions] = useState(null);
    const Styles = reactCSS({
      default: {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: PickerColor,
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
      SetNewGeozoneName(NewName);
      props.ProviderStore.CurrentTab.Options.CurrentFeature.setStyle(
        new Style({
          text: new Text({ text: NewName, font: 'bold 20px sans-serif' }),
          stroke:
            props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle().getStroke(),

          fill: props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle().getFill(),
        })
      );
    };

    const ChangeGeozoneType = (DrawObjectType) => {
      if (props.ProviderStore.CurrentTab.Options.CurrentFeature != null) {
        if (props.ProviderStore.CurrentTab.Options.CurrentDrawObject != null) {
          props.ProviderStore.CurrentTab.Options.MapObject.removeInteraction(
            props.ProviderStore.CurrentTab.Options.CurrentDrawObject
          );
          props.ProviderStore.SetNewCurrentDrawObject(null);
          props.ProviderStore.SetNewCurrentFeature(null);
        } else {
          props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().removeFeature(
            props.ProviderStore.CurrentTab.Options.CurrentFeature
          );
          props.ProviderStore.SetNewCurrentFeature(null);
        }
      }

      SetNewGeozoneType(DrawObjectType);

      props.ProviderStore.SetNewCurrentDrawObject(
        new Draw({
          source: props.ProviderStore.CurrentTab.Options.GetVectorLayerSource(),
          type: DrawObjectType,
          style: new Style({
            stroke: new Stroke({
              color: 'rgb(24, 144, 255)',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(24, 144, 255,0.3)',
            }),
          }),
        })
      );

      props.ProviderStore.CurrentTab.Options.MapObject.addInteraction(
        props.ProviderStore.CurrentTab.Options.CurrentDrawObject
      );
      props.ProviderStore.CurrentTab.Options.CurrentDrawObject.on(
        'drawstart',
        (DrawEvent) => {
          DrawEvent.feature.setStyle(
            new Style({
              stroke: new Stroke({
                color: 'rgb(24, 144, 255)',
                width: 2,
              }),
              fill: new Fill({
                color: 'rgba(24, 144, 255,0.3)',
              }),
            })
          );
          props.ProviderStore.SetNewCurrentFeature(DrawEvent.feature);
        }
      );
      props.ProviderStore.CurrentTab.Options.CurrentDrawObject.on(
        'drawend',
        (DrawEvent) => {
          DrawEvent.feature.setId(
            `Geozone${
              props.ProviderStore.CurrentTab.Options.GetNamedFeatures(
                /^Geozone\w{1,}/
              ).length
            }`
          );
          DrawEvent.feature.setStyle(
            props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle()
          );
          props.ProviderStore.SetNewCurrentFeature(DrawEvent.feature);
          props.ProviderStore.CurrentTab.Options.MapObject.removeInteraction(
            props.ProviderStore.CurrentTab.Options.CurrentDrawObject
          );
          props.ProviderStore.SetNewCurrentDrawObject(null);
        }
      );
      SetNewPickerColor('rgba(24,144,255,0.3)');
      SetNewGeozoneName(null);
    };

    const RequestRegions = () => {
      ApiFetch('model/Regions', 'GET', undefined, (Response) => {
        SetNewAllRegions(
          Response.data.map((Region) => {
            return { label: Region.Caption, value: Region.Id };
          })
        );
        if (props.ProviderStore.CurrentTab.Options.CurrentFeature != null) {
          SetNewCurrentRegionId(
            props.ProviderStore.CurrentTab.Options.CurrentFeature.get(
              'RegionId'
            )
          );
          SetNewGeozoneType(
            props.ProviderStore.CurrentTab.Options.CurrentFeature.getGeometry().getType()
          );
        }
      });
    };
    const ChangeGeozoneColor = (Color) => {
      SetNewPickerColor(`rgba(${Color.r},${Color.g},${Color.b},${Color.a})`);
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

    useEffect(RequestRegions, []);
    return (
      <Card
        title="Геозона"
        size="small"
        actions={[
          <Button size="small" type="primary" onClick={() => {}}>
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
                value={GeozoneName}
                disabled={
                  props.ProviderStore.CurrentTab.Options.CurrentFeature != null
                    ? false
                    : true
                }
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
                if (
                  props.ProviderStore.CurrentTab.Options.CurrentFeature != null
                ) {
                  SetNewShowColorPicker(true);
                }
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
                onChange={(Value) => {
                  ChangeGeozoneType(Value);
                }}
                value={GeozoneType}
                size="small"
                options={[
                  { label: 'Полигон', value: 'Polygon' },
                  { label: 'Окружность', value: 'Circle' },
                ]}
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
            <div>Регион:</div>
            <div>
              <Select
                value={CurrentRegionId}
                options={AllRegions}
                onChange={(Value) => {
                  SetNewCurrentRegionId(Value);
                }}
                size="small"
              />
            </div>
          </div>
        </div>
      </Card>
    );
  })
);
export default GeozoneEditor;
