import React, { Component } from 'react'
 class NomeStock extends Component {
     addPreferiti =()=> {
        this.props.onAddPreferiti(this.props.ids);
     }
    render() {
        return (
            <div className='nomestock' onClick={this.addPreferiti}>
                <i className="fas fa-plus-circle"></i>{this.props.dati.symbol} - {this.props.dati.name} 
            </div>
        )
    }
}

export default NomeStock
