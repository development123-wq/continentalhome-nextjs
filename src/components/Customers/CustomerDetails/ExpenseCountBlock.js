"use client";

import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

function ExpenseCountBlock({ orders = [] }) {
  const [total, setTotal] = useState(0);
  const [avg, setAvg] = useState(0);
  const [series, setSeries] = useState([0]);

  useEffect(() => {
    console.log("ORDERS RECEIVED IN EXPENSE BLOCK:", orders);
    if (orders.length > 0) {
      const totalAmount = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
      const average = totalAmount / 12;

      setTotal(totalAmount.toFixed(2));
      setAvg(average.toFixed(2));

      const percent = Math.min(100, Math.round((totalAmount / 5000) * 100));
      setSeries([percent]);
    }
  }, [orders]);

  const foodSpend = (total * 0.33).toFixed(2);
  const clothSpend = (total * 0.47).toFixed(2);
  const otherSpend = (total * 0.2).toFixed(2);

  const options = {
    chart: {
      height: 250,
      type: 'radialBar',
      toolbar: {
        show: true,
      },
    },
    colors: ['#0d6efd'],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          showOn: 'always',
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px',
          },
          value: {
            formatter: function (val) {
              return parseInt(val);
            },
            color: '#111',
            fontSize: '36px',
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['var(--chart-color1)'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Percent'],
  };

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold">Expense Count</h6>
      </div>
      <div className="card-body" style={{ position: 'relative' }}>
        <div className="d-flex justify-content-end text-center">
          <div className="p-2">
            <h6 className="mb-0 fw-bold">${total}</h6>
            <span className="text-muted">Total</span>
          </div>
          <div className="p-2 ms-4">
            <h6 className="mb-0 fw-bold">${avg}</h6>
            <span className="text-muted">Avg Month</span>
          </div>
        </div>
        <Chart options={options} series={series} type="radialBar" height="250" />
        <div className="row mt-4">
          <div className="col text-center">
            <span className="mb-2 d-block">Food</span>
            <div className="progress" style={{ height: '5px' }}>
              <div className="progress-bar bg-warning" role="progressbar" style={{ width: '33%' }}></div>
            </div>
            <span className="mt-2 d-block text-warning">${foodSpend} spend</span>
          </div>
          <div className="col text-center">
            <span className="mb-2 d-block">Cloth</span>
            <div className="progress" style={{ height: '5px' }}>
              <div className="progress-bar bg-success" role="progressbar" style={{ width: '47%' }}></div>
            </div>
            <span className="mt-2 d-block text-success">${clothSpend} spend</span>
          </div>
          <div className="col text-center">
            <span className="mb-2 d-block">Other</span>
            <div className="progress" style={{ height: '5px' }}>
              <div className="progress-bar bg-purple" role="progressbar" style={{ width: '20%' }}></div>
            </div>
            <span className="mt-2 d-block text-purple">${otherSpend} spend</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCountBlock;