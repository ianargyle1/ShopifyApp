import React, { Component } from 'react';
import { Icon } from '@shopify/polaris';
import { DragHandleMinor } from '@shopify/polaris-icons';


class CollectionSideBar extends React.Component {
  state = { dragColor: 'ink', border: '4px solid white' }
  render() {
    return (
        <div>
            <div onMouseEnter={() => this.mouseEnter()} onMouseLeave={() => this.mouseOut()} onClick={() => this.props.clickHandler(this.props.title)} style={{background: '#ffffff', borderTop: '1px solid #dfe3e8', borderBottom: '1px solid #dfe3e8', borderRight: this.state.border, minWidth: '16vw'}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '1rem', marginTop: '1rem'}}>
                    <p style={{marginLeft: '0.5rem', marginright: '0.5rem', textOverflow: 'ellipsis'}}>{this.props.title}</p>
                    <div style={{margin: '1px'}}>
                        <Icon onMouseEnter={() => this.iconEnter()} onMouseLeave={() => this.iconOut()} source={DragHandleMinor} color={this.state.dragColor} />
                    </div>
                </div>
            </div>
        </div>
    );
  }
  mouseEnter = () => {
    this.setState({ border: '4px solid #5c6ac4' })
  }
  mouseOut = () => {
    this.setState({ border: '4px solid white' })
  }
  iconEnter = () => {
    this.setState({ dragColor: 'indigo' })
  }
  iconOut = () => {
    this.setState({ dragColor: 'ink' })
  }
  handleClick = () => {
    console.log("clicked")
  }
}

 export default CollectionSideBar;