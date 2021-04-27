import { Button, Select, Table, Typography } from 'antd';
import React, { Component } from 'react';


const { Title } = Typography;

class ICU extends Component {
    state = {
        states: [],
        selectedState: "Alaska",
        icuData: null
    };

    columns = [
      {
        title: 'State',
        dataIndex: 'State',
        key: 'State',
      },
      {
        title: 'County',
        dataIndex: 'County',
        key: 'County',
      },
      {
        title: 'ICU_Beds',
        dataIndex: 'ICU_Beds',
        key: 'ICU_Beds',
      },
    ];

    componentDidMount() {
        fetch('/states').then(res => res.json()).then(data => {
          this.setState({states: data.states});
        });
    };

    handleChange = (value) => {
        this.setState({selectedState: value})
    };

    getICUData = () => {
        fetch('/icu/' + this.state.selectedState).then(res => res.json()).then(data => {
          this.setState({icuData: data.ICU});
        });
    };

    render() {
        const { states, selectedState, icuData } = this.state;
        return (
            <>
            <Title>Select state: </Title>
            <Select defaultValue={selectedState} onChange={this.handleChange} >
                {states.map((item, index) => <Select.Option value={item} key={index}><Title level={3}>{item}</Title></Select.Option>)}
            </Select>
            <br />
            <br />
            <Button type="primary" size="Large" onClick={this.getICUData}>
            Go!
            </Button>
            <Table dataSource={icuData} columns={this.columns} />
            </>
        );
    }
}

export default ICU;
