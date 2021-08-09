import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import '../CSS/MapComponent.css';
import MapButtonBarComponent from './MapButtonBarComponent';
import 'ol/ol.css';
import Control from 'ol/control/Control';
import { reaction } from 'mobx';
import { Icon, Style, Text } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import TruckSVG from '../Svg/Truck.svg';
import { message } from 'antd';
import { ApiFetch } from '../Helpers/Helpers';
import { RandomColor } from '../Helpers/Helpers';
import Stroke from 'ol/style/Stroke';
@inject('ProviderStore')
@observer
export default class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.UpdateInKeys = null;
    this.UpdateInDate = null;
    this.MapRef = React.createRef();
    this.ButtonBar = document.createElement('div');
  }
  DeleteTrack(TransportID) {
    if (
      this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatureById(
        `Track${TransportID}`
      ) != null
    ) {
      this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().removeFeature(
        this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatureById(
          `Track${TransportID}`
        )
      );
    }
    if (
      this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatureById(
        `MarkTrack${TransportID}`
      ) != null
    ) {
      this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().removeFeature(
        this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatureById(
          `MarkTrack${TransportID}`
        )
      );
    }
    if (
      this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatures()
        .length != 0
    ) {
      this.props.ProviderStore.CurrentTab.Options.MapObject.getView().fit(
        this.props.ProviderStore.CurrentTab.GetVectorLayerSource().getExtent()
      );
    }
  }
  AddTrack(TransportId) {
    return new Promise((resolve, reject) => {
      ApiFetch(
        `reports/VehicleTrack?id=${TransportId}&sts=${this.props.ProviderStore.CurrentTab.Options.StartDate.unix()}&fts=${this.props.ProviderStore.CurrentTab.Options.EndDate.unix()}`,
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
              this.props.ProviderStore.CurrentTab.Options.MapObject.getControls()
                .array_.length == 2
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
              this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().addFeature(
                Feature
              );
            }

            this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().addFeature(
              NewFeature
            );
          }
          resolve();
        }
      ).catch(() => {
        message.warning('Нет данных для трека.');
      });
    });
  }
  InitMap = () => {
    this.ButtonBar.className = 'MatteGlass';
    this.props.ProviderStore.CurrentTab.Options.MapObject.setTarget(
      this.MapRef.current
    );

    this.props.ProviderStore.CurrentTab.Options.MapObject.addControl(
      new Control({ element: this.ButtonBar })
    );
  };
  UpdateMapInKeys(NewTransportKeys, OldTransportKeys) {
    let PromiseArray = [];
    NewTransportKeys.forEach((NewTransportKey) => {
      if (
        !this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys.includes(
          NewTransportKeys
        )
      ) {
        PromiseArray.push(this.AddTrack(NewTransportKey));
      }
    });
    OldTransportKeys.forEach((OldTransportKey) => {
      if (!NewTransportKeys.includes(OldTransportKey)) {
        this.DeleteTrack(OldTransportKey);
      }
    });
    if (PromiseArray.length != 0) {
      Promise.all(PromiseArray).then(() => {
        this.props.ProviderStore.CurrentTab.Options.MapObject.getView().fit(
          this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getExtent()
        );
      });
    }
  }
  UpdateMapInDate() {
    this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys.forEach(
      (TransportKey) => {
        this.DeleteTrack(TransportKey);
        this.AddTrack(TransportKey);
      }
    );
  }
  componentDidMount() {
    this.InitMap();
    this.UpdateInKeys = reaction(
      () => this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys,
      (NewTransportKeys, OldTransportKeys) => {
        this.UpdateMapInKeys(NewTransportKeys, OldTransportKeys);
      }
    );
    this.UpdateInDate = reaction(
      () =>
        this.props.ProviderStore.CurrentTab.Options.StartDate ||
        this.props.ProviderStore.CurrentTab.Options.EndDate,
      () => {
        this.UpdateMapInDate();
      }
    );
  }
  componentWillUnmount() {
    this.UpdateInKeys();
    this.UpdateInDate();
  }
  render() {
    return (
      <React.Fragment>
        <div ref={this.MapRef} className="FullExtend" />
        {this.props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id == 'map'
          ? ReactDOM.createPortal(<MapButtonBarComponent />, this.ButtonBar)
          : null}
      </React.Fragment>
    );
  }
}
