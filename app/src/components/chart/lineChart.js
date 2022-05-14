import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    SubTitle
  } from 'chart.js';
  
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  SubTitle
);


const LineChart =  (props) => {
  /**
   * For those types of chart to work you need to pass the state as a props, and update that state in useEffect  with a fetch data
   */
  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: "white"
        }
      },
      y: {
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
        text: 'Gráfico Inventario',
        color: '#fff'
      },
      subtitle: {
        display: true,
        text: `Quantidade Total: ${props.qtd}.  Ultimo item adicionado por: ${props.usuario}`,
        color: '#fff'
      }
  
    },
  };
  return(
    <Line options={props.options? props.option: options} data={props.data}/>
  )
}
export default LineChart;