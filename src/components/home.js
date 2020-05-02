import React, { Component } from 'react'
import { Line } from "react-chartjs-2"

export default class Home extends Component {
  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          label: "BTC-USD",
          // backgroundColor: "rgba(0, 0, 0, 0)",
          borderWidth: "2",
          // lineTension: 0.45,
          data: [],
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10
        }
      ]
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 100
            }
          }
        ]
      }
    }
  };

  
  componentDidMount(){
    const subscription = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["BTC-USD"]
        }
      ]
    };

    this.ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(subscription));
    };

    this.ws.onmessage = e => {
      const value = JSON.parse(e.data);
      if (value.type !== "ticker") {
        return;
      }

      const oldBtcDataSet = this.state.lineChartData.datasets[0];
      const newBtcDataSet = { ...oldBtcDataSet };
      newBtcDataSet.data.push(value.price);

      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newBtcDataSet],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      this.setState({ lineChartData: newChartData });
    };
  }
 

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    return (
      <div>
      <h1>BITCOIN / U.S. DOLLAR</h1>
      <p style={{color:'#222'}}>BTC-USD</p>
        <Line data={this.state.lineChartData} options={this.state.lineChartOptions} />
      </div>
    )
  }
}
