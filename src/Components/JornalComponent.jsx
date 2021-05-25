import * as React from 'react';
import JornalTestData from '../TestData/JornalTestData.json';
import { Table } from 'antd';
import { GenerateTableData } from '../Helpers/Helpers';
export default function JornalComponent() {
  return (
    <Table
      dataSource={GenerateTableData('Rows', JornalTestData.rows)}
      columns={GenerateTableData('Columns', JornalTestData.cols)}
    />
  );
}
