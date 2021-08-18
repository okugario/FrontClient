import * as React from 'react';
import { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import { ApiFetch } from '../Helpers/Helpers';
import { Tabs, Tree } from 'antd';
const { TabPane } = Tabs;
const TabTreeComponent = inject('ProviderStore')(
  observer((props) => {
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
              title: Group.Caption,
              key: Group.Id,
              children: Group.Geofences.map((Geozone) => {
                return { title: Geozone.Caption, key: Geozone.Id };
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
        <TabPane tab="Геозоны" key="GeoZones">
          <Tree treeData={GeozonesTree} height={400} />
        </TabPane>
      </Tabs>
    );
  })
);
export default TabTreeComponent;
