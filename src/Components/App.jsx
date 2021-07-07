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
const ComponentList = [
  {
    Component: React.lazy(() => import('./OrganizationsComponent')),
    Keys: ['Firms'],
  },
  {
    Component: React.lazy(() => import('./IntervalComponent')),
    Keys: ['IntervalComponent'],
  },
  {
    Component: React.lazy(() => import('./TransportModelComponent')),
    Keys: ['VehicleModels'],
  },
  {
    Component: React.lazy(() => import('./RolesComponent')),
    Keys: ['AccessRoles'],
  },

  {
    Component: React.lazy(() => import('./MapComponent')),
    Keys: ['map'],
  },

  { Component: React.lazy(() => import('./UsersComponent')), Keys: ['Users'] },
  {
    Component: React.lazy(() => import('./TyrespressReportComponent')),
    Keys: ['tyrespressReport'],
  },
  {
    Component: React.lazy(() => import('./TransportTreeComponent')),
    Keys: ['TransportTree'],
  },
  {
    Component: React.lazy(() => import('./IntervalComponent')),
    Keys: ['Interval'],
  },
  {
    Component: React.lazy(() => import('./AdministrationMenuComponent')),
    Keys: ['AdministrationMenu'],
  },
  {
    Component: React.lazy(() => import('./TransportTreeComponent')),
    Keys: ['TreeComponent'],
  },
  {
    Component: React.lazy(() => import('./JornalComponent')),
    Keys: ['journal'],
  },
  {
    Component: React.lazy(() => import('./ExhaustTemperatureComponent')),
    Keys: ['exhaustTemperature'],
  },
];
@observer
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    GlobalStore.AddTab({
      id: 'settings',
      type: 'setting',
      caption: 'Администрирование',
      items: [
        { id: 'RetransTargets', caption: 'Ретрансляторы' },
        { id: 'statistic', caption: 'Статистика' },
        { id: 'Vehicles', caption: 'Транспорт' },
        { id: 'Regions', caption: 'Участки' },
        { id: 'VehicleTypes', caption: 'Типы ТС' },
        { id: 'Manufacturers', caption: 'Производители' },
        { id: 'Firms', caption: 'Организации' },
        { id: 'WorkConditions', caption: 'Условия работы' },
        { id: 'DiggerPassports', caption: 'Паспорта загрузки' },
      ],
    });
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
  }
  GetComponent(ComponentID) {
    const CurrentItem = ComponentList.find((Item) => {
      return Item.Keys.includes(ComponentID);
    });
    return <CurrentItem.Component key={ComponentID} />;
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
                <React.Suspense
                  fallback={<Spin tip="Загрузка компонента" size="large" />}
                >
                  {GlobalStore.CurrentTab != null
                    ? GlobalStore.CurrentTab.Options.LeftMenu.map((Key) => {
                        return this.GetComponent(Key);
                      })
                    : null}
                </React.Suspense>
              </Sider>
              <Content>
                <Tabs
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
                        {GlobalStore.CurrentTab != null
                          ? Tab.Options.CurrentMenuItem.Component
                          : null}
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
