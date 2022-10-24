import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'antd';

@inject('ProviderStore')
@observer
export default class FooterIntervalModalWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button
            size="small"
            onClick={() => {
              this.props.ButtonHandler('FirstShift');
            }}
          >
            Первая смена
          </Button>
          <Button
            size="small"
            onClick={() => {
              this.props.ButtonHandler('SecondShift');
            }}
          >
            Вторая смена
          </Button>
          <Button
            size="small"
            onClick={() => {
              this.props.ButtonHandler('FullDay');
            }}
          >
            Сутки
          </Button>
        </div>
        <div>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              this.props.ButtonHandler('Apply');
            }}
          >
            Применить
          </Button>
          <Button
            size="small"
            onClick={() => {
              this.props.ButtonHandler('Cancel');
            }}
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }
}
