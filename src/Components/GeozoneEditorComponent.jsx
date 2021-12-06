import * as React from 'react';
import { Button, Card, Input, Modal, Select, Table, DatePicker } from 'antd';
import { ChromePicker } from 'react-color';
import reactCSS from 'reactcss';
import { useState } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Draw } from 'ol/interaction';
import { ApiFetch } from '../Helpers/Helpers';
import { useEffect } from 'react';
import Moment from 'moment';
import { CloseOutlined } from '@ant-design/icons';

const GeozoneEditor = inject('ProviderStore')(
  observer((props) => {
    const [PickerColor, SetNewPickerColor] = useState(
      props.ProviderStore.CurrentTab.Options.CurrentFeature != null
        ? props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle()
            .getFill()
            .getColor()
        : 'rgba(24,144,255,0.3)'
    );
    const [CurrentRegionId, SetNewCurrentRegionId] = useState(null);
    const [CurrentSnapshots, SetNewCurrentSnapshots] = useState([]);
    const [GeozoneName, SetNewGeozoneName] = useState(null);
    const [GeozoneType, SetNewGeozoneType] = useState('Выберите тип');
    const [ShowColorPicker, SetNewShowColorPicker] = useState(false);
    const [AllRegions, SetNewAllRegions] = useState(null);
    const [SelectedKey, SetNewSelectedKey] = useState(null);
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
              text:
                GeozoneName != null
                  ? new Text({
                      text: GeozoneName,
                      font: 'bold 20px sans-serif',
                    })
                  : undefined,
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
          DrawEvent.feature.set('RegionId', CurrentRegionId);
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

          SetNewGeozoneName(
            props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle()
              .getText()
              .getText()
          );
          if (
            props.ProviderStore.CurrentTab.Options.CurrentFeature.get(
              'GeozoneHistory'
            ) != undefined
          ) {
            SetNewCurrentSnapshots(
              props.ProviderStore.CurrentTab.Options.CurrentFeature.get(
                'GeozoneHistory'
              ).map((Element, Index) => {
                Element.Key = Index;
                return Element;
              })
            );
          }
        }
      });
    };
    const DeleteSnapshot = (Index) => {
      let NewSnapshots = [...CurrentSnapshots];
      NewSnapshots.splice(Index, 1);
      SetNewCurrentSnapshots(NewSnapshots);
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
          <Button
            size="small"
            type="primary"
            onClick={() => {
              props.GeozoneEditorHandler('Save');
            }}
          >
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
            width: '250px',
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
                value={
                  props.ProviderStore.CurrentTab.Options.CurrentFeature !=
                    null &&
                  props.ProviderStore.CurrentTab.Options.DrawObject == null
                    ? props.ProviderStore.CurrentTab.Options.CurrentFeature.getGeometry().getType()
                    : GeozoneType
                }
                onChange={(Value) => {
                  SetNewGeozoneType(Value);
                  ChangeGeozoneType(Value);
                }}
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
                value={
                  props.ProviderStore.CurrentTab.Options.CurrentFeature !=
                    null &&
                  props.ProviderStore.CurrentTab.Options.CurrentFeature.get(
                    'RegionId'
                  ) != undefined
                    ? props.ProviderStore.CurrentTab.Options.CurrentFeature.get(
                        'RegionId'
                      )
                    : 'Выберите регион'
                }
                options={AllRegions}
                disabled={
                  props.ProviderStore.CurrentTab.Options.CurrentFeature ==
                    null ||
                  props.ProviderStore.CurrentTab.Options.CurrentDrawObject !=
                    null
                }
                onChange={(Value) => {
                  props.ProviderStore.CurrentTab.Options.CurrentFeature.set(
                    'RegionId',
                    Value
                  );
                }}
                size="small"
              />
            </div>
          </div>
          <Table
            rowSelection={{
              selectedRowKeys: [SelectedKey],
              hideSelectAll: true,
              renderCell: () => null,
              columnWidth: 1,
            }}
            rowKey="Key"
            scroll={{ y: '300px' }}
            pagination={false}
            dataSource={CurrentSnapshots}
            columns={[
              {
                title: 'Дата изменения',
                dataIndex: 'TS',
                key: 'TS',
                render: (Value, Record, Index) => {
                  return (
                    <div
                      onClick={() => {
                        SetNewSelectedKey(Index);
                      }}
                      style={{
                        cursor: 'pointer',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <DatePicker
                        style={{ width: '170px' }}
                        size="small"
                        value={Moment(Value)}
                        format="DD.MM.YYYY HH:mm:ss"
                      />
                      <CloseOutlined
                        onClick={() => {
                          Modal.confirm({
                            title: 'Подтвердите удаление?',
                            content:
                              'Вы действительно хотите удалить это изменение?',
                            okButtonProps: {
                              size: 'small',
                              type: 'primary',
                              danger: true,
                            },
                            onOk: () => {
                              DeleteSnapshot(Index);
                            },
                            cancelButtonProps: { size: 'small' },
                            cancelText: 'Отменить',
                            okText: 'Удалить',
                          });
                        }}
                        style={{ color: 'red', cursor: 'pointer' }}
                      />
                    </div>
                  );
                },
              },
            ]}
            size="small"
          />
        </div>
      </Card>
    );
  })
);
export default GeozoneEditor;
