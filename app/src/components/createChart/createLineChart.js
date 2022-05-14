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
                const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
                if (dados.MSG === 'Success') {
                    dados.DADOS.forEach( (valor) =>  {
                        // Gerar cores e pegar os dias
                        coresBorda.push(`rgb(${colorsCreator(255)},${colorsCreator(255)},${colorsCreator(200)})`);
                        cores.push(`rgba(${colorsCreator(255)},${colorsCreator(255)},${colorsCreator(200)},0.5)`);
                        // Array Dias
                        
                        // if (dias.includes(valor.dia) === false) dias.push(valor.dia);
                        // Array com as labels dos ativos
                        if (labelTipos.includes(valor.ativo) === false) labelTipos.push(valor.ativo);
                    }) ;

                    // Criar um objeto contendo todas as labels
                    let objLabelsAtivo = {};
                    for (const lbl of labelTipos) {
                        objLabelsAtivo = { ...objLabelsAtivo, [lbl]: null }
                    };
            
                    // criar estrutura com labels e messes
                    const struct = [];
                    for (const mon of months) {
                        if (mon === 'Janeiro') {
                            let newObj = {};
                            for (const [key] of Object.entries(objLabelsAtivo)) {
                                newObj  = { ...newObj, [key]: 0 }
                            };
                            struct.push( {[mon]: newObj });
                            continue;
                        }
                        struct.push( {
                            [mon]: {...objLabelsAtivo}
                        });
                    };

                    // adicionar dados
                    let arrayLast = {};
                    for (const [index,mon] of Object.entries(months)) {
                        arrayLast = {...arrayLast,[index]:mon}
                    }
            
                    dados.DADOS.forEach( (valor) =>  { 
                        const diar = new Date(valor.dia).getMonth();
                        const mes = months[diar];
                        // let lastMonth = null;
                        // console.log('--------------');
                        for (const [index,objMonth] of Object.entries(struct)) {
                            let lastGreatValue = 0;
                            for (const [month,objAtivos] of Object.entries(objMonth)) {      
                                if (month === mes) {
                                    for (const ativos of Object.keys(objAtivos)) {
                                        // pega o maior numero anterior
                                        for (const key of Object.keys(struct)) {
                                            if ((struct[key][months[key]][ativos]) > lastGreatValue && ativos === valor.ativo) {
                                                lastGreatValue = struct[key][months[key]][ativos];
                                            }
                                            if (index === key) {
                                                // parar o loop backwards caso ele já chegue no inicial
                                                break;
                                            }
                                        }
                                        if (ativos === valor.ativo) {
                                            
                                            struct[index][month][ativos] = Number(valor.quantidade) + lastGreatValue;

                                                                                     
                                            // Faz um loop nos valores anteriores, e caso sejam nulos Adicionar ao valor anterior o mesmo valor contido
                                            for (const ind of Object.keys(months)) {
                                                if (ind === index) {
                                                    break;
                                                }
                                                if (arrayLast[ind]) {
                                                    if (struct[ind][arrayLast[ind]][ativos] === null && ativos === valor.ativo) {
                                                        struct[ind][arrayLast[ind]][ativos] = Number(valor.quantidade) + lastGreatValue;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })

                    // Cria um objeto que contem ativos e o valor deles sao um array
                    let labelsObj = {}
                    for (const lbl of labelTipos) {
                        labelsObj = {...labelsObj,[lbl]:[]}
                    }
                    
                    // remover dados do struct e dar assign nas labelsObj com estes dados
                    for (const objData of struct) {
                        for (const values of Object.values(objData)) {
                            for (const [key,val] of Object.entries(values)) {
                                for (const index of (Object.keys(labelsObj))){
                                    if (index === key) {
                                        labelsObj[index].push(val);
                                    };
                                };
                            };
                        };
                    };

                    // uma label pra cada ativo, e cada um tem que ter o array pros 12 dias ([0-0-9-9-9-9-9-9-0])
                    for (const [key,value] of Object.entries(labelsObj)) {
                        let randomValue = [Math.floor(Math.random() * cores.length)];
                        datasets.push({
                            label: key,
                            data: value,
                            hoverOffset: 4,
                            borderColor: coresBorda[randomValue],
                            backgroundColor: cores[randomValue],
                            pointBackgroundColor: 'white'
                        })
                    }

                    const data = {
                        labels: months,
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
                if (data !== undefined) {
                    setChartData(data.data);
                    setQtd(data.qtd);
                    setUsr(data.usuario);
                }
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