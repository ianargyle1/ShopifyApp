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
        image {
            originalSrc
        }
      }
    }
  }
`;

class ResourceListWithProducts extends React.Component {
  render() {
    return (
      <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: this.props.ids }}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          return (
            <div>
              {this.props.updateHandles(data.nodes.map(collection => (collection.handle)))}
              {data.nodes.map(collection => (<CollectionCard key={collection.title} id={collection.title} image={(collection.image.originalSrc == null) ? '' : collection.image.originalSrc}/>))}
            </div>
          );
        }}
      </Query>
    );
  }
}

 export default ResourceListWithProducts;