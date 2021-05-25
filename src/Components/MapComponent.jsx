import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer, inject } from 'mobx-react';
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
  InitMap = () => {
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
