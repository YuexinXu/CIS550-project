import { Select, Table, Typography } from 'antd';
import React, { Component } from 'react';


const { Title } = Typography;

class Demo extends Component {
    state = {
        demoData: null
    };

    columns = [
      {
        title: 'State',
        dataIndex: 'State',
        key: 'State',
      },
      {
        title: 'infection_rate',
        dataIndex: 'infection_rate',
        key: 'infection_rate',
      },
      {
        title: 'Asian',
        dataIndex: 'Asian',
        key: 'Asian',
      },
      {
        title: 'Black',
        dataIndex: 'Black',
        key: 'Black',
      },
      {
        title: 'Hispanic',
        dataIndex: 'Hispanic',
        key: 'Hispanic',
      },
      {
        title: 'White',
        dataIndex: 'White',
        key: 'White',
      },
      {
        title: 'Unemployment_rate',
        dataIndex: 'Unemployment_rate',
        key: 'Unemployment_rate',
      },
      {
        title: 'Avg_Income',
        dataIndex: 'Avg_Income',
        key: 'Avg_Income',
      },
    ];

    componentDidMount() {
        fetch('/demographic').then(res => res.json()).then(data => {
          this.setState({demoData: data.demo});
        });
    };

    render() {
        const { demoData } = this.state;
        return (
            <>
            <Table dataSource={demoData} columns={this.columns} />
            </>
        );
    }
}

export default Demo;
