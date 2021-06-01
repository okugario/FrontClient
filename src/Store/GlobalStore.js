import { makeAutoObservable } from 'mobx';
import { Tab } from '../Classes/TabClass';
import { ApiFetch } from '../Helpers/Helpers';
import GeoJSON from 'ol/format/GeoJSON';
import { RandomColor } from '../Helpers/Helpers';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import * as Moment from 'moment';

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
        `reports/Track?id=${TransportId}&sts=${this.CurrentTab.Options.StartDate.unix()}&fts=${this.CurrentTab.Options.EndDate.unix()}`,
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
            this.CurrentTab.GetVectorLayerSource().addFeature(NewFeature);
            this.CurrentTab.Options.MapObject.getView().fit(
              this.CurrentTab.GetVectorLayerSource().getExtent()
            );
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
  SetNewCheckedTransportKeys(NewTransportKeys) {
    switch (this.CurrentTab.Options.CurrentMenuItem.id) {
      case 'map':
        if (this.CurrentTab.Options.CheckedTransportKeys.length > 0) {
          this.DeleteTrack(this.CurrentTab.Options.CheckedTransportKeys[0]);
        }
        this.AddTrack(NewTransportKeys[0]);
        break;
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
    switch (this.CurrentTab.Options.CurrentMenuItem.id) {
      case 'map':
        if (this.CurrentTab.Options.CheckedTransportKeys.length > 0) {
          this.DeleteTrack(this.CurrentTab.Options.CheckedTransportKeys[0]);
          this.AddTrack(this.CurrentTab.Options.CheckedTransportKeys[0]);
        }
        if (this.CurrentTab.GetTrackFeaturies().length > 0) {
          this.CurrentTab.Options.MapObject.getView().fit(
            this.CurrentTab.GetVectorLayerSource().getExtent()
          );
        }

        break;
    }
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
