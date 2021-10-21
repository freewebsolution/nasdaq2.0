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

  // -------MOUNTING CREAZIONE ----------
  componentDidMount() {
    // const stock = [

    //   {
    //     nome: 'APPL',
    //     valore: 200
    //   },
    //   {
    //     nome: 'GOOG',
    //     valore: 350
    //   }
    // ]
    // this.setState({ listaStock: stock })
  }

  // --------UPDATE AGGIORNAMENTO--------

  // static getDerivedStaeFromProps(np,ns) {
  //   return null
  // }

  // componentDidUpdate() {
  //   console.log(`4g) DidUpdate padre ${this.state.nome}`)
  // }
  // aggiornoStock = (e) => {
  //   e.preventDefault()
  //   const stock1 = [

  //     {
  //       nome: 'AMZ',
  //       valore: 250
  //     },
  //     {
  //       nome: 'MICROSOFT',
  //       valore: 750
  //     },
  //     {
  //       nome: 'APPL',
  //       valore: 1299
  //     }
  //   ]
  //   this.setState({ listaStock: stock1 })
  // }
  cercaElementi = str => {
    //alert(`Stai cercando ${str}` )
    this.getElementi(str);
  }
  getElementi = str => {
    const url = `https://lucioticali.it/nasdaqApi/api/v1/search/${str}`;
    this.setState({ inCaricamento: true, showError: false, showAvviso: false })
    fetch(url)
      .then(r => r.json())
      .then(r => {
        console.log(r)
        const data  = r;
        console.log(`Lunghezza oggetto ${data.length}`)
        if (data.length < 1) {
          this.setState({ showAvviso: true, msgAvviso: 'Spiacente non ho trovato elementi, Riprova!', listaelementi: [] })
        } else {
          this.setState({ showAvviso: false, msgAvviso: '' })
        }
        this.setState({ listaelementi: data, inCaricamento: false })
        console.log('Recupero dati ' + JSON.stringify(r))
      })
      .catch((error) => {
        this.setState({ inCaricamento: false, showError: true, msg: error.message })
        console.log('Fetch failed', error)
      })

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
                  {this.state.listaelementi.map((el, index) => <NomeStock key={index} dati={el} ids={index} onAddPreferiti={this.addPreferiti} />)}
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