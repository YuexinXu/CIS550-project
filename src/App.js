import React, { Component } from 'react';
import './App.css';
import {Layout, Menu} from "antd";
import Vaccinated from './Vaccinated';
import ICU from './ICU';
import Demo from './Demo';

const { Header, Content, Footer } = Layout;

class App extends Component {
    state = {
        current: 'vaccinated',
    };

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };

    render() {
        return (
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px' }}
                        onClick={this.handleClick}
                        selectedKeys={this.state.current}
                    >
                        <Menu.Item key="vaccinated"> Track COVID by state </Menu.Item>
                        <Menu.Item key="demographics"> Demographics </Menu.Item>
                        <Menu.Item key="icu"> ICU capacity by county </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                    {this.state.current === "vaccinated" && <Vaccinated />}
                    {this.state.current === "demographics" && <Demo />}
                    {this.state.current === "icu" && <ICU />}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    CIS550 Project by Yuexin Xu, Hui Miao, Xiaoyu Gong

                </Footer>
            </Layout>
        );
    }
}

export default App;
