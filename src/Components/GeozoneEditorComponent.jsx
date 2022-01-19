import * as React from 'react';
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  Table,
  DatePicker,
  message,
} from 'antd';
import { ChromePicker } from 'react-color';
import reactCSS from 'reactcss';
import { useState } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Draw } from 'ol/interaction';
import { ApiFetch, CoordinatesToLonLat } from '../Helpers/Helpers';
import { useEffect } from 'react';
import Moment from 'moment';
import { CloseOutlined } from '@ant-design/icons';
import { GeoJSON } from 'ol/format';
import { Feature } from 'ol';

const GeozoneEditor = inject('ProviderStore')(
  observer((props) => {
    const [PickerColor, SetNewPickerColor] = useState(
      props.ProviderStore.CurrentTab.Options.CurrentFeature != null
        ? props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle()
            .getFill()
            .getColor()
        : 'rgba(24,144,255,0.3)'
    );
    const [CurrentRegionId, SetNewCurrentRegionId] = useState('Не указан');
    const [CurrentSnapshots, SetNewCurrentSnapshots] = useState([]);
    const [GeozoneName, SetNewGeozoneName] = useState(null);
    const [GeozoneType, SetNewGeozoneType] = useState(null);
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
    const GeozoneEditorHandler = (Action) => {
      switch (Action) {
        case 'Close':
          props.ProviderStore.SetNewCurrentControls('Remove', 'GeozoneEditor');
          if (
            props.ProviderStore.CurrentTab.Options.CurrentModifyObject != null
          ) {
            props.ProviderStore.CurrentTab.Options.MapObject.removeInteraction(
              props.ProviderStore.CurrentTab.Options.CurrentModifyObject
            );
            props.ProviderStore.SetNewModifyObject(null);
          }
          if (props.ProviderStore.CurrentTab.Options.CurrentFeature != null) {
            if (
              props.ProviderStore.CurrentTab.Options.CurrentDrawObject != null
            ) {
              props.ProviderStore.CurrentTab.Options.MapObject.removeInteraction(
                props.ProviderStore.CurrentTab.Options.CurrentDrawObject
              );
            } else {
              props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().removeFeature(
                props.ProviderStore.CurrentTab.Options.CurrentFeature
              );

              const GeozoneId =
                props.ProviderStore.CurrentTab.Options.CurrentFeature.getId().slice(
                  7
                );
              if (
                props.ProviderStore.CurrentTab.Options.CheckedGeozonesKeys.includes(
                  GeozoneId
                )
              ) {
                let NewCheckedGeozonesKeys = [
                  ...props.ProviderStore.CurrentTab.Options.CheckedGeozonesKeys,
                ];
                NewCheckedGeozonesKeys.splice(
                  NewCheckedGeozonesKeys.findIndex((Geozone) => {
                    return Geozone == GeozoneId;
                  }),
                  1
                );
                props.ProviderStore.SetNewCheckedGeozonesKeys(
                  NewCheckedGeozonesKeys
                );
              }
              props.ProviderStore.SetNewCurrentFeature(null);
            }
          }

          break;

        case 'Save':
          if (
            props.ProviderStore.CurrentTab.Options.CurrentFeature != null &&
            props.ProviderStore.CurrentTab.Options.CurrentDrawObject == null
          ) {
            if (
              props.ProviderStore.CurrentTab.Options.CurrentModifyObject != null
            ) {
              props.ProviderStore.CurrentTab.Options.MapObject.removeInteraction(
                props.ProviderStore.CurrentTab.Options.CurrentModifyObject
              );
              props.ProviderStore.SetNewModifyObject(null);
            }
            ApiFetch(
              `model/Geofences${
                /^Geozone\d+$/.test(
                  props.ProviderStore.CurrentTab.Options.CurrentFeature.getId()
                )
                  ? ''
                  : `/${props.ProviderStore.CurrentTab.Options.CurrentFeature.getId().slice(
                      7
                    )}`
              }`,
              `${
                /^Geozone\d+$/.test(
                  props.ProviderStore.CurrentTab.Options.CurrentFeature.getId()
                )
                  ? 'POST'
                  : 'PATCH'
              }`,
              {
                Id: /^Geozone\d+$/.test(
                  props.ProviderStore.CurrentTab.Options.CurrentFeature.getId()
                )
                  ? undefined
                  : props.ProviderStore.CurrentTab.Options.CurrentFeature.getId().slice(
                      7
                    ),

                RegionId:
                  props.ProviderStore.CurrentTab.Options.CurrentFeature.get(
                    'RegionId'
                  ),
                Caption:
                  props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle()
                    .getText()
                    .getText(),
                Options: {
                  color:
                    props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle()
                      .getFill()
                      .getColor(),
                  type: props.ProviderStore.CurrentTab.Options.CurrentFeature.getGeometry().getType(),
                },
                Geometries:
                  SelectedKey != null ? CurrentSnapshots : NewSnapshots,
              },
              (Response) => {
                props.ProviderStore.SetNewCurrentControls(
                  'Remove',
                  'GeozoneEditor'
                );
                props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().removeFeature(
                  props.ProviderStore.CurrentTab.Options.CurrentFeature
                );
                props.ProviderStore.SetNewCurrentFeature(null);
              }
            );
          } else {
            message.warning('Завершите рисование геозоны');
          }
          break;
      }
    };
    const AddGeozoneSnapshot = () => {
      if (GeozoneType != null) {
        if (props.ProviderStore.CurrentTab.Options.CurrentDrawObject == null) {
          if (props.ProviderStore.CurrentTab.Options.CurrentFeature != null) {
            props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().removeFeature(
              props.ProviderStore.CurrentTab.Options.CurrentFeature
            );
            props.ProviderStore.SetNewCurrentFeature(null);
          }

          props.ProviderStore.SetNewCurrentDrawObject(
            new Draw({
              source:
                props.ProviderStore.CurrentTab.Options.GetVectorLayerSource(),
              type: GeozoneType,
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
              let NewCurrentSnapshots = [...CurrentSnapshots];
              const NewSnapshot = {
                TS: Moment().format(),

                Feature:
                  props.ProviderStore.CurrentTab.Options.CurrentFeature.getGeometry(),

                Geometry: CoordinatesToLonLat(
                  props.ProviderStore.CurrentTab.Options.CurrentFeature.getGeometry().getCoordinates()
                ),
              };
              NewCurrentSnapshots.unshift(NewSnapshot);

              SetNewCurrentSnapshots(NewCurrentSnapshots);
              SetNewSelectedKey(NewSnapshot.TS);
            }
          );
          SetNewPickerColor('rgba(24,144,255,0.3)');
        }
      } else {
        message.warning('Выберите тип геозоны');
      }
    };
    const GetRegionId = () => {
      if (props.ProviderStore.CurrentTab.Options.CurrentFeature != null) {
        SetNewCurrentRegionId(
          props.ProviderStore.CurrentTab.Options.CurrentFeature.get('RegionId')
        );
      }
    };
    const GetGeozoneName = () => {
      if (props.ProviderStore.CurrentTab.Options.CurrentFeature != null) {
        SetNewGeozoneName(
          props.ProviderStore.CurrentTab.Options.CurrentFeature.getStyle()
            .getText()
            .getText()
        );
      }
    };
    const GetGeozoneSnapshots = () => {
      if (props.ProviderStore.CurrentTab.Options.CurrentFeature != null) {
        if (
          props.ProviderStore.CurrentTab.Options.CurrentFeature.get(
            'GeozoneSnapshots'
          ) != undefined
        ) {
          SetNewCurrentSnapshots(
            props.ProviderStore.CurrentTab.Options.CurrentFeature.get(
              'GeozoneSnapshots'
            )
          );
        }
      }
    };
    const RequestRegions = () => {
      ApiFetch('model/Regions', 'GET', undefined, (Response) => {
        SetNewAllRegions(
          Response.data.map((Region) => {
            return { label: Region.Caption, value: Region.Id };
          })
        );
      });
    };
    const ChangeCurrentGeometry = () => {
      if (
        props.ProviderStore.CurrentTab.Options.CurrentFeature != null &&
        SelectedKey != null
      ) {
        props.ProviderStore.CurrentTab.Options.CurrentFeature.setGeometry(
          CurrentSnapshots.find((Snapshot) => {
            return Snapshot.TS == SelectedKey;
          }).Feature
        );
      }
    };
    const DeleteSnapshot = (Index) => {
      let NewSnapshots = [...CurrentSnapshots];
      NewSnapshots.splice(Index, 1);
      SetNewCurrentSnapshots(NewSnapshots);
      if (Index != 0) {
        SetNewSelectedKey(NewSnapshots[Index - 1].TS);
      }
      if (NewSnapshots.length == 0) {
        props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().removeFeature(
          props.ProviderStore.CurrentTab.Options.CurrentFeature
        );
      }
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
    const GetGeozoneType = () => {
      if (GeozoneType != null) {
        return GeozoneType;
      } else {
        if (
          props.ProviderStore.CurrentTab.Options.CurrentFeature != null &&
          props.ProviderStore.CurrentTab.Options.DrawObject == null
        ) {
          return props.ProviderStore.CurrentTab.Options.CurrentFeature.getGeometry().getType();
        } else {
          return 'Выберите тип';
        }
      }
    };
    useEffect(() => {
      ChangeCurrentGeometry();
    }, [SelectedKey]);
    useEffect(() => {
      GetGeozoneSnapshots();
      RequestRegions();
      GetRegionId();
      GetGeozoneName();
    }, []);
    return (
      <Card
        title="Геозона"
        size="small"
        actions={[
          <Button
            size="small"
            type="primary"
            onClick={() => {
              GeozoneEditorHandler('Save');
            }}
          >
            Сохранить
          </Button>,
          <Button
            size="small"
            onClick={() => {
              GeozoneEditorHandler('Close');
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
                value={GetGeozoneType()}
                onChange={(Value) => {
                  SetNewGeozoneType(Value);
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
                    : CurrentRegionId
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
                  SetNewCurrentRegionId(Value);
                }}
                size="small"
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
            <Button
              size="small"
              type="primary"
              onClick={() => {
                AddGeozoneSnapshot();
              }}
            >
              Добавить снимок
            </Button>
          </div>

          <Table
            rowSelection={{
              selectedRowKeys: [SelectedKey],
              hideSelectAll: true,
              renderCell: () => null,
              columnWidth: 1,
            }}
            rowKey="TS"
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
                        SetNewSelectedKey(Record.TS);
                      }}
                      style={{
                        cursor: 'pointer',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      {Moment(Value).format('DD.MM.YYYY HH:mm:ss')}
                      <CloseOutlined
                        onClick={() => {
                          Modal.confirm({
                            title: 'Подтвердите удаление',
                            content:
                              'Вы действительно хотите удалить снимок геозоны?',
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
