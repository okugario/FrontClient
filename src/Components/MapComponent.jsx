import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import '../CSS/MapComponent.css';
import MapButtonBarComponent from './MapButtonBarComponent';
import 'ol/ol.css';
import { reaction } from 'mobx';
import { Icon, Style, Text } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import TruckSVG from '../Svg/Truck.svg';
import { message } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import { RandomColor } from '../Helpers/Helpers';
import Stroke from 'ol/style/Stroke';
const MapComponent = inject('ProviderStore')(
  observer((props) => {
    const CurrentTab = props.ProviderStore.OpenTabs.find((Tab) => {
      return Tab.Key == props.ProviderStore.CurrentTabKey;
    });
    const MapRef = React.createRef();

    const DeleteTrack = (TransportID) => {
      if (
        CurrentTab.Options.GetVectorLayerSource().getFeatureById(
          `Track${TransportID}`
        ) != null
      ) {
        CurrentTab.Options.GetVectorLayerSource().removeFeature(
          CurrentTab.Options.GetVectorLayerSource().getFeatureById(
            `Track${TransportID}`
          )
        );
      }
      if (
        CurrentTab.Options.GetVectorLayerSource().getFeatureById(
          `MarkTrack${TransportID}`
        ) != null
      ) {
        CurrentTab.Options.GetVectorLayerSource().removeFeature(
          CurrentTab.Options.GetVectorLayerSource().getFeatureById(
            `MarkTrack${TransportID}`
          )
        );
      }
      if (CurrentTab.Options.GetVectorLayerSource().getFeatures().length != 0) {
        CurrentTab.Options.MapObject.getView().fit(
          CurrentTab.GetVectorLayerSource().getExtent()
        );
      }
    };

    const AddTrack = (TransportId) => {
      return new Promise((resolve, reject) => {
        ApiFetch(
          `reports/VehicleTrack?id=${TransportId}&sts=${CurrentTab.Options.StartDate.unix()}&fts=${CurrentTab.Options.EndDate.unix()}`,
          'GET',
          undefined,
          (Response) => {
            if (Response.geometry.coordinates.length > 0) {
              let NewFeature = new GeoJSON().readFeature(Response, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
              });
              NewFeature.setId(`Track${TransportId}`);
              NewFeature.setStyle(
                new Style({
                  stroke: new Stroke({
                    color: RandomColor(),
                    width: 3,
                  }),
                })
              );
              if (
                CurrentTab.Options.MapObject.getControls().array_.length == 2
              ) {
                const Feature = new GeoJSON().readFeature({
                  type: 'Feature',
                  id: `Mark${NewFeature.getId()}`,
                  geometry: {
                    type: 'Point',
                    coordinates: NewFeature.getGeometry().getCoordinateAt(0),
                  },
                });

                Feature.setStyle(
                  new Style({
                    text: new Text({
                      font: 'bold 10px sans-serif',
                      text: NewFeature.values_.caption,
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
                CurrentTab.Options.GetVectorLayerSource().addFeature(Feature);
              }

              CurrentTab.Options.GetVectorLayerSource().addFeature(NewFeature);
            } else {
              message.warning('Нет данных для трека.');
            }
            resolve();
          }
        ).catch(() => {
          message.warning('Нет данных для трека.');
        });
      });
    };
    const InitMap = () => {
      const UpdateInKeys = reaction(
        () => CurrentTab.Options.CheckedTransportKeys,
        (NewTransportKeys, OldTransportKeys) => {
          UpdateMapInKeys(NewTransportKeys, OldTransportKeys);
        }
      );
      const UpdateInDate = reaction(
        () => CurrentTab.Options.StartDate || CurrentTab.Options.EndDate,
        () => {
          UpdateMapInDate();
        }
      );
      CurrentTab.Options.MapObject.setTarget(MapRef.current);
      return () => {
        UpdateInKeys();
        UpdateInDate();
      };
    };
    const UpdateMapInKeys = (NewTransportKeys, OldTransportKeys) => {
      let PromiseArray = [];
      NewTransportKeys.forEach((NewTransportKey) => {
        if (
          !CurrentTab.Options.CheckedTransportKeys.includes(NewTransportKeys)
        ) {
          PromiseArray.push(AddTrack(NewTransportKey));
        }
      });
      OldTransportKeys.forEach((OldTransportKey) => {
        if (!NewTransportKeys.includes(OldTransportKey)) {
          DeleteTrack(OldTransportKey);
        }
      });
      if (PromiseArray.length != 0) {
        Promise.all(PromiseArray).then(() => {
          props.ProviderStore.CurrentTab.Options.MapObject.getView().fit(
            CurrentTab.Options.GetVectorLayerSource().getExtent()
          );
        });
      }
    };
    const UpdateMapInDate = () => {
      CurrentTab.Options.CheckedTransportKeys.forEach((TransportKey) => {
        DeleteTrack(TransportKey);
        AddTrack(TransportKey);
      });
    };
    useEffect(InitMap, []);
    return (
      <>
        <div ref={MapRef} className="FullExtend" />
        {CurrentTab.Options.CurrentMenuItem.id == 'map'
          ? ReactDOM.createPortal(
              <MapButtonBarComponent />,
              CurrentTab.Options.ButtonBarElement
            )
          : null}
      </>
    );
  })
);
export default MapComponent;
