import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { Layout, Tabs, ConfigProvider, Spin, Button } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import { observer, Provider } from 'mobx-react';
import GlobalStore from '../Store/GlobalStore';
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
import 'antd/dist/antd.css';
import '../CSS/AppComponent.css';
import { ApiFetch } from '../Helpers/Helpers';

const App = observer(() => {
  const GetComponent = (Tab) => {
    const Component = Tab.Options.CurrentMenuItem.Component;
    return <Component key={Tab.Key} />;
  };
  const OpenTab = (MenuItem) => {
    GlobalStore.AddTab(MenuItem);
  };
  const RequestUserMenu = () => {
    ApiFetch('model/GetConfig', 'GET', undefined, (Response) => {
      GlobalStore.SetNewTopMenu(Response.data);
    });
  };
  useEffect(RequestUserMenu, []);
  return (
    <Provider ProviderStore={GlobalStore}>
      <ConfigProvider locale={ru_RU}>
        <Layout className="FullExtend">
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button size="small">
              <a href="/logout">Выход</a>
            </Button>
          </Header>
          <Layout>
            <Sider theme="light">
              {GlobalStore.CurrentTab != null
                ? GlobalStore.CurrentTab.Options.LeftMenu.map(
                    (Component, Index) => {
                      return (
                        <React.Suspense
                          key={Index}
                          fallback={
                            <Spin tip="Загрузка компонента" size="large" />
                          }
                        >
                          <Component />
                        </React.Suspense>
                      );
                    }
                  )
                : null}
            </Sider>

            <Content>
              {GlobalStore.TopMenu != null
                ? GlobalStore.TopMenu.map((Item) => {
                    return (
                      <Button
                        key={Item.id}
                        onClick={() => {
                          OpenTab(Item);
                        }}
                      >
                        {Item.caption}
                      </Button>
                    );
                  })
                : null}
              <Tabs
                destroyInactiveTabPane={true}
                activeKey={GlobalStore.CurrentTabKey}
                size="small"
                style={{ height: '100%', with: '100%' }}
                hideAdd={true}
                type="editable-card"
                onChange={(TabKey) => {
                  GlobalStore.SetNewCurrentTab(TabKey);
                }}
                onEdit={(TabKey, Action) => {
                  if (Action == 'remove') {
                    GlobalStore.DeleteTab(TabKey);
                  }
                }}
              >
                {GlobalStore.OpenTabs.map((Tab) => {
                  return (
                    <TabPane
                      tab={Tab.Caption}
                      key={Tab.Key}
                      className="FullExtend"
                    >
                      {GlobalStore.CurrentTab != null ? (
                        <React.Suspense
                          fallback={
                            <Spin tip="Загрузка компонента" size="large" />
                          }
                        >
                          {GetComponent(Tab)}
                        </React.Suspense>
                      ) : null}
                    </TabPane>
                  );
                })}
              </Tabs>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </Provider>
  );
});

ReactDOM.render(<App />, document.getElementById('App'));
