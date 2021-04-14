import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Card } from '@shopify/polaris';
import store from 'store-js';
import CollectionCard from './collectionCard';

const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Collection {
        title
        handle
        products(first: 250) {
            edges {
                node {
                    id
                    handle
                    title
                    onlineStoreUrl
                    onlineStorePreviewUrl
                    priceRange {
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    featuredImage {
                        originalSrc
                    }
                }
            }
        }
        image {
            originalSrc
        }
      }
    }
  }
`;

class CustomPage extends React.Component {
    state = { }
  render() {
    return (
        <div>
            <div id="errorBar" style={{margin: 'auto', width: '70%', display: 'none', marginTop:'2rem'}}></div>
            <div style={{margin:"auto",width:"70%",marginBottom:"3rem", marginTop: '2rem'}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display: 'flex'}}>
                        <p style={{float:"left",fontSize:"1.5em",marginBottom:"1rem"}}>Your Total: $</p>
                        <div style={{fontSize:"1.5em",marginBottom:"1rem",float:"left"}} id="totalprice">0</div>
                    </div>
                    <div id="addToCart" style={{cursor:"pointer",borderRadius:"5px",border:"1px solid",marginBottom:".5rem"}}>
                        <p style={{fontSize:"1.5rem",marginRight:".8rem",marginLeft:".8rem",marginTop:".2rem",marginBottom:".2rem"}}>Add to Cart</p>
                    </div>
                        </div>
                <hr style={{paddingTop:"0px",marginTop:"0px",marginBottom:"0px"}}></hr>
                <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: this.props.ids }}>
                    {({ data, loading, error }) => {
                    if (loading) return <div>Loading…</div>;
                    if (error) return <div>{error.message}</div>;
                    return (
                        <div>
                        {this.props.updateHandles(data.nodes.map(collection => (collection.handle)))}
                        {data.nodes.map(collection => (<CollectionCard key={collection.title} id={collection.title} handle={collection.handle} products={collection.products.edges} show={this.showSelector} image={(collection.image == null) ? '' : collection.image.originalSrc}/>))}
                        </div>
                    );
                    }}
                </Query>
            </div>
        </div>
    );
  }
}

export default CustomPage;