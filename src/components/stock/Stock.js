import React, { Component } from 'react';
import '../../css/stock/stock.css'
import Grafico from '../Grafico';

class Stock extends Component {

    constructor(props) {
        super(props);
        const { ticker, price,} = this.props.dati
        this.state = { ticker, price, datatrade: new Date().toLocaleTimeString(), ckrealtime: '', datigrafico: [{ datetime: new Date().toLocaleTimeString(), price: price }], showgrafico: false };
        console.log('1f) FIGLIO Creo istanza');
    }

    static getDerivedStateFromProps(np, ps) {
        if (np.dati.ticker !== ps.ticker) {
            return { nome: np.dati.ticker, price: np.dati.price }
        }
        return null;
    }

    componentDidMount() {
        console.log('3f) FIGLIO DidMount ');
    }

    componentDidUpdate() {
        console.log('4f) FIGLIO Update ');

    }

    // aggiornoStock = () => {
    //     const valore = this.state.valore + 10
    //     this.setState({ valore })
    // }
    eliminoStock = () => {
        this.props.eliminoStock(this.props.dati.ticker)
    }
    startCheckElemento = () => {
        this.timer = setInterval(() => this.getNewElementi(), 10000)
    }
    stopCheckElemento = () => {
        clearInterval(this.timer);
    }
    // componentWillMount =() => {
    //     clearInterval(this.timer);
    // }
    startRealtime = () => {
        const ckrt = this.state.ckrealtime === 'checked' ? '' : 'checked';
        if (ckrt === 'checked') {
            this.startCheckElemento();
        } else {
            this.stopCheckElemento();
        }
        this.setState({ ckrealtime: ckrt })
    }
    getNewElementi = () => {
        const url = `https://api.stockdata.org/v1/data/quote?symbols=${this.props.dati.ticker}&api_token=ZF98QgfKF03lubGEsUES5XIA0AnyYzOrJcpdv5N1`;
        console.log(url);
        fetch(url)
          .then(r => r.json())
          .then(data => {
            console.log('Prostatic', data);
      
            // Assicurati che la struttura della risposta sia come previsto
            // Verifica quale parte della risposta contiene l'informazione che stai cercando
            const tickerData = data.data[0]; // Assumi che il ticker desiderato sia il primo elemento
            const random = Math.ceil(Math.random() * 10) * (Math.round(Math.random()) ? 1 : -1) / 3;
            const datatrade = new Date().toLocaleTimeString();
            console.log(datatrade);
      
            // Verifica quale chiave nella risposta contiene il prezzo di apertura (day_open)
            const dayOpen = tickerData.day_open;
            const price = Number(dayOpen) + random;
            console.log(price);
      
            const datigrafico = [...this.state.datigrafico, { datetime: datatrade.substring(11), price: price }];
            this.setState({ price, datatrade, datigrafico });
          })
          .catch((error) => {
            console.log('Fetch failed', error);
          });
      }
      
    showGrafico = () => {
        this.setState({ showgrafico: !this.state.showgrafico })
    }

    render() {
        console.log('2f) FIGLIO Render');
        const diff = (this.state.price - this.props.dati.price).toFixed(2)
        const percentuale = (diff / this.props.dati.price) * 100;
        let disabled = this.state.datatrade >= "09:00:00" && this.state.datatrade <= "20:00:00" ? false:true ;
        return (
            <div className="stock col-md-6 p-3">
                <div className="bodystock">
                    <i className="fas fa-times-circle closebtn" onClick={this.eliminoStock}></i>
                    <div className="row">
                        <div className="col-sm">
                            <h2 className='giallo'>{this.props.dati.ticker}</h2>
                            <p>Nasdaq</p>
                        </div>
                        <div className="col-sm">
                            <h2>{parseFloat(this.state.price).toFixed(2)}</h2>
                            <p className="giallo">{this.state.datatrade}</p>
                        </div>
                        <div className="col-sm">
                            <h2>{diff}</h2>
                            <p style={{
                                color: percentuale < 0 ? 'red' : 'green'
                            }}>{percentuale.toFixed(1)} %</p>
                        </div>
                        <div className="col-sm">
                            <p><i className="fas fa-chart-line fa-2x" onClick={this.showGrafico}></i></p>
                            <label className="bs-switch">
                                <input type="checkbox" checked={this.state.ckrealtime} onChange={this.startRealtime} disabled={disabled}/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="bodygrafico">
                    <div className="row">
                        <div className="col-sm">
                            {this.state.showgrafico && <Grafico data={this.state.datigrafico} chiusura={this.props.dati.price} />}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Stock