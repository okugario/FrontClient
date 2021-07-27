import * as React from 'react';
import { CloseOutlined } from '@ant-design/icons';

export default class MapTooltipComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  DeleteTooltip = () => {
    this.props.CurrentTab.Options.MapObject.removeOverlay(
      this.props.CurrentTab.Options.MapObject.getOverlayById(
        this.props.TooltipID
      )
    );
    this.props.CurrentTab.Options.GetVectorLayerSource().removeFeature(
      this.props.CurrentTab.Options.GetVectorLayerSource().getFeatureById(
        this.props.TooltipID
      )
    );
  };
  render() {
    return (
      <div className="MatteGlass">
        {this.props.Distance}
        <CloseOutlined
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => {
            this.DeleteTooltip();
          }}
        />
      </div>
    );
  }
}
