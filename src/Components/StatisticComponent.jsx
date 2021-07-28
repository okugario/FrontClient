import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Table, Input } from 'antd';
import { ApiFetch, TableSorter } from '../Helpers/Helpers';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

@inject('ProviderStore')
@observer
export default class StatisticComponent extends React.Component {
  constructor(props) {
    super(props);
    this.SearchRef = React.createRef();
    this.RequestUpdateTable = null;
    this.state = {
      SearchString: null,
      Table: null,
      Columns: null,
    };
  }

  ChangeSearchString = (Value) => {
    this.setState({ SearchString: Value });
  };
  ClearSearch = (Event) => {
    if (Event.key == 'Escape') {
      this.setState({ SearchString: null });
      this.SearchRef.current.setValue();
    }
  };
  UpdateTable() {
    this.RequestUpdateTable = setInterval(() => {
      this.RequestTable();
    }, 10000);
  }
  RequestTable() {
    ApiFetch('/config/statistics', 'GET', undefined, (Response) => {
      this.setState({
        Table: Response.dataSource,
        Columns: Response.columns.map((Column) => {
          Column.onFilter = (value, record) => {
            if (this.state.SearchString != null) {
              return record[value].toString().includes(this.state.SearchString);
            } else {
              return true;
            }
          };
          Column.sorter = TableSorter(Column.dataIndex);
          Column.render = (value, record, index) => {
            if (this.state.SearchString != null) {
              return (
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={[this.state.SearchString]}
                  autoEscape
                  textToHighlight={value.toString()}
                />
              );
            } else {
              return value;
            }
          };
          Column.filteredValue = [
            'object_id',
            'caption',
            'last_time',
            'groups',
            'retrans',
          ];

          return Column;
        }),
      });
    });
  }
  componentDidMount() {
    this.RequestTable();
    this.UpdateTable();
    document.addEventListener('keydown', this.ClearSearch, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.ClearSearch, false);
    clearInterval(this.RequestUpdateTable);
  }

  render() {
    return (
      <>
        <Input
          placeholder="Поиск"
          ref={this.SearchRef}
          onPressEnter={(Event) => {
            this.ChangeSearchString(Event.target.value);
          }}
          style={{ width: '400px' }}
        />
        <Table
          pagination={false}
          rowKey="key"
          size="small"
          columns={this.state.Columns}
          dataSource={this.state.Table}
          scroll={{ y: 700 }}
        />
      </>
    );
  }
}
