import { makeAutoObservable } from 'mobx';
import { Tab } from '../Classes/TabClass';
import * as Moment from 'moment';

class Store {
  TransportTree = [];
  TopMenu = [];
  OpenTabs = [];
  CurrentTab = null;
  CurrentTabKey = null;
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
  SetNewCurrentFeature(NewFeature) {
    this.CurrentTab.Options.CurrentFeature = NewFeature;
  }
  SetNewCurrentTimeTrackPlayer(NewTime) {
    this.CurrentTab.Options.CurrentTrackPlayerTime = Moment.unix(NewTime);
  }

  SetNewDateTimeInterval(NewStartDate, NewEndDate) {
    this.CurrentTab.Options.CurrentTrackPlayerTime = NewStartDate;
    this.CurrentTab.Options.StartDate = NewStartDate;
    this.CurrentTab.Options.EndDate = NewEndDate;
  }
  SetNewCurrentControls(Action, ControlObject) {
    switch (Action) {
      case 'Add':
        if (
          this.CurrentTab.Options.CurrentControls.find((Element) => {
            return Element.Id == ControlObject.Id;
          }) == undefined
        ) {
          this.CurrentTab.Options.CurrentControls.push(ControlObject);
        }
        break;
      case 'Remove':
        this.CurrentTab.Options.CurrentControls.splice(
          this.CurrentTab.Options.CurrentControls.findIndex((Element) => {
            return Element.Id == ControlObject;
          }),
          1
        );
        break;
    }
  }
  SetNewCheckedTransportKeys(NewTransportKeys) {
    const NewFilteredTransportKeys = NewTransportKeys.filter((Key) => {
      return this.TransportTree.reduce(
        (CheckedTransportArray, CurrentGroup) => {
          return CheckedTransportArray.concat(
            CurrentGroup.children.map((Children) => {
              return Children.key;
            })
          );
        },
        []
      ).includes(Key);
    });
    this.CurrentTab.Options.CheckedTransportKeys = NewFilteredTransportKeys;
  }
  SetNewCheckedGeozonesKeys(NewCheckedKeys) {
    if (
      this.CurrentTab.Options.CurrentControls.find((Control) => {
        return Control.Id == 'GeozoneEditor';
      }) == undefined
    ) {
      this.CurrentTab.Options.CheckedGeozonesKeys = NewCheckedKeys;
    }
  }
  SetNewTransportTree(NewTransportTree) {
    this.TransportTree = NewTransportTree;
  }
  SetNewCurrentTab(NewCurrentTabKey) {
    this.CurrentTabKey = NewCurrentTabKey;
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
  SetNewCurrentDrawObject(NewDrawObject) {
    this.CurrentTab.Options.CurrentDrawObject = NewDrawObject;
  }
  SetNewTopMenu(NewTopMenu) {
    this.TopMenu = NewTopMenu;
  }
  AddTab(TabObject) {
    this.OpenTabs.push(new Tab(TabObject, this.OpenTabs));
    if (this.OpenTabs.length == 1) {
      this.CurrentTab = this.OpenTabs[0];
      this.CurrentTabKey = this.OpenTabs[0].Key;
    }
  }
}

const GlobalStore = new Store();
export default GlobalStore;
