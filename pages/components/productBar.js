import React, { Component } from 'react';


class ProductBar extends React.Component {
  state = { boder: 'none', selected: false }
  render() {
    return (
        <div onMouseEnter={() => this.mouseOver()} onMouseLeave={() => this.mouseOut()} onClick={() => this.props.handleClick(this.clicked, this.unClicked, this.props.id, this.props.image)} style={{borderRadius: "5px", border: this.state.border, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".5rem", padding: "1px"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <img src={this.props.image} style={{borderRadius: "5px", width: "10rem"}}/>
                <div style={{marginLeft: "1rem"}}>
                    <div style={{fontSize: "1.5rem"}}>{this.props.title}</div>
                    <div id="price{{prod.handle}}" style={{fontSize: "1rem"}}>{(this.props.price) ? (this.props.price.minVariantPrice.amount < this.props.price.maxVariantPrice.amount) ? "From " + new Intl.NumberFormat(navigator.language, {style: 'currency', currency: this.props.price.minVariantPrice.currencyCode}).format(this.props.price.minVariantPrice.amount/100) : new Intl.NumberFormat(navigator.language, {style: 'currency', currency: this.props.price.minVariantPrice.currencyCode}).format(this.props.price.minVariantPrice.amount/100) : null}</div>
                </div>
            </div>
            <a style={{marginRight: "1%"}} href={this.props.url} target="_blank">More Details</a>
        </div>
    );
  }
  mouseOver = () => {
    if (!this.state.selected) {
        this.setState({ border: "1px solid" })
    }
  }
  mouseOut = () => {
    if (!this.state.selected) {
        this.setState({ border: "none" })
    }
  }
  unClicked = () => {
      this.setState({ selected: false, border: "none" })
  }
  clicked = () => {
    this.setState({ border: "2px solid", selected: true })
  }
}

 export default ProductBar;