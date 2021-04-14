import React, { Component } from 'react';
import Router from 'next/router';
import { Icon, Stack, Card, Modal, TextContainer, DisplayText, Button } from '@shopify/polaris';
import { MobilePlusMajorMonotone,  MobileBackArrowMajorMonotone, DragHandleMinor, DesktopMajorMonotone, MobileMajorMonotone } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import CollectionCard from './components/collectionCard';
import CustomPage from './components/customPage';
import store from 'store-js';
import ResourceListWithProducts from './components/ResourceList';
import Cookies from 'js-cookie';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import CollectionSideBar from './components/collectionSideBar';
import DragSortableList from 'react-drag-sortable';

class Counter extends Component {
  state = {
    modalActive: true,
    collections: [],
    data: 'No data',
    themeID: 'n/a',
    mBorder: '4px solid white',
    dBorder: '4px solid #5c6ac4',
    dSelected: true,
    mSelected: false,
    vWidth: '85%',
    dragBar: 'bock',
    customBar: 'none',
    s: 'a'
  };

  placeholder = (
    <div>
      <div style={{background: '#f9fafb'}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '0.5rem', marginTop: '0.5rem'}}>
              <p style={{marginLeft: '0.2rem', opacity: '0'}}>a</p>
              <div style={{margin: '1px', opacity: '0'}}>
                  <Icon source={DragHandleMinor} />
              </div>
          </div>
      </div>
    </div>
  );

  collectionHandles = [];
  collectionTitles = [];
  called = false;

  render() {
    return (
        <div>
          {this.getPage()}
          <div class="container-fluid" style={{width: '100%'}}>
            <div class="row no-gutters" style={{background: '#f9fafb', borderRightStyle: 'solid', borderBottomStyle: 'solid', borderWidth: '1px', borderColor: '#dfe3e8'}}>
              <div class="col-2">
                <div style={{display: 'flex', borderRightStyle: 'solid', borderWidth: '1px', borderColor: '#dfe3e8', display: 'flex', alignItems: 'center', height: '100%'}}>
                  <div style={{marginLeft: '1.5rem', marginRight: '1rem', cursor: 'pointer'}}>
                    <Icon source={MobileBackArrowMajorMonotone} />
                  </div>
                  <div>
                    <DisplayText size="small">Example Page</DisplayText>
                  </div>
                </div>
              </div>
              <div class="col-10">
                <div style={{background: '#ffffff', display: "flex", justifyContent: "space-between", alignItems: 'center', height: '100%'}}>
                  <p style={{opacity: '0'}}>a</p>
                  <Stack distribution="trailing">
                    <div onClick={() => this.dClick()} onMouseEnter={() => this.dMouseEnter()} onMouseLeave={() => this.dMouseOut()} style={{paddingBottom: '0.5rem', cursor: 'pointer', borderBottom: this.state.dBorder}}>
                      <Icon source={DesktopMajorMonotone} />
                    </div>
                    <div onClick={() => this.mClick()} onMouseEnter={() => this.mMouseEnter()} onMouseLeave={() => this.mMouseOut()} style={{paddingBottom: '0.5rem', cursor: 'pointer', borderBottom: this.state.mBorder}}>
                      <Icon source={MobileMajorMonotone} />
                    </div>
                  </Stack>
                  <div className="p-3">
                    <Stack distribution="trailing">
                      <Button>
                        Save
                      </Button>
                      <Button primary onClick={() => this.createCode()}>
                        Publish
                      </Button>
                    </Stack>
                  </div>
                </div>
              </div>
            </div>
            <div class="row no-gutters">
                <div class="col-2" style={{display: this.state.dragBar, background: '#f9fafb', height: '100vh', borderRightStyle: 'solid', borderBottomStyle: 'solid', borderWidth: '1px', borderColor: '#dfe3e8'}}>
                  <DragSortableList items={this.collectionTitles} onSort={(a, b) => this.onSort(a, b)} placeholder={this.placeholder} dropBackTransitionDuration={0.3} type="vertical"/>
                </div>
                <div class="col-2" style={{display: this.state.customBar, background: '#f9fafb', height: '100vh', borderRightStyle: 'solid', borderBottomStyle: 'solid', borderWidth: '1px', borderColor: '#dfe3e8'}}>
                  <p>{this.state.s}</p>
                </div>
                <div className="col-10">
                  <div className="card" style={{margin: 'auto', width: this.state.vWidth, marginBottom: '3rem', marginTop: '3rem', height: '87vh', overflow: 'scroll'}}>
                    <CustomPage ids={this.state.collections} updateHandles={this.updateHandles}/>
                  </div>
                </div>
            </div>
          </div>

          <ResourcePicker
              resourceType="Collection"
              showVariants={false}
              open={this.state.modalActive}
              onSelection={(resources) => this.handleSelection(resources)}
              onCancel={() => this.setState({ modalActive: false })}
          />

        </div>
    );
  }
  getPage = () => {
    var id = window.location.pathname.split('/')[1];
    if (!this.called && id) {
        this.called = true;
        var fetchUrl = "/api/pages/" + id;
        var method = "GET";
        fetch(fetchUrl, { method: method })
        .then(response => response.json())
        .then(json => console.log(json))
    }
  }
  dMouseEnter = () => {
    // this.setState({ dBorder: '4px solid #5c6ac4' });
  }
  dMouseOut = () => {
    // this.setState({ dBorder: '4px solid white' });
  }
  mMouseEnter = () => {
    // this.setState({ mBorder: '4px solid #5c6ac4' });
  }
  mMouseEnter = () => {
    // this.setState({ mBorder: '4px solid white' });
  }
  dClick = () => {
    if (!this.state.dSelected) {
      this.setState({ dBorder: '4px solid #5c6ac4', mBorder: '4px solid white', mSelected: false, dSelected: true, vWidth: '85%' });
    }
  }
  mClick = () => {
    if (!this.state.mSelected) {
      this.setState({ mBorder: '4px solid #5c6ac4', dBorder: '4px solid white', dSelected: false, mSelected: true, vWidth: '30%' });
    }
  }
  onSort = (sortedList, dropEvent) => {
    var newCollections = [];
    sortedList.map(item => (newCollections.push(item.content.props.id)));
    this.collectionTitles = sortedList;
    this.setState({ collections: newCollections });
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    var colTemp = this.state.collections.concat(idsFromResources);
    console.log(colTemp.toString())
    this.collectionTitles = resources.selection.map((product) => ({content: (<CollectionSideBar title={product.title} id={product.id} clickHandler={this.handleSideClick} />)}));
    this.setState({ modalActive: false, collections: colTemp });
    this.forceUpdate();
  }

  handleSideClick = (item) => {
    this.setState({ dragBar: 'none', customBar: 'block', s: item })
  }

  addProductCompnent = () => {
    this.setState({ modalActive: (this.state.modalActive) ? false : true})
  }

  updateHandles = (handles) => {
    this.collectionHandles = handles;
  }

  getThemeID = () => {
    var fetchUrl = "/api/themes";
    var method = "GET";
    fetch(fetchUrl, { method: method })
    .then(response => response.json())
    .then(json => this.setState({ themeID: json.data.themes.map(theme => ((theme.role == 'main') ? theme.id : this.state.themeID))}))
  }

  createPage = () => {
    var fetchUrl = "/api/pages";
    var method = "POST";
    fetch(fetchUrl, { method: method })
    .then(response => response.json())
    .then(json => console.log(json))
  }

  createCode = () => {
    var code = `{% assign collects = "${this.collectionHandles.toString()}" | split: ','%}<div style="margin: auto; width: 70%; margin-bottom: 3rem"><p style="font-size: 1.5em; margin-bottom: 1rem">Your Total: $0</p><hr style="padding-top: 0px; margin-top: 0px; margin-bottom: 0px"></hr>{% for handle in collects %}<div style="width: 100%; max-width: 30rem; cursor: pointer; margin: auto; margin-top: 2rem; border-style: solid; border-color: #ebebeb; border-width: 1px; border-radius: 3px"><p style="font-size: 1.5em; font-weight: bold; margin-left: 2.5%; margin-bottom: .5rem; margin-top: 1rem">{{collections[handle].title}}</p><hr style="margin: auto; width: 95%"></hr><img src={{ collections[handle] | img_url: 'master' }} style="display: block; margin: auto; margin-top: 1rem; width: 95%"></img><p style="text-align: center; font-size: 1.5em; font-weight: 100; margin-top: 1rem; margin-bottom: 1rem">+ Add {{collections[handle].title}}</p></div>{% endfor %}</div>`;
    var fetchUrl = "/api/assets";
    fetch(fetchUrl, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'pagekey': 'templates/page.test123.liquid',
        'pagevalue': code
      }
    })
    .then(response => response.json())
    .then(json => console.log(json))
    var fetchUrl = "/api/pages/test123";
    var method = "POST";
    fetch(fetchUrl, { method: method })
    .then(response => response.json())
    .then(json => console.log(json))
  }

}

export default Counter;
