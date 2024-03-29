import Moment from 'moment';
import { toLonLat } from 'ol/proj';
export const CheckUniqale = (Trucks) => {
  let Count = 0;
  Trucks.forEach((Truck) => {
    Count = 0;
    Trucks.forEach((CurrentTruck) => {
      if (
        Truck.LoadTypeId == CurrentTruck.LoadTypeId &&
        Truck.TruckModelId == CurrentTruck.TruckModelId
      ) {
        Count = Count + 1;
      }
    });
  });
  return Count <= 1;
};
export function CoordinatesToLonLat(Coordinates) {
  return Coordinates[0].map((Coordinate) => {
    let LonLatCordinate = toLonLat(Coordinate);
    return {
      Lon: LonLatCordinate[0],
      Lat: LonLatCordinate[1],
    };
  });
}
export function HexToRgbA(Hex, Opasity) {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(Hex)) {
    let Color = Hex.substring(1).split('');
    if (Color.length == 3) {
      Color = [Color[0], Color[0], Color[1], Color[1], Color[2], Color[2]];
    }
    Color = '0x' + Color.join('');
    return `rgba(${[(Color >> 16) & 255, (Color >> 8) & 255, Color & 255].join(
      ','
    )},${Opasity == undefined ? 1 : Opasity})`;
  }
  if (/^rgb/.test(Hex)) {
    return Hex;
  }
}
export function AntDGenerateTreeData(Objects, Options) {
  return Objects.map((TreeNode) => {
    let NewTreeNode = {
      title: TreeNode[Options.TitleName],
      key: TreeNode[Options.KeyName],
    };
    if (Options.ChildrensName in TreeNode) {
      NewTreeNode.children = AntDGenerateTreeData(
        TreeNode[Options.ChildrensName],
        Options
      );
    }
    if ('TreeNodeOptions' in Options) {
      NewTreeNode = Object.assign(NewTreeNode, Options.TreeNodeOptions);
    }

    return NewTreeNode;
  });
}
export const ApiFetch = (Adress, Method, Body, Callback) => {
  return new Promise((resolve, reject) => {
    fetch(Adress, { body: JSON.stringify(Body), method: Method })
      .then((JSONResponse) => {
        JSONResponse.json()
          .then((Response) => {
            if ('error' in Response) {
              reject(Response.error);
            } else {
              Callback(Response);
              resolve(Response);
            }
          })
          .catch((JsonError) => {});
      })
      .catch((FetchError) => {
        console.log(FetchError);
      });
  });
};
export function GenerateTableData(Mode, Data, Options) {
  let FormatData = null;
  switch (Mode) {
    case 'Rows':
      FormatData = Data.map((Row, RowIndex) => {
        let NewRow = { key: `${RowIndex}` };
        Row.forEach((Cell, Index) => {
          NewRow[Index] = Cell;
        });
        return NewRow;
      });
      break;
    case 'Columns':
      FormatData = Data.map((Column, Index) => {
        let NewColumn = {};
        if (Options != undefined) {
          Object.assign(NewColumn, Options, {
            dataIndex: `${Index}`,
            key: `${Index}`,
          });
          if ('TitleStyle' in Options) {
            NewColumn.title = NewColumn.TitleStyle(
              typeof Column == 'object' ? Column.caption : Column
            );
          } else {
            NewColumn.title =
              typeof Column == 'object' ? Column.caption : Column;
          }
        } else {
          NewColumn = {
            dataIndex: `${Index}`,
            key: `${Index}`,
            title: typeof Column == 'object' ? Column.caption : Column,
          };
        }
        return NewColumn;
      });
      break;
  }
  return FormatData;
}
export function RandomColor() {
  return (
    '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase()
  );
}
export function TableSorter(Feeld) {
  return (a, b) => {
    if (
      Moment(a[Feeld], 'DD.MM.YYYY hh:mm:ss').unix() >
      Moment(b[Feeld], 'DD.MM.YYYY hh:mm:ss').unix()
    ) {
      return 1;
    }
    if (
      Moment(a[Feeld], 'DD.MM.YYYY hh:mm:ss').unix() <
      Moment(b[Feeld], 'DD.MM.YYYY hh:mm:ss').unix()
    ) {
      return -1;
    }
    if (
      Moment(a[Feeld], 'DD.MM.YYYY hh:mm:ss').unix() ==
      Moment(b[Feeld], 'DD.MM.YYYY hh:mm:ss').unix()
    ) {
      return 0;
    }

    if (a[Feeld] > b[Feeld]) {
      return 1;
    }
    if (a[Feeld] < b[Feeld]) {
      return -1;
    }
    if (a[Feeld] == b[Feeld]) {
      return 0;
    }
    if (a[Feeld].length == 0) {
      return 1;
    }
    if (b[Feeld].length == 0) {
      return -1;
    }
    if (a[Feeld].length == 0 && b[Feeld].length == 0) {
      return 0;
    }

    if (a[Feeld].toLowerCase() < b[Feeld].toLowerCase()) {
      return -1;
    }
    if (a[Feeld].toLowerCase() > b[Feeld].toLowerCase()) {
      return 1;
    }
    if (a[Feeld].toLowerCase() == b[Feeld].toLowerCase()) {
      return 0;
    }
  };
}
