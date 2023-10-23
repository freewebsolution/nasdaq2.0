import React, { Component } from 'react'
import logo from './logo.png';
import './css/App.css';
import Stock from './components/stock/Stock';
import Cerca from './components/Cerca';
import NomeStock from './components/NomeStock';

export class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      listaelementi: [],
      listapreferiti: [],
      inCaricamento: false,
      showError: false,
      msg: null,
      showAvviso: false,
      msgAvviso: ''
    }
    console.log(`1g) il costruttore crea la prima istanza Genitore`)
  }


  cercaElementi = str => {
    console.log('Dati',this.state.listaelementi)
    this.getElementi(str);
  }
  getElementi = str => {
    const url = `https://api.stockdata.org/v1/data/quote?symbols=${str}&api_token=ZF98QgfKF03lubGEsUES5XIA0AnyYzOrJcpdv5N1`;
    this.setState({ inCaricamento: true, showError: false, showAvviso: false })
    fetch(url)
    .then(r => r.json())
    .then(r => {
      console.log('Risposta API', r);
      const data = r.data; // Assicurati che "data" sia l'array corretto
      console.log('Data:', data);
      if (Array.isArray(data)) {
        this.setState({ listaelementi: data, inCaricamento: false });
        console.log('Stato impostato correttamente');
      } else {
        console.error('I dati ricevuti non sono un array');
      }
    })
    .catch((error) => {
      this.setState({ inCaricamento: false, showError: true, msg: error.message });
      console.error('Fetch failed', error);
    });
  

  }
  addPreferiti = ids => {
    // alert(`Hai cliccato sull'elemnto ${ids}`)
    this.setState({ listapreferiti: [...this.state.listapreferiti, this.state.listaelementi[ids]] })
  }
  eliminoStock = (symbol) => {
    const preferiti = this.state.listapreferiti.filter(el => {
      if (el.symbol !== symbol) return true;
      return false;
    })
    this.setState({ listapreferiti: preferiti })
  }
  render() {
    console.log(`2g) Genitore Render`)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p style={{ color: 'gold' }}>
            Applicazione Stock Exchange
          </p>
          <Cerca onInputSearch={this.cercaElementi} />
          <div className="container-fluid" style={{ marginTop: '20px' }}>
            <section className="col-md-12 listanomi">
              <div className="row">
                <div className="col">
                  {this.state.inCaricamento && <p className='text-center'>Caricamento in corso ...</p>}
                  {this.state.showError && <p className='text-center'>{this.state.msg}</p>}
                  {this.state.showAvviso && <p className="text-center">{this.state.msgAvviso}</p>}
                  {Array.isArray(this.state.listaelementi) && this.state.listaelementi.length > 0 ? (
                    this.state.listaelementi.map((el, index) => (
                      <NomeStock key={index} data={el} ids={index} onAddPreferiti={this.addPreferiti} />
                    ))
                  ) : (
                    <p>Nessun risultato trovato</p>
                  )}
                  
                                   
                </div>
              </div>
            </section>
            <section className="listapreferiti row">
              {this.state.listapreferiti.map((el,index) => <Stock key={index} dati={el} eliminoStock={this.eliminoStock} symbol={el.symbol} />)}
            </section>
          </div>
        </header>
      </div>

    )
  }
}

export default App