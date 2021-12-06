import * as React from 'react';
import { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import { AntDGenerateTreeData, ApiFetch } from '../Helpers/Helpers';
import { Tabs, Tree, Dropdown, Menu, Modal } from 'antd';
import { Modify } from 'ol/interaction';

const { TabPane } = Tabs;
const TabTreeComponent = inject('ProviderStore')(
  observer((props) => {
    const [GeozonesTree, SetNewGeozonesTree] = useState([]);
    const DeleteGeozone = (GeozoneId) => {
      ApiFetch(
        `model/Geofences/${GeozoneId}`,
        'DELETE',
        undefined,
        (Response) => {
          RequestGeozoneTree();
          SetNewContextMenuKey(null);
        }
      );
    };
    const RequestTransportTree = () => {
      ApiFetch(
        `reports/VehicleTree?ts=${props.ProviderStore.CurrentTab.Options.StartDate.unix()}`,
        'GET',
        undefined,
        (Response) => {
          props.ProviderStore.SetNewTransportTree(
            AntDGenerateTreeData(Response.data, {
              TitleName: 'Caption',
              KeyName: 'Id',
              ChildrensName: 'Vehicles',
              TreeNodeOptions: { disableCheckbox: true },
            })
          );
        }
      );
    };
    const RequestGeozoneTree = () => {
      ApiFetch('reports/GeofenceTree', 'GET', undefined, (Response) => {
        SetNewGeozonesTree(
          Response.data.map((Group) => {
            return {
              selectable: false,
              title: () => {
                return (
                  <Dropdown
                    trigger={['contextMenu']}
                    overlay={
                      <Menu>
                        <Menu.Item
                          key="AddGeozone"
                          onClick={() => {
                            props.ProviderStore.SetNewCurrentControls('Add', {
                              Id: 'GeozoneEditor',
                            });
                          }}
                        >
                          Добавить геозону
                        </Menu.Item>
                      </Menu>
                    }
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
                        onVisibleChange={() => {
                          props.ProviderStore.SetNewCheckedGeozonesKeys([
                            Geozone.Id,
                          ]);
                        }}
                        trigger={['contextMenu']}
                        overlay={
                          <Menu>
                            <Menu.Item
                              key="EditGeozone"
                              onClick={(Event) => {
                                EditGeozone(Geozone.Id, Event);
                              }}
                            >
                              Редактировать
                            </Menu.Item>
                            <Menu.Item
                              key="DeleteGeozone"
                              onClick={() => {
                                Modal.confirm({
                                  title: 'Подтвердите действие',
                                  content:
                                    'Вы действительно хотите удалить геозону?',
                                  okButtonProps: {
                                    danger: true,
                                    size: 'small',
                                  },
                                  okText: 'Удалить',
                                  cancelText: 'Отмена',
                                  cancelButtonProps: { size: 'small' },
                                  onOk: () => {
                                    DeleteGeozone(Geozone.Id);
                                  },
                                });
                              }}
                            >
                              Удалить
                            </Menu.Item>
                          </Menu>
                        }
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

    const EditGeozone = (GeozoneId, Event) => {
      props.ProviderStore.SetNewCurrentFeature(
        props.ProviderStore.CurrentTab.Options.GetVectorLayerSource().getFeatureById(
          `Geozone${GeozoneId}`
        )
      );

      Event.domEvent.stopPropagation();
      props.ProviderStore.SetNewCurrentControls('Add', { Id: 'GeozoneEditor' });

      const ModifyObject = new Modify({
        source: props.ProviderStore.CurrentTab.Options.GetVectorLayerSource(),
      });
      ModifyObject.on('modifyend', (ModifyObject) => {
        props.ProviderStore.SetNewCurrentFeature(
          ModifyObject.features.array_[0]
        );
      });

      props.ProviderStore.CurrentTab.Options.MapObject.addInteraction(
        ModifyObject
      );
    };
    const TreesUpdate = (TabKey) => {
      switch (TabKey) {
        case 'Transports':
          RequestTransportTree();
          break;
        case 'Geozones':
          RequestGeozoneTree();
          break;
      }
    };
    useEffect(() => {
      RequestTransportTree();
    }, []);
    return (
      <Tabs
        size="small"
        hideAdd={true}
        type="card"
        onChange={(Key) => {
          TreesUpdate(Key);
        }}
      >
        <TabPane tab="Транспорт" key="Transports">
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
          <TabPane tab="Геозоны" key="Geozones">
            <Tree
              selectedKeys={
                props.ProviderStore.CurrentTab.Options.CheckedGeozonesKeys
              }
              defaultExpandedKeys={
                props.ProviderStore.CurrentTab.Options.CheckedGeozonesKeys
              }
              treeData={GeozonesTree}
              height={400}
              onSelect={(SelectedKeys) => {
                props.ProviderStore.SetNewCheckedGeozonesKeys(SelectedKeys);
              }}
            />
          </TabPane>
        ) : null}
      </Tabs>
    );
  })
);
export default TabTreeComponent;
