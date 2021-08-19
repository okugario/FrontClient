import MapObject from 'ol/Map';
import OSM from 'ol/source/OSM';
import * as React from 'react';
import Stroke from 'ol/style/Stroke';
import * as Moment from 'moment';
import Style from 'ol/style/Style';
import { Tile as TileLayer } from 'ol/layer';
import { defaults } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import View from 'ol/View';
import { makeAutoObservable } from 'mobx';
import TripsReportComponent from '../Components/TripsReportComponent';
import MapComponent from '../Components/MapComponent';
import RetranslationComponent from '../Components/RetranslationComponent';
import StatisticComponent from '../Components/StatisticComponent';
import TransportComponent from '../Components/TransportComponent';
import CrudObjectsComponent from '../Components/CrudObjectsComponent';
import WorkConditionsComponent from '../Components/WorkConditionsComponent';
import LoadsReportComponent from '../Components/LoadsReportComponent';
import LoadsPassportComponent from '../Components/LoadsPassportComponent';
import DiggerOrderComponent from '../Components/DiggerOrderComponent';
import Control from 'ol/control/Control';
export class Tab {
  constructor(TabObject, OpenTabs) {
    this.Id = TabObject.id;
    this.Caption = TabObject.caption;
    this.Key = this.GenerateTabKey(TabObject.id, OpenTabs);
    if ('items' in TabObject) {
      this.Items = TabObject.items.map((Item) => {
        switch (Item.id) {
          case 'map':
            Item.Component = React.lazy(() =>
              import('../Components/MapComponent')
            );
            break;
          case 'RetransTargets':
            Item.Component = React.lazy(() =>
              import('../Components/RetranslationComponent')
            );
            break;
          case 'statistic':
            Item.Component = React.lazy(() =>
              import('../Components/StatisticComponent')
            );
            break;
          case 'Vehicles':
            Item.Component = React.lazy(() =>
              import('../Components/TransportComponent')
            );
            break;
          case 'Regions':
            Item.Component = React.lazy(() =>
              import('../Components/CrudObjectsComponent')
            );
            break;
          case 'tripsReport':
            Item.Component = React.lazy(() =>
              import('../Components/TripsReportComponent')
            );
            break;
          case 'loadsReport':
            Item.Component = React.lazy(() =>
              import('../Components/LoadsReportComponent')
            );
            break;
          case 'VehicleTypes':
            Item.Component = React.lazy(() =>
              import('../Components/CrudObjectsComponent')
            );
            break;
          case 'Manufacturers':
            Item.Component = React.lazy(() =>
              import('../Components/CrudObjectsComponent')
            );
            break;
          case 'Firms':
            Item.Component = React.lazy(() =>
              import('../Components/CrudObjectsComponent')
            );
            break;
          case 'LoadTypes':
            Item.Component = React.lazy(() =>
              import('../Components/CrudObjectsComponent')
            );
            break;
          case 'WorkConditions':
            Item.Component = React.lazy(() =>
              import('../Components/WorkConditionsComponent')
            );
            break;
          case 'DiggerPassports':
            Item.Component = React.lazy(() =>
              import('../Components/LoadsPassportComponent')
            );
            break;
        }
        return Item;
      });
    }
    switch (TabObject.type) {
      case 'report':
        let ButtonBar = document.createElement('div');
        let MapButtonBarControl = new Control({ element: ButtonBar });
        MapButtonBarControl.set('Id', 'MapButtonBar');
        ButtonBar.id = 'MapButtonBar';
        this.Options = {
          ButtonBarElement: ButtonBar,
          CurrentMenuItem: TabObject.items[0],
          CheckedTransportKeys: [],
          CheckedGeozonesKeys: [],
          LeftMenu: [
            React.lazy(() => import('../Components/IntervalComponent')),

            React.lazy(() => import('../Components/TabTreeComponent.')),
            React.lazy(() =>
              import('../Components/AdministrationMenuComponent')
            ),
          ],
          StartDate:
            Moment().hours() < 20
              ? Moment('08:00:00', 'HH:mm:ss')
              : Moment('20:00:00', 'HH:mm:ss'),

          EndDate:
            Moment().hours() < 20
              ? Moment('20:00:00', 'HH:mm:ss')
              : Moment('08:00:00', 'HH:mm:ss').add(1, 'day'),
          CurrentTrackPlayerTime:
            Moment().hours() < 20
              ? Moment('08:00:00', 'HH:mm:ss')
              : Moment('20:00:00', 'HH:mm:ss'),

          MapObject: new MapObject({
            interactions: defaults({ doubleClickZoom: false }),
            controls: [MapButtonBarControl],
            layers: [
              new TileLayer({
                preload: Infinity,
                source: new OSM(),
              }),
              new VectorLayer({
                style: new Style({
                  stroke: new Stroke({
                    color: 'rgb(24, 144, 255)',
                    width: 2,
                  }),
                }),
                source: new VectorSource(),
              }),
            ],
            view: new View({
              center: [9699920.994474, 7124384.881034],
              zoom: 13,
            }),
          }),
          GetVectorLayer: () => {
            return this.Options.MapObject.getLayers().array_[1];
          },
          GetTransportMarks: () => {
            return this.Options.MapObject.getLayers()
              .array_[1].getSource()
              .getFeatures()
              .filter((Feature) => {
                if (/MarkTrack/.test(Feature.getId())) {
                  return true;
                }
              });
          },
          GetTrackFeaturies: () => {
            return this.Options.MapObject.getLayers()
              .array_[1].getSource()
              .getFeatures()
              .filter((Feature) => {
                if (/^Track\w{1,}/.test(Feature.getId())) {
                  return true;
                }
              });
          },
          GetVectorLayerSource: () => {
            return this.Options.MapObject.getLayers().array_[1].getSource();
          },
        };

        break;
      case 'setting':
        this.Options = {
          CurrentMenuItem: TabObject.items[0],
          LeftMenu: [
            React.lazy(() =>
              import('../Components/AdministrationMenuComponent')
            ),
          ],
        };

        break;
      case 'workplace':
        this.Options = {
          LeftMenu: [
            React.lazy(() =>
              import('../Components/AdministrationMenuComponent')
            ),
          ],
          CurrentMenuItem: TabObject.items[0],
        };
        this.Items = TabObject.items.map((Item) => {
          switch (Item.id) {
            case 'DiggerOrders':
              Item.Component = React.lazy(() =>
                import('../Components/DiggerOrderComponent')
              );
              break;
          }
          return Item;
        });
        break;
    }

    makeAutoObservable(this);
  }
  GenerateTabKey(TabID, OpenTabs) {
    let TabCount = 0;
    OpenTabs.forEach((Tab) => {
      if (Tab.Id == TabID) {
        TabCount = TabCount + 1;
      }
    });
    return `${TabID}${TabCount}`;
  }
}
