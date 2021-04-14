import React, { Component } from 'react';
import ProductBar from './productBar';
import VarSelector from './varSelector';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_PRODUCTS_BY_ID = gql`
  query getProduct($ids: [ID!]!) {
    nodes(ids: $ids) {
      ...on Product {
        totalVariants
        hasOnlyDefaultVariant
        options {
          name
          values
        }
        variants(first: 250) {
          edges {
              node {
                title
                id
                price 
              }
          }
      }
      }
    }
  }
`;

class CollectionCard extends React.Component {
  state = { modalDisplay: 'none',
            selected: 'none',
            selectedUnClick: () => null,
            bodyDisplay: "block",
            selectDisplay: "none", 
            selectedDisplay: "none",
            selectedImage: null,
            selectedOptions: null,
            call: false
          }
  selectedID = "none";
  variants = {};
  selection = [];
  render() {
    return (
      <div>
        <div id={this.props.handle} onClick={() => this.showSelector()} style={{width: "100%", maxWidth: "30rem", cursor: "pointer", margin: "auto", marginTop: "2rem", borderStyle: "solid", borderColor: "#ebebeb", borderWidth: "1px", borderRadius: "3px"}}>
          <p style={{fontSize: "1.5em", fontWeight: "bold", marginLeft: "2.5%", marginBottom: ".5rem", marginTop: "1rem"}}>{this.props.id}</p>
          <hr style={{margin: "auto", width: "95%"}}></hr>
          <div style={{display: this.state.bodyDisplay}}>
            <img id="img" src={this.props.image} style={{display: "block", margin: "auto", marginTop: "1rem", width: "95%", borderRadius: "3px"}}></img>
            <p id="label" style={{textAlign: "center", fontSize: "1.5em", fontWeight: "100", marginTop: "1rem", marginBottom: "1rem"}}>+ Add {this.props.id}</p>
          </div>
          <div style={{display: this.state.selectedImage}}>
            <img id="img" src={this.props.image} style={{display: "block", margin: "auto", marginTop: "1rem", width: "95%", borderRadius: "3px"}}></img>
            <p id="label" style={{textAlign: "center", fontSize: "1.5em", fontWeight: "100", marginTop: "1rem", marginBottom: "1rem"}}>+ Add {this.props.id}</p>
          </div>
        </div>

        <div id="modalOverlay" style={{display: this.state.modalDisplay, top: "0", left: "0", position: "absolute", height: "100%", width: "100%", background: "rgba(0, 0, 0, 0.5)"}}>
          <div id="modalBox" style={{marginTop: "5vh", position: "absolute", left: "50%", transform: "translateX(-50%)", width: "90%", backgroundColor: "#ffffff", borderRadius: "5px"}}>
              <div id="modalHeader" style={{display: "flex", justifyContent: "space-between", width: "100%", backgroundColor: "#ffffff", borderBottom: "1px solid #ebebeb", marginBottom: ".5rem"}}>
              <div style={{fontSize: "1.5em", fontWeight: "bold", marginLeft: "2.5%", marginTop: "1rem"}}>Select a Product</div>
              <div class="closethething" onClick={() => this.closeModal()} style={{cursor: "pointer", fontSize: "2em", fontWeight: "bold", marginRight: "2.5%", marginTop: ".5rem"}}>&times;</div>
              </div>
              <div id="modal-content" style={{margin: "auto", width: "95%", top: "0", maxHeight: "40rem", overflow: "auto"}}>
                {(this.props.products) ? this.props.products.map(product => (<ProductBar handleClick={this.handleClick} title={product.node.title} id={product.node.id} image={product.node.featuredImage.originalSrc} price={product.node.priceRange} url={(product.node.onlineStoreUrl) ? product.node.onlineStoreUrl : (product.node.onlineStorePreviewUrl) ? product.node.onlineStorePreviewUrl : "#"}/>)) : void(0)}
              </div>
              <div id="sub">
                <div style={{width: "100%", borderTop: "1px solid #ebebeb"}}>
                  <div onClick={() => this.selectProduct()} id="submit{{handle}}" style={{marginRight: "2.5%", cursor: "pointer", float: "right", borderRadius: "5px", border: "1px solid", marginTop: "1rem", marginBottom: "1rem"}}>
                    <p style={{fontSize: "1.5rem", marginRight: ".8rem", marginLeft: ".8rem", marginTop: ".2rem", marginBottom: ".2rem"}}>Submit</p>
                  </div>
                </div>
              </div>
          </div>
        </div>


        <div style={{display: this.state.selectDisplay, top: "0", left: "0", position: "absolute", height: "100%", width: "100%", background: "rgba(0, 0, 0, 0.5)"}}>
          <div id="modalBox" style={{marginTop: "5vh", position: "absolute", left: "50%", transform: "translateX(-50%)", width: "90%", backgroundColor: "#ffffff", borderRadius: "5px"}}>
              <div id="modalHeader" style={{display: "flex", justifyContent: "space-between", width: "100%", backgroundColor: "#ffffff", borderBottom: "1px solid #ebebeb", marginBottom: ".5rem"}}>
              <div style={{fontSize: "1.5em", fontWeight: "bold", marginLeft: "2.5%", marginTop: "1rem"}}>Select a Variant</div>
              <div class="closethething" onClick={() => this.closeSelectModal()} style={{cursor: "pointer", fontSize: "2em", fontWeight: "bold", marginRight: "2.5%", marginTop: ".5rem"}}>&times;</div>
              </div>
              <div id="modal-content" style={{margin: "auto", width: "95%", top: "0", maxHeight: "40rem", overflow: "auto"}}>
                <img src={this.state.selectedImage} style={{borderRadius: "5px", width: "20rem"}}/>
                {(this.state.selectedOptions) ? this.state.selectedOptions.map(op => (<VarSelector title={op.name} options={op.values} handleSelection={this.handleSelection} />)) : void(0)}
              </div>
              <div id="sub">
                <div style={{width: "100%", borderTop: "1px solid #ebebeb"}}>
                  <div onClick={() => this.submitVar()} id="submit{{handle}}" style={{marginRight: "2.5%", cursor: "pointer", float: "right", borderRadius: "5px", border: "1px solid", marginTop: "1rem", marginBottom: "1rem"}}>
                    <p style={{fontSize: "1.5rem", marginRight: ".8rem", marginLeft: ".8rem", marginTop: ".2rem", marginBottom: ".2rem"}}>Submit</p>
                  </div>
                </div>
              </div>
          </div>
        </div>

        <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: this.state.selected }}>
            {({ data, loading, error }) => {
            if (loading) return <div>Loading…</div>;
            if (error) return <div>{error.message}</div>;
            return (
                <div>
                  {console.log(data)}
                  {(this.state.call) ? (!data.nodes[0].hasOnlyDefaultVariant) ? this.selectVars(data.nodes[0]) : this.setState({ call: false }) : void(0)}
                </div>
            );
            }}
        </Query>
      </div>
    );
  }
  showSelector = () => {
    this.setState({ modalDisplay: 'block'})
  }
  closeModal = () => {
    this.setState({ modalDisplay: 'none'})
  }
  closeSelectModal = () => {
    this.setState({ selectDisplay: 'none'})
  }
  handleClick = (clickFunc, unclickFunc, callerHandle, img) => {
    console.log(callerHandle)
    if (this.state.selected == callerHandle) {
      unclickFunc();
      this.setState({ selectedUnClick:  () => null, selectedImage: null });
      this.selectedID = "none";
    }
    else {
      clickFunc();
      this.state.selectedUnClick();
      this.setState({ selectedUnClick:  unclickFunc, selectedImage: img });
      this.selectedID = callerHandle;
    }
  }
  selectProduct = () => {
    this.setState({ selected: this.selectedID, call: true });
  }
  selectVars = (options) => {
    this.variants = {};
    options.variants.edges.map(op => (this.variants[op.node.title] = op.node.price));
    this.selection = [];
    for (var i = 0; i < options.options.length; i++) {
      var curName = options.options[i].name;
      var curVal = options.options[i].values[0];
      var s = {};
      s[curName] = curVal;
      this.selection.push(s);
    }
    this.setState({ modalDisplay: 'none', selectDisplay: 'block', call: false, selectedOptions: options.options });
  }
  handleSelection = (selector, val) => {
    for (var i = 0; i < this.selection.length; i++) {
      for (const [key, value] of Object.entries(this.selection[i])) {
        if (key == selector) {
          this.selection[i][key] = val;
        }
      }
    }
  }
  setProduct = () => {
    this.setState({ call: false })
  }
  submitVar = () => {
    var opString = "";
    for (var i = 0; i < this.selection.length; i++) {
      for (const [key, value] of Object.entries(this.selection[i])) {
        if (i == 0) {
          opString += value
        }
        else {
          opString += " / " + value;
        }
      }
    }
    console.log(opString);
  }
}

export default CollectionCard;
