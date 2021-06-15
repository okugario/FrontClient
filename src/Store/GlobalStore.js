import { makeAutoObservable } from 'mobx';
import { Tab } from '../Classes/TabClass';
import { ApiFetch } from '../Helpers/Helpers';
import { RandomColor } from '../Helpers/Helpers';
import Stroke from 'ol/style/Stroke';
import * as Moment from 'moment';
import { Icon, Style, Text } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import TruckSVG from '../Svg/Truck.svg';

class Store {
  TransportTree = [];
  TopMenu = [];
  OpenTabs = [];
  CurrentTab = null;
  constructor() {
    makeAutoObservable(this);
  }
  SetNewCurrentMenuItem(NewMenuItemKey) {
    this.CurrentTab.Options.CurrentMenuItem = this.CurrentTab.Items.find(
      (Item) => {
        return Item.id == NewMenuItemKey;
      }
    );
  }
  AddTrack = (TransportId) => {
    return new Promise((resolve, reject) => {
      ApiFetch(
        `reports/VehicleTrack?id=${TransportId}&sts=${this.CurrentTab.Options.StartDate.unix()}&fts=${this.CurrentTab.Options.EndDate.unix()}`,
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
              this.CurrentTab.Options.MapObject.getControls().array_.length == 2
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
              this.CurrentTab.GetVectorLayerSource().addFeature(Feature);
            }

            this.CurrentTab.GetVectorLayerSource().addFeature(NewFeature);
          }
          resolve();
        }
      );
    });
  };
  DeleteTrack(TransportID) {
    if (
      this.CurrentTab.GetVectorLayerSource().getFeatureById(
        `Track${TransportID}`
      ) != null
    ) {
      this.CurrentTab.GetVectorLayerSource().removeFeature(
        this.CurrentTab.GetVectorLayerSource().getFeatureById(
          `Track${TransportID}`
        )
      );
    }
    if (
      this.CurrentTab.GetVectorLayerSource().getFeatureById(
        `MarkTrack${TransportID}`
      ) != null
    ) {
      this.CurrentTab.GetVectorLayerSource().removeFeature(
        this.CurrentTab.GetVectorLayerSource().getFeatureById(
          `MarkTrack${TransportID}`
        )
      );
    }
    if (this.CurrentTab.GetVectorLayerSource().getFeatures().length != 0) {
      this.CurrentTab.Options.MapObject.getView().fit(
        this.CurrentTab.GetVectorLayerSource().getExtent()
      );
    }
  }

  SetNewCurrentTimeTrackPlayer(NewTime) {
    this.CurrentTab.Options.CurrentTrackPlayerTime = Moment.unix(NewTime);
  }
  UpdateCurrentData(NewTransportKeys) {
    switch (this.CurrentTab.Options.CurrentMenuItem.id) {
      case 'map':
        let PromiseArray = [];
        const NewFilteredTransportKeys = NewTransportKeys.filter((Key) => {
          return this.TransportTree.reduce(
            (CheckedTransportArray, CurrentGroup, Index, GroupArray) => {
              return CheckedTransportArray.concat(
                CurrentGroup.children.map((Children) => {
                  return Children.key;
                })
              );
            },
            []
          ).includes(Key);
        });
        NewFilteredTransportKeys.forEach((NewTransportKey) => {
          if (
            !this.CurrentTab.Options.CheckedTransportKeys.includes(
              NewFilteredTransportKeys
            )
          ) {
            PromiseArray.push(this.AddTrack(NewTransportKey));
          }
        });
        this.CurrentTab.Options.CheckedTransportKeys.forEach(
          (OldTransportKey) => {
            if (!NewFilteredTransportKeys.includes(OldTransportKey)) {
              this.DeleteTrack(OldTransportKey);
            }
          }
        );
        this.CurrentTab.Options.CheckedTransportKeys = NewFilteredTransportKeys;
        if (PromiseArray.length != 0) {
          Promise.all(PromiseArray).then(() => {
            this.CurrentTab.Options.MapObject.getView().fit(
              this.CurrentTab.GetVectorLayerSource().getExtent()
            );
          });
        }

        break;
    }
  }
  SetNewDateTimeInterval(NewStartDate, NewEndDate) {
    this.CurrentTab.Options.CurrentTrackPlayerTime = NewStartDate;
    this.CurrentTab.Options.StartDate = NewStartDate;
    this.CurrentTab.Options.EndDate = NewEndDate;
    this.UpdateCurrentData(this.CurrentTab.Options.CheckedTransportKeys);
  }
  SetNewTransportTree(TransportData) {
    this.TransportTree = TransportData.map((Group) => {
      return {
        selectable: false,
        title: Group.Caption,
        key: Group.Id,
        children: Group.Vehicles.map((Transport) => {
          return { title: Transport.caption, key: Transport.Id };
        }),
      };
    });
  }
  SetNewCurrentTab(NewCurrentTabKey) {
    this.CurrentTab = this.OpenTabs.find((Tab) => {
      return Tab.Key == NewCurrentTabKey;
    });
  }
  DeleteTab(TabKey) {
    const DeleteIndex = this.OpenTabs.findIndex((Tab) => {
      return Tab.Key == TabKey;
    });
    this.OpenTabs.splice(DeleteIndex, 1);

    if (this.CurrentTab.Key == TabKey) {
      if (this.OpenTabs.length > DeleteIndex) {
        this.SetNewCurrentTab(this.OpenTabs[DeleteIndex].key);
      } else {
        if (this.OpenTabs.length > 0) {
          this.SetNewCurrentTab(this.OpenTabs[DeleteIndex - 1].Key);
        } else {
          this.CurrentTab = null;
        }
      }
    }
  }
  SetNewTopMenu(NewTopMenu) {
    this.TopMenu = NewTopMenu;
  }
  AddTab(TabObject) {
    this.OpenTabs.push(new Tab(TabObject, this.OpenTabs));
    if (this.OpenTabs.length == 1) {
      this.CurrentTab = this.OpenTabs[0];
    }
  }
}

const GlobalStore = new Store();
export default GlobalStore;
