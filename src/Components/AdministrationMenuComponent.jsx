import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Menu } from 'antd';

@inject('ProviderStore')
@observer
export default class AdministrationMenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Menu
      selectedKeys={[  this.props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id]
        
        }
      >
        {this.props.ProviderStore.CurrentTab.Items.map((Item) => {
          return (
            <Menu.Item
              key={Item.id}
              onClick={() => {
                this.props.ProviderStore.SetNewCurrentMenuItem(Item.id);
              }}
            >
              {Item.caption}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
}
