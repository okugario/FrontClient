import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'antd';
import { getLength } from 'ol/sphere';
import * as ReactDOM from 'react-dom';
import MapTooltipComponent from '../Components/MapTooltipComponent';
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

@inject('ProviderStore')
@observer
export default class MapButtonBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.TrackPlayerElement = document.createElement('div');
    this.state = {};
  }
  TrackPlayer = () => {
    if (
      this.props.ProviderStore.CurrentTab.Options.MapObject.getControls().array_
        .length == 1 &&
      this.props.ProviderStore.CurrentTab.Options.GetTrackFeaturies().length ==
        1
    ) {
      this.props.ProviderStore.CurrentTab.Options.MapObject.addControl(
        new Control({
          element: this.TrackPlayerElement,
        })
      );
      this.props.ProviderStore.CurrentTab.Options.GetTrackFeaturies().forEach(
        (Track) => {
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
          this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().addFeature(
            Feature
          );
        }
      );
    }
  };
  FormatLength = (Line) => {
    if (getLength(Line) > 100) {
      return `${Math.round((getLength(Line) / 1000) * 100) / 100} km`;
    } else {
      return `${Math.round(getLength(Line) * 100) / 100} m `;
    }
  };

  CreateMapTooltip = (OverlayID) => {
    let RulerTooltipElement = document.createElement('div');
    RulerTooltipElement.id = `Ruler${
      this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatures()
        .length
    }`;

    let OverlayTooltip = new Overlay({
      id: OverlayID,
      element: RulerTooltipElement,
      offset: [15, 0],
      positioning: OverlayPositioning.CENTER_LEFT,
    });
    this.props.ProviderStore.CurrentTab.Options.MapObject.addOverlay(
      OverlayTooltip
    );
    return OverlayTooltip;
  };

  Ruler = () => {
    if (
      this.props.ProviderStore.CurrentTab.Options.MapObject.getInteractions().getLength() ==
      8
    ) {
      let DrawObject = new Draw({
        source:
          this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource(),
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

      OverlayTooltip = this.CreateMapTooltip(
        `Ruler${
          this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatures()
            .length
        }`
      );

      this.props.ProviderStore.CurrentTab.Options.MapObject.addInteraction(
        DrawObject
      );
      DrawObject.on('drawstart', (DrawEvent) => {
        DrawEvent.feature.getGeometry().on('change', (MoveEvent) => {
          if (MoveEvent.target instanceof LineString) {
            ReactDOM.render(
              <MapTooltipComponent
                CurrentTab={this.props.ProviderStore.CurrentTab}
                Distance={this.FormatLength(MoveEvent.target)}
                TooltipID={`Ruler${
                  this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatures()
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
            this.props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatures()
              .length
          }`
        );
        this.props.ProviderStore.CurrentTab.Options.MapObject.removeInteraction(
          DrawObject
        );
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ padding: '5px' }}>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              this.Ruler();
            }}
          >
            Линейка
          </Button>
          <Button
            size="small"
            type="primary"
            style={{ marginLeft: '10px' }}
            onClick={() => {
              this.TrackPlayer();
            }}
          >
            Плеер треков
          </Button>
        </div>
        {ReactDOM.createPortal(
          <TrackPlayerComponent />,
          this.TrackPlayerElement
        )}
      </React.Fragment>
    );
  }
}
