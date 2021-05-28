import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Tree } from 'antd';
@inject('ProviderStore')
@observer
export default class TransportTreeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  TransportChech = (CheckedKey) => {
    this.props.ProviderStore.SetNewCheckedTransportKeys(CheckedKey);
  };
  render() {
    return (
      <Tree
        defaultExpandedKeys={
          this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
        }
        onSelect={(CheckedKeys) => {
          this.TransportChech(CheckedKeys);
        }}
        height={400}
        treeData={this.props.ProviderStore.TransportTree}
        selectedKeys={
          this.props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
        }
        selectable={true}
      />
    );
  }
}
