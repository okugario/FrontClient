import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Layout, Tabs, ConfigProvider, Spin, Button } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import { observer, Provider } from 'mobx-react';
import GlobalStore from '../Store/GlobalStore';
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
import 'antd/dist/antd.css';
import '../CSS/AppComponent.css';

@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    GlobalStore.AddTab({
      id: 'reports',
      type: 'report',
      caption: 'Отчеты',
      items: [
        { id: 'map', caption: 'Карта' },
        { id: 'tripsReport', caption: 'Отчет по рейсам' },
        { id: 'loadsReport', caption: 'Отчет по погрузкам' },
      ],
    });
    GlobalStore.AddTab({
      caption: 'Действия',
      id: 'workplace',
      type: 'workplace',
      items: [{ caption: 'Наряды экскаваторов', id: 'DiggerOrders' }],
    });
    GlobalStore.AddTab({
      id: 'settings',
      type: 'setting',
      caption: 'Администрирование',
      items: [
        { id: 'statistic', caption: 'Статистика' },
        { id: 'Vehicles', caption: 'Транспорт' },
        { id: 'Regions', caption: 'Участки' },
        { id: 'VehicleTypes', caption: 'Типы ТС' },
        { id: 'Manufacturers', caption: 'Производители' },
        { id: 'Firms', caption: 'Организации' },
        { id: 'WorkConditions', caption: 'Условия работы' },
        { id: 'DiggerPassports', caption: 'Паспорта загрузки' },
        { id: 'LoadTypes', caption: 'Виды грузов' },
        { id: 'RetransTargets', caption: 'Ретрансляторы' },
      ],
    });
  }
  GetComponent(Tab) {
    const Component = Tab.Options.CurrentMenuItem.Component;
    return <Component key={Tab.Key} />;
  }

  render() {
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
                            fallback={
                              <Spin tip="Загрузка компонента" size="large" />
                            }
                          >
                            <Component key={Index} />
                          </React.Suspense>
                        );
                      }
                    )
                  : null}
              </Sider>
              <Content>
                <Tabs
                  destroyInactiveTabPane={true}
                  activeKey={GlobalStore.CurrentTabKey}
                  size="small"
                  style={{ height: '100%', with: '100%' }}
                  hideAdd={true}
                  type="card"
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
                            {this.GetComponent(Tab)}
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
  }
}
ReactDOM.render(<App />, document.getElementById('App'));
