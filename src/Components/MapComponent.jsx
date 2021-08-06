import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import '../CSS/MapComponent.css';
import MapButtonBarComponent from './MapButtonBarComponent';
import 'ol/ol.css';
import Control from 'ol/control/Control';
import { reaction } from 'mobx';
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
        PromiseArray.push(this.props.ProviderStore.AddTrack(NewTransportKey));
      }
    });
    OldTransportKeys.forEach((OldTransportKey) => {
      if (!NewTransportKeys.includes(OldTransportKey)) {
        this.props.ProviderStore.DeleteTrack(OldTransportKey);
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
        this.props.ProviderStore.DeleteTrack(TransportKey);
        this.props.ProviderStore.AddTrack(TransportKey);
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
