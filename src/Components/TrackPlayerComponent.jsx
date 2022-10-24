import * as React from 'react';
import { Slider, Button, Input, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { observer, inject } from 'mobx-react';

@inject('ProviderStore')
@observer
export default class TrackPlayerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.PlayerDataMap = null;
    this.CurrentTraks = null;
    this.CurrentTab = this.props.ProviderStore.OpenTabs.find((Tab) => {
      return Tab.Key == this.props.ProviderStore.CurrentTabKey;
    });
    this.state = {
      Speed: 10,
      PlayerInterval: null,
    };
  }
  InitPlayerData() {
    this.CurrentTraks =
      this.CurrentTab.Options.GetNamedFeatures(/^Track\w{1,}/);
    let PlayerDataMap = new Map();

    this.CurrentTab.Options.GetNamedFeatures(/^Track\w{1,}/).forEach(
      (TrackFeature) => {
        TrackFeature.getGeometry()
          .getCoordinates()
          .forEach((Coordinates) => {
            PlayerDataMap.set(Coordinates[2], {
              Mark: this.CurrentTab.Options.GetVectorLayerSource().getFeatureById(
                `Mark${TrackFeature.getId()}`
              ),
              Coordinates: Coordinates,
            });
          });
      }
    );
    return PlayerDataMap;
  }
  PlayerHandler(Action) {
    switch (Action) {
      case 'Play':
        this.PlayerDataMap = this.InitPlayerData();
        if (this.state.PlayerInterval == null) {
          this.setState({
            PlayerInterval: setInterval(() => {
              if (
                this.CurrentTab.Options.CurrentTrackPlayerTime.unix() !=
                this.CurrentTab.Options.EndDate.unix()
              ) {
                this.props.ProviderStore.SetNewCurrentTimeTrackPlayer(
                  this.CurrentTab.Options.CurrentTrackPlayerTime.unix() +
                    (1 * this.state.Speed) / 10
                );
              }
              if (
                this.PlayerDataMap.has(
                  this.CurrentTab.Options.CurrentTrackPlayerTime.unix()
                )
              ) {
                let Data = this.PlayerDataMap.get(
                  this.CurrentTab.Options.CurrentTrackPlayerTime.unix()
                );
                Data.Mark.getGeometry().setCoordinates(Data.Coordinates);
              }
            }, this.state.Speed),
          });
        }

        break;
      case 'Pause':
        clearInterval(this.state.PlayerInterval);
        this.setState({ PlayerInterval: null });
        break;
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.PlayerInterval);
  }
  ChangeTransportMarkPosition(NewTime) {
    if (this.PlayerDataMap != null) {
      let TimeArray = this.CurrentTraks.map((Track) => {
        return Track.getGeometry()
          .getCoordinates()
          .reduce((LastResult, Coordinate, Index, Array) => {
            if (LastResult > Math.abs(NewTime - Coordinate[2])) {
              if (NewTime > Coordinate[2]) {
                return NewTime - (NewTime - Coordinate[2]);
              } else {
                return NewTime + (Coordinate[2] - NewTime);
              }
            }
          }, Infinity);
      });

      this.props.ProviderStore.SetNewCurrentTimeTrackPlayer(NewTime);
      TimeArray.forEach((Time) => {
        let TransportData = this.PlayerDataMap.get(Time);
        TransportData.Mark.getGeometry().setCoordinates(
          TransportData.Coordinates
        );
      });
    }
  }
  RemoveTrackPlayer = () => {
    this.props.ProviderStore.SetNewCurrentControls('Remove', 'TrackPlayer');
    this.CurrentTab.Options.MapObject.removeControl(
      this.CurrentTab.Options.MapObject.getControls().array_.find((Control) => {
        return Control.get('Id') == 'TrackPlayer';
      })
    );
    clearInterval(this.state.PlayerInterval);
    this.setState({ PlayerInterval: null });
    this.props.ProviderStore.SetNewCurrentTimeTrackPlayer(
      this.CurrentTab.Options.StartDate.unix()
    );
    this.CurrentTab.Options.GetVectorLayerSource().forEachFeature((Feature) => {
      if (/MarkTrack/.test(Feature.getId())) {
        this.CurrentTab.Options.GetVectorLayerSource().removeFeature(Feature);
      }
    });
    this.PlayerDataMap = null;
  };
  render() {
    return (
      <div
        className="MatteGlass"
        style={{
          width: '600px',
          height: '30px',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <Button
          size="small"
          type="primary"
          onClick={() => {
            this.PlayerHandler('Play');
          }}
        >
          Пуск
        </Button>
        <Button
          size="small"
          onClick={() => {
            this.PlayerHandler('Pause');
          }}
        >
          Стоп
        </Button>
        <Slider
          tooltipVisible={false}
          onChange={(NewTime) => {
            this.ChangeTransportMarkPosition(NewTime);
          }}
          min={this.CurrentTab.Options.StartDate.unix()}
          max={this.CurrentTab.Options.EndDate.unix()}
          value={this.CurrentTab.Options.CurrentTrackPlayerTime.unix()}
          style={{
            width: '350px',
          }}
        />
        <Input
          size="small"
          style={{ width: '70px' }}
          value={this.CurrentTab.Options.CurrentTrackPlayerTime.format(
            'HH:mm:ss'
          )}
        />
        <Select
          size="small"
          onChange={(NewSpeed) => {
            this.setState({ Speed: NewSpeed });
          }}
          value={this.state.Speed}
          options={[
            { value: 10, label: '1' },
            { value: 20, label: '2' },
            { value: 50, label: '5' },
            { value: 100, label: '10' },
            { value: 300, label: '30' },
          ]}
        />
        <CloseOutlined
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => {
            this.RemoveTrackPlayer();
          }}
        />
      </div>
    );
  }
}
