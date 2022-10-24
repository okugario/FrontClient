import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, message } from 'antd';
import { getLength } from 'ol/sphere';
import * as ReactDOM from 'react-dom';
import MapTooltipComponent from './MapTooltipComponent';
import GeozoneEditorComponent from './GeozoneEditorComponent';
import OverlayPositioning from 'ol/OverlayPositioning';
import Draw from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import Stroke from 'ol/style/Stroke';
import { Icon, Style, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import LineString from 'ol/geom/LineString';
import TrackPlayerComponent from './TrackPlayerComponent';
import Control from 'ol/control/Control';
import GeoJSON from 'ol/format/GeoJSON';
import TruckSVG from '../Svg/Truck.svg';
import { useEffect } from 'react';
import { ApiFetch } from '../Helpers/Helpers';
import { toLonLat } from 'ol/proj';

const MapButtonBarComponent = inject('ProviderStore')(
  observer((props) => {
    let GeozoneEditorElement = document.createElement('div');
    GeozoneEditorElement.id = 'GeozoneEditor';
    let TrackPlayerElement = document.createElement('div');
    TrackPlayerElement.id = 'TrackPlayer';
    const AddTrackPlayer = () => {
      let TrackPlayerControl = new Control({
        element: TrackPlayerElement,
      });
      TrackPlayerControl.set('Id', 'TrackPlayer');
      props.ProviderStore.CurrentTab.Options.MapObject.addControl(
        TrackPlayerControl
      );
      props.ProviderStore.CurrentTab.Options.GetNamedFeatures(
        /^Track\w{1,}/
      ).forEach((Track) => {
        const Feature = new GeoJSON().readFeature({
          type: 'Feature',
          id: `Mark${Track.getId()}`,
          geometry: {
            type: 'Point',
            coordinates: Track.getGeometry().getCoordinateAt(0),
          },
        });

        Feature.setStyle(
          new Style({
            text: new Text({
              font: 'bold 10px sans-serif',
              text: Track.values_.caption,
              offsetX: 30,
              offsetY: -10,
            }),
            image: new Icon({
              anchor: [0.5, 1],
              src: TruckSVG,
              scale: [0.2, 0.2],
            }),
          })
        );
        props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().addFeature(
          Feature
        );
      });
    };

    const AddGeozoneEditor = () => {
      let GeozoneControl = new Control({
        element: GeozoneEditorElement,
      });
      GeozoneControl.set('Id', 'GeozoneEditor');
      props.ProviderStore.CurrentTab.Options.MapObject.addControl(
        GeozoneControl
      );
    };
    const MapControlsHandler = () => {
      if (
        props.ProviderStore.CurrentTab.Options.CurrentControls.find(
          (Element) => {
            return Element.Id == 'GeozoneEditor';
          }
        ) != undefined
      ) {
        AddGeozoneEditor();
      }
      if (
        props.ProviderStore.CurrentTab.Options.CurrentControls.find(
          (Element) => {
            return Element.Id == 'TrackPlayer';
          }
        ) != undefined
      ) {
        AddTrackPlayer();
      }
    };
    const FormatLength = (Line) => {
      if (getLength(Line) > 100) {
        return `${Math.round((getLength(Line) / 1000) * 100) / 100} km`;
      } else {
        return `${Math.round(getLength(Line) * 100) / 100} m `;
      }
    };
    const CreateMapTooltip = (OverlayID) => {
      let RulerTooltipElement = document.createElement('div');
      RulerTooltipElement.id = `Ruler${
        props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatures()
          .length
      }`;

      let OverlayTooltip = new Overlay({
        id: OverlayID,
        element: RulerTooltipElement,
        offset: [15, 0],
        positioning: OverlayPositioning.CENTER_LEFT,
      });
      props.ProviderStore.CurrentTab.Options.MapObject.addOverlay(
        OverlayTooltip
      );
      return OverlayTooltip;
    };
    const Ruler = () => {
      if (
        props.ProviderStore.CurrentTab.Options.MapObject.getInteractions().getLength() ==
        8
      ) {
        let DrawObject = new Draw({
          source: props.ProviderStore.CurrentTab.Options.GetVectorLayerSource(),
          type: GeometryType.LINE_STRING,
          style: new Style({
            stroke: new Stroke({
              color: 'rgb(24, 144, 255)',
              lineDash: [10, 10],
              width: 2,
            }),
          }),
        });
        let OverlayTooltip = null;

        OverlayTooltip = CreateMapTooltip(
          `Ruler${
            props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatures()
              .length
          }`
        );

        props.ProviderStore.CurrentTab.Options.MapObject.addInteraction(
          DrawObject
        );
        DrawObject.on('drawstart', (DrawEvent) => {
          DrawEvent.feature.getGeometry().on('change', (MoveEvent) => {
            if (MoveEvent.target instanceof LineString) {
              ReactDOM.render(
                <MapTooltipComponent
                  CurrentTab={props.ProviderStore.CurrentTab}
                  Distance={FormatLength(MoveEvent.target)}
                  TooltipID={`Ruler${
                    props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatures()
                      .length
                  }`}
                />,
                OverlayTooltip.getElement()
              );

              OverlayTooltip.setPosition(MoveEvent.target.getLastCoordinate());
            }
          });
        });
        DrawObject.on('drawend', (DrawEvent) => {
          DrawEvent.feature.setStyle(
            new Style({
              stroke: new Stroke({
                color: 'rgb(24, 144, 255)',
                lineDash: [10, 10],
                width: 2,
              }),
            })
          );
          DrawEvent.feature.setId(
            `Ruler${
              props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatures()
                .length
            }`
          );
          props.ProviderStore.CurrentTab.Options.MapObject.removeInteraction(
            DrawObject
          );
        });
      }
    };
    useEffect(MapControlsHandler, [
      props.ProviderStore.CurrentTab.Options.CurrentControls.length,
    ]);
    return (
      <>
        <div
          className="MatteGlass"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '30px',
            gap: '10px',
            padding: '5px',
          }}
        >
          <Button
            size="small"
            type="primary"
            onClick={() => {
              Ruler();
            }}
          >
            Линейка
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              if (
                props.ProviderStore.CurrentTab.Options.GetNamedFeatures(
                  /^Track\w{1,}/
                ).length == 1
              ) {
                props.ProviderStore.SetNewCurrentControls('Add', {
                  Id: 'TrackPlayer',
                });
              }
            }}
          >
            Плеер треков
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              props.ProviderStore.SetNewCurrentControls('Add', {
                Id: 'GeozoneEditor',
              });
            }}
          >
            Геозона
          </Button>
        </div>
        {ReactDOM.createPortal(<TrackPlayerComponent />, TrackPlayerElement)}
        {ReactDOM.createPortal(
          <GeozoneEditorComponent />,
          GeozoneEditorElement
        )}
      </>
    );
  })
);
export default MapButtonBarComponent;
