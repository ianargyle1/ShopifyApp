import React, { Component } from 'react';


class VarSelector extends React.Component {
  state = { boder: 'none', selected: false }
  render() {
    return (
        <div>
            <p style={{marginBottom: "0.5rem"}}>{this.props.title}</p>
            <select onChange={(e) => this.props.handleSelection(this.props.title, e.target.value)} style={{marginBottom: "1.3rem"}}>
                {(this.props.options) ? (this.props.options.map(op => (<option value={op}>{op}</option>))) : void(0)}
            </select>
        </div>
    );
  }
  clicked = () => {
    this
  }
}

 export default VarSelector;