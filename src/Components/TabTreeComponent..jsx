import * as React from 'react';
import { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import { ApiFetch } from '../Helpers/Helpers';
import { Tabs, Tree, Dropdown, Menu } from 'antd';
const { TabPane } = Tabs;
const TabTreeComponent = inject('ProviderStore')(
  observer((props) => {
    const GeozonesContextMenu = (
      <Menu>
        <Menu.Item key="EditGeozone">Редактировать</Menu.Item>
        <Menu.Item key="DeleteGeozone">Удалить</Menu.Item>
      </Menu>
    );
    const GeozonesGroupContextMenu = (
      <Menu>
        <Menu.Item key="AddGeozone">Добавить геозону</Menu.Item>
      </Menu>
    );
    const [GeozonesTree, SetNewGeozonesTree] = useState([]);
    const RequestTrees = () => {
      ApiFetch(
        `reports/VehicleTree?ts=${props.ProviderStore.CurrentTab.Options.StartDate.unix()}`,
        'GET',
        undefined,
        (Response) => {
          props.ProviderStore.SetNewTransportTree(Response.data);
        }
      );
      ApiFetch('reports/GeofenceTree', 'GET', undefined, (Response) => {
        SetNewGeozonesTree(
          Response.data.map((Group) => {
            return {
              title: () => {
                return (
                  <Dropdown
                    trigger={['contextMenu']}
                    overlay={GeozonesGroupContextMenu}
                  >
                    <div>{Group.Caption}</div>
                  </Dropdown>
                );
              },
              key: Group.Id,
              children: Group.Geofences.map((Geozone) => {
                return {
                  title: () => {
                    return (
                      <Dropdown
                        trigger={['contextMenu']}
                        overlay={GeozonesContextMenu}
                      >
                        <div>{Geozone.Caption}</div>
                      </Dropdown>
                    );
                  },
                  key: Geozone.Id,
                };
              }),
            };
          })
        );
      });
    };
    useEffect(RequestTrees, []);
    return (
      <Tabs size="small" hideAdd={true} type="card">
        <TabPane tab="Транспорт" key="Transport">
          <Tree
            defaultExpandedKeys={
              props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
            }
            onSelect={(CheckedKeys) => {
              props.ProviderStore.SetNewCheckedTransportKeys(CheckedKeys);
            }}
            height={400}
            treeData={props.ProviderStore.TransportTree}
            selectedKeys={
              props.ProviderStore.CurrentTab.Options.CheckedTransportKeys
            }
          />
        </TabPane>
        {props.ProviderStore.CurrentTab.Options.CurrentMenuItem.id == 'map' ? (
          <TabPane tab="Геозоны" key="GeoZones">
            <Tree treeData={GeozonesTree} height={400} />
          </TabPane>
        ) : null}
      </Tabs>
    );
  })
);
export default TabTreeComponent;
