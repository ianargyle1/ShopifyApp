import React, { Component } from 'react';

class Counter extends Component {
  state = {
    count: 0,
  };
  render() {
    return (
      <React.Fragment>
        <span className={this.getBadgeClasses()}>{this.state.count === 0 ? "Zero" : this.state.count}</span>
        <span className="btn btn-secondary btn-sm" onClick={this.incCount}>+</span>
        <span className="btn btn-secondary btn-sm m-2" onClick={this.decCount}>-</span>
      </React.Fragment>
    );
  }

  incCount = () => {
    console.log("clo");
    this.setState({ count: this.state.count + 1 });
  }

  decCount = () => {
    if (this.state.count > 0) {
      this.setState({ count: this.state.count - 1 });
    }
  }

  getBadgeClasses() {
    let classes = "badge m-2 badge-";
    classes += this.state.count === 0 ? "warning" : "primary";
    return classes;
  }
}

export default Counter;
