import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ApiFetch } from '../Helpers/Helpers';
import { Tree } from 'antd';
@inject('ProviderStore')
@observer
export default class TransportTreeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
  componentDidMount() {
    this.RequestTransportTree();
  }
  render() {
    return (
      <Tree
        defaultExpandedKeys={
          this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
        }
        onSelect={(CheckedKeys) => {
          this.props.ProviderStore.UpdateCurrentData(CheckedKeys);
        }}
        height={400}
        treeData={this.props.ProviderStore.TransportTree}
        checkedKeys={
          this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
        }
      />
    );
  }
}
