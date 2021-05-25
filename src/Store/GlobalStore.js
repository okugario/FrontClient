import { makeAutoObservable } from 'mobx';
import { Tab } from '../Classes/TabClass';
import { ApiFetch } from '../Helpers/Helpers';
import GeoJSON from 'ol/format/GeoJSON';
import { RandomColor } from '../Helpers/Helpers';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import * as Moment from 'moment';
import { Icon } from 'ol/style';
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
        `/trackGeoJSON?oid=${TransportId}&sts=${
          this.CurrentTab.Options.StartDate.unix() - 1230768000
        }&fts=${this.CurrentTab.Options.EndDate.unix() - 1230768000}`,
        'get',
        null,
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
            this.CurrentTab.GetVectorLayerSource().addFeature(NewFeature);

            if (
              this.CurrentTab.Options.MapObject.getControls().array_.length == 2
            ) {
              const MarkTrackFeature = new GeoJSON().readFeature({
                type: 'Feature',
                id: `MarkTrack${TransportId}`,
                geometry: {
                  type: 'Point',
                  coordinates: NewFeature.getGeometry().getCoordinateAt(0),
                },
              });
              MarkTrackFeature.setStyle(
                new Style({
                  image: new Icon({
                    anchor: [0.5, 1],
                    src: TruckSVG,
                    scale: [0.25, 0.25],
                  }),
                })
              );
              this.CurrentTab.GetVectorLayerSource().addFeature(
                MarkTrackFeature
              );
            }
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
  UpdateTracks() {
    this.CurrentTab.Options.CheckedTransportKeys.forEach((Key) => {
      this.DeleteTrack(Key);
      this.AddTrack(Key);
    });
    if (this.CurrentTab.GetVectorLayerSource().getFeatures() > 0) {
      this.CurrentTab.Options.MapObject.getView().fit(
        this.CurrentTab.GetVectorLayerSource().getExtent()
      );
    }
  }
  SetNewCheckedTransportKeys(NewTransportKeys) {
    let PromiseArray = [];

    if (
      NewTransportKeys.length >
      this.CurrentTab.Options.CheckedTransportKeys.length
    ) {
      NewTransportKeys.forEach((Key) => {
        if (!this.CurrentTab.Options.CheckedTransportKeys.includes(Key)) {
          PromiseArray.push(this.AddTrack(Key));
        }
      });

      Promise.all(PromiseArray).then(() => {
        if (this.CurrentTab.GetVectorLayerSource().getFeatures().length > 0) {
          this.CurrentTab.Options.MapObject.getView().fit(
            this.CurrentTab.GetVectorLayerSource().getExtent()
          );
        }
      });
    } else {
      this.CurrentTab.Options.CheckedTransportKeys.forEach((Key) => {
        if (!NewTransportKeys.includes(Key)) {
          this.DeleteTrack(Key);
        }
      });
    }

    this.CurrentTab.Options.CheckedTransportKeys = NewTransportKeys;
  }
  SetNewCurrentTimeTrackPlayer(NewTime) {
    this.CurrentTab.Options.CurrentTrackPlayerTime = Moment.unix(NewTime);
  }
  SetNewDateTimeInterval(NewStartDate, NewEndDate) {
    this.CurrentTab.Options.CurrentTrackPlayerTime = NewStartDate;
    this.CurrentTab.Options.StartDate = NewStartDate;
    this.CurrentTab.Options.EndDate = NewEndDate;
  }
  SetNewTransportTree(GroupsData, TransportData) {
    this.TransportTree = GroupsData.map((Group) => {
      return {
        title: Group.name,
        key: Group.id,
        children: Group.vehs.map((TransportID) => {
          const Transport = TransportData.find((Transport) => {
            return Transport.id == TransportID;
          });
          return { title: Transport.caption, key: Transport.id };
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
