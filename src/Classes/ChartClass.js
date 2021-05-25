import * as D3 from 'd3';
export class Chart {
  Chart = null;
  X = null;
  Y = null;
  constructor(ContainerRef, DataChart) {
    //Создаем SVG холст
    this.Chart = D3.select(ContainerRef)
      .append('svg')
      .attr('width', `${ContainerRef.offsetWidth}`)
      .attr('height', `${ContainerRef.offsetHeight}`)
      .append('g')
      .attr('transform', `translate(40,20)`);
    //Создаем Ось X

    switch (DataChart.Options.x.type) {
      case 'Time':
        this.X = D3.scaleTime()
          .domain(
            D3.extent(DataChart.DataSource[0].Data, (Time) => {
              return Time[0];
            })
          )
          .range([0, ContainerRef.offsetWidth]);
        this.Chart.append('g')
          .attr(
            'transform',
            `translate(0,${
              ContainerRef.offsetHeight - (ContainerRef.offsetHeight / 100) * 6
            } )`
          )
          .call(D3.axisBottom(this.X));
        //Создаем ось Y
        switch (DataChart.Options.y.type) {
          case 'Standart':
            this.Y = D3.scaleLinear()
              .domain(
                D3.extent(DataChart.DataSource[0].Data, (Temperature) => {
                  return Temperature[1];
                })
              )
              .range([ContainerRef.offsetHeight, 0]);
            this.Chart.append('g').call(D3.axisLeft(this.Y));
            break;
        }
        //Рисуем графики
        DataChart.DataSource.forEach((Chart) => {
          this.Chart.append('path')
            .datum(Chart.Data)
            .attr('fill', 'none')
            .attr('stroke', Chart.Color)
            .attr('stroke-width', 1.5)
            .attr(
              'd',
              D3.line()
                .x((Point) => {
                  return this.X(Point[0]);
                })
                .y((Point) => {
                  return this.Y(Point[1]);
                })
            );
        });
    }
  }
}
