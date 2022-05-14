import { useRef, useEffect } from 'react';
import {Box} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
  
const LineChart = () => {
  const myRef = useRef();
  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
        color: "white",
        },
        ticks: {
          color: "white"
        }
      },
      y: {
         grid: {
          color: "white"
        },
        ticks: {
          color: "white"
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
        color: 'white',
        labels: {
          color: "#fff"
        }
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
        color: '#fff'
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointBackgroundColor: 'white'
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointBackgroundColor: 'white'
      },
    ],
  };
  // let lineChart = myRef.chartInstance;
  // lineChart.update();
  useEffect(() => {
    setInterval(() => {
      setInterval(console.log(myRef),8000);
      const chart = myRef.current;
      const labels = chart.data.labels;
    
      chart.data.datasets.forEach((dataset) => {
        dataset.data = labels.map(() => faker.datatype.number({ min: -1000, max: 1000 }));;
      });
      chart.update();
    }, 8000);
  }, []);
  return(
    <Line options={options} data={data} ref={myRef}/>
  )
}
export default LineChart;