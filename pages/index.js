import { EmptyState, Layout, Page } from '@shopify/polaris';
import Router from 'next/router'
import React, { Component } from 'react';

class Index extends Component {
  state = {
    count: 0,
  };
  render() {
    return (
      <EmptyState
      heading="Manage your custom product pages"
      action={{content: 'Create a page', onClick: this.incCount}}
      image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
    >
      <p>Get started with your new custom product page by clicking below.</p>
    </EmptyState>
    );
  }

  incCount = () => {
    Router.push('/managePages')
  }
}

export default Index;