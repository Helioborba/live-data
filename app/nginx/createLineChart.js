import React, {useEffect, useState } from 'react';
import LineChart from '../chart/lineChart.js';

function colorsCreator(val) {
    // val é a força da cor
    return Math.round(Math.random() * val);
}

const CreateLineChart = () => {
    const [chartData,setChartData] = useState({labels:[],datasets:[]}); // A CHAVE DO SUCESSO PARA O USEEFFECT
    const [qtd,setQtd] = useState(0); // A CHAVE DO SUCESSO PARA O USEEFFECT
    const [usr,setUsr] = useState(''); // A CHAVE DO SUCESSO PARA O USEEFFECT
    
    useEffect(() => {
        setInterval( () => {
            fetch('/client_php/model/graficos.php')
            .then(res => res.json())
            .then((dados) => {
                const cores = []; // borda
                const coresBorda = []; // background
                const labelTipos = []; // Utilizada para manter os tipos de ativos !SUPER IMPORTANTE
                const dias = [];  // mantem os dias, é o pilar do grafico
                const datasets = []; // dados finais para criação do grafico
                
                if (dados.MSG === 'Success') {
                    dados.DADOS.forEach( (valor) =>  {
                        // Gerar cores e pegar os dias
                        coresBorda.push(`rgb(${colorsCreator(255)},${colorsCreator(255)},${colorsCreator(200)})`);
                        cores.push(`rgba(${colorsCreator(255)},${colorsCreator(255)},${colorsCreator(200)},0.5)`);
                        // Array Dias
                        
                        if (dias.includes(valor.dia) === false) dias.push(valor.dia);
                        // Array com as labels dos ativos
                        if (labelTipos.includes(valor.ativo) === false) labelTipos.push(valor.ativo);
                    }) 
                    
                    // Organizar datas
                    let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
                    dias.sort(collator.compare)

                    // Criar um objeto contendo todas as labels
                    var objLabelsAtivo = {};
                    for (const lbl of labelTipos) {
                        objLabelsAtivo = { ...objLabelsAtivo, [lbl]: 0 }
                    }
            
                    // Extrair os valores e dar assign no objeto
                    const objectDados = []
                    for (const dia of dias) {
                        let objAtivo = {};
                        dados.DADOS.forEach( (val) => {
                            if (dia === val.dia) {
                                // Adiciona o ultimo objAtivo ao novo
                                objAtivo = { ...objAtivo,
                                    [val.ativo]: val.quantidade
                                }
                            } 
                        })
                        // fusao dos objetos
                        objectDados.push({
                            [dia]: {...objLabelsAtivo,...objAtivo}
                        })
                    }
            
                    // Utilizado para modelar os dados para o dataset
                    var greatObject = {}
                    for (const labels of labelTipos) {
                        greatObject = {
                            ...greatObject,
                            [labels] : []
                        }
                    }
            
                    // Retira os dados não modelados e passa para o greatObject, agora com os dados completos
                    for (const obj of objectDados) {
                        let objIndex = Object.keys(obj)[0]; // pegar indice (dia)
                        let object = obj[objIndex]; // pegar valor do indice (dia)
                        let ativos = Object.keys(object); // pegar o array de ativos
                        let quantidade = Object.values(object); // pegar o array de quantidade
            
                        for (const index in ativos) {
                            greatObject[ativos[index]].push(quantidade[index])
                        }
                    }
            
                    // Criar o dataset apartir do greatObject
                    for (const value of Object.keys(greatObject)) {
                        let randomValue = [Math.floor(Math.random() * cores.length)];
                        datasets.push({
                            label: value,
                            data: Object.values(greatObject[value]),
                            hoverOffset: 4,
                            borderColor: coresBorda[randomValue],
                            backgroundColor: cores[randomValue],
                            pointBackgroundColor: 'white'
                        })
                    }
                    const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
                    const data = {
                        labels: dias,
                        datasets: datasets
                    };
                    
                    const usuarios = {
                        '4':"Joao",
                        '14':"Leonardo",
                        '24':"Gabriel",
                        '34':"Willyan",
                        '44':"Tamara",
                        '54':'Bot'
                    };

                    return {data:data,qtd:dados.TOTAL,usuario:usuarios[`${dados.DADOS[dados.DADOS.length - 1].id_usuario}`]};
                }
            })
            .then( (data) => {
                // Setar os dados do chart + a quantidade para a label
                setChartData(data.data);
                setQtd(data.qtd);
                setUsr(data.usuario);
                console.log(data.data)
            })
            .catch(err=>{console.log(err)})
        },2000)
    }, []);
    return(
        <React.Fragment>
            <LineChart data={chartData} qtd={qtd} usuario={usr}/>
        </React.Fragment>
    )
}
export default CreateLineChart;