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
    Component: React.lazy(() => import('./TransportModelComponent')),
    Keys: ['VehicleModels'],
  },
  {
    Component: React.lazy(() => import('./RolesComponent')),
    Keys: ['AccessRoles'],
  },
  {
    Component: React.lazy(() => import('./RegionsComponent')),
    Keys: ['Regions'],
  },
  {
    Component: React.lazy(() => import('./TransportTypeComponent')),
    Keys: ['VehicleTypes'],
  },
  {
    Component: React.lazy(() => import('./MapComponent')),
    Keys: ['map'],
  },
  {
    Component: React.lazy(() => import('./ManufacturersComponent')),
    Keys: ['Manufacturers'],
  },
  { Component: React.lazy(() => import('./UsersComponent')), Keys: ['Users'] },
  {
    Component: React.lazy(() => import('./TransportComponent')),
    Keys: ['Vehicles'],
  },
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
    Component: React.lazy(() => import('./StatisticComponent')),
    Keys: ['statistic'],
  },
  {
    Component: React.lazy(() => import('./TripsReportComponent')),
    Keys: ['tripsReport'],
  },
  {
    Component: React.lazy(() => import('./LoadsReportComponent')),
    Keys: ['loadsReport'],
  },
  {
    Component: React.lazy(() => import('./JornalComponent')),
    Keys: ['journal'],
  },
  {
    Component: React.lazy(() => import('./ExhaustTemperatureComponent')),
    Keys: ['exhaustTemperature'],
  },
  {
    Component: React.lazy(() => import('./RetranslationComponent')),
    Keys: ['RetransTargets'],
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
      caption: 'Администрирование',
      items: [
        { id: 'RetransTargets', caption: 'Ретрансляторы' },
        { id: 'statistic', caption: 'Статистика' },
        { id: 'Vehicles', caption: 'Транспорт' },
        { id: 'Users', caption: 'Пользователи' },
        { id: 'Manufacturers', caption: 'Производители' },
        { id: 'VehicleTypes', caption: 'Типы ТС' },
        { id: 'VehicleModels', caption: 'Модели ТС' },
        { id: 'Regions', caption: 'Участки' },
        { id: 'AccessRoles', caption: 'Роли' },
        { id: 'Firms', caption: 'Организации' },
      ],
    });
    GlobalStore.AddTab({
      id: 'reports',
      caption: 'Отчеты',
      items: [
        { id: 'tripsReport', caption: 'Отчет по рейсам' },
        { id: 'loadsReport', caption: 'Погрузки экскаваторов' },
        { id: 'tyrespressReport', caption: 'Давление в шинах' },
        { id: 'exhaustTemperature', caption: 'Температура выхлопа' },
        { id: 'journal', caption: 'Журнал' },
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
                  style={{ height: 'calc(100% - 4%)', with: '100%' }}
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
                        <React.Suspense
                          fallback={
                            <Spin tip="Загрузка компонента" size="large" />
                          }
                        >
                          {this.GetComponent(
                            GlobalStore.CurrentTab.Options.CurrentMenuItem.id
                          )}
                        </React.Suspense>
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
