import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
import { ApiFetch } from '../Helpers/Helpers';
import '../CSS/MapComponent.css';
import MapButtonBarComponent from './MapButtonBarComponent';
import 'ol/ol.css';
import Control from 'ol/control/Control';
@inject('ProviderStore')
@observer
export default class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.MapRef = React.createRef();
    this.ButtonBar = document.createElement('div');
  }
  RequestTransportTree() {
    ApiFetch(
      `reports/VehicleTree?ts=${this.props.ProviderStore.CurrentTab.Options.StartDate.unix()}`,
      'GET',
      undefined,
      (Response) => {
        this.props.ProviderStore.SetNewTransportTree(Response.data);
      }
    );
  }
  InitMap = () => {
    console.log(
      this.props.ProviderStore.CurrentTab.Options.MapObject.getControls().array_
        .length
    );
    this.ButtonBar.className = 'MatteGlass';
    this.props.ProviderStore.CurrentTab.Options.MapObject.setTarget(
      this.MapRef.current
    );

    this.props.ProviderStore.CurrentTab.Options.MapObject.addControl(
      new Control({ element: this.ButtonBar })
    );
  };

  componentDidMount() {
    this.InitMap();
    this.RequestTransportTree();
  }

  render() {
    return (
      <React.Fragment>
        <div ref={this.MapRef} className="FullExtend" />
        {ReactDOM.createPortal(<MapButtonBarComponent />, this.ButtonBar)}
      </React.Fragment>
    );
  }
}
