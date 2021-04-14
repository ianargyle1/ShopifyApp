import React, { Component } from 'react';
import Router from 'next/router';
import { ResourceItem, Stack, Card, TextStyle, ResourceList, DisplayText, Button } from '@shopify/polaris';
import { MobilePlusMajorMonotone } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import CollectionCard from './components/collectionCard';
import store from 'store-js';
import ResourceListWithProducts from './components/ResourceList';
import Cookies from 'js-cookie';

class ManagePages extends Component {
  state = {
    modalActive: true,
    collections: [],
    data: 'No data',
    themeID: 'n/a'
  };
  collections = [];
  called = false;
  render() {
    return (
        <div>
            {this.getPages()}
            <div style={{display: 'flex', justifyContent: 'space-between', marginLeft: '2.5%', marginRight: '2.5%', marginTop: '3rem', marginBottom: '2rem'}}>
                <DisplayText size="medium">Custom product pages</DisplayText>
                <Button primary onClick={this.createNewPage}>
                    Add page
                </Button>
            </div>
            <hr style={{margin: 'auto', width: '95%'}}></hr>
            <div style={{margin: 'auto', width: '95%', paddingTop: '3rem'}}>
                <Card>
                    <ResourceList
                        resourceName={{singular: 'page', plural: 'pages'}}
                        selectable={true}
                        selectedItems={[]}
                        onSelectionChange={[]}
                        items={this.state.collections}
                        renderItem={(item) => {
                        const {id, url, name, numbero, datel} = item;

                        return (
                            <ResourceItem
                                id={id}
                                url={url}
                                accessibilityLabel={`Edit ${name}`}
                            >
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div>
                                        <h3 style={{marginBottom: '3px'}}>
                                            <TextStyle variation="strong">{name}</TextStyle>
                                        </h3>
                                        <TextStyle variation="subdued">{numbero}</TextStyle>
                                    </div>
                                    <div>
                                        <TextStyle variation="subdued">{datel}</TextStyle>
                                    </div>
                                </div>
                            </ResourceItem>
                        );
                        }}
                    />
                </Card>
            </div>
        </div>
    );
  }

  createNewPage = () => {
    Router.push('/newPage')
  }

  getPages = () => {
    if (!this.called) {
        this.called = true;
        var fetchUrl = "/api/themes";
        var method = "GET";
        fetch(fetchUrl, { method: method })
        .then(response => response.json())
        .then(json => json.data.themes.map(theme => ((theme.role == 'main') ? fetch("/api/themes/" + theme.id + "/assets", { method: method }).then(response => response.json()).then(json => this.setPages(json)) : void(0))))
    }
  }

  setPages = (json) => {
    console.log(json);
    json.data.assets.map(page => (page.key.startsWith("templates/page.CPB_") ? this.collections.push({ id: page.key, url: '/newPage/'+page.key, name: page.key.split('templates/page.CPB_')[1].split('.')[0], numbero: 'Last updated ' + this.parseDate(page.updated_at), datel: 'Created at ' + this.parseDate(page.created_at) }) : void(0)));
    this.setState({ collections: this.collections });
    console.log(this.state.collections);
  }

  parseDate = (uDate) => {
      var date = new Date(uDate);
      return date.toLocaleString();
  }

}

export default ManagePages;
