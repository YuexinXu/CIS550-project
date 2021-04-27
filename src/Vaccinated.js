import { Button, Select, Table, Typography } from 'antd';
import React, { Component } from 'react';
import './Vaccinated.css';
import { Line } from '@ant-design/charts';

const { Title } = Typography;

class Vaccinated extends Component {
    state = {
        states: [],
        dates: [],
        stateTrackData: [],
        selectedState: "Alaska",
        selectedDate: "2021-01-10",
        vaccinatedData: null
    };

    columns = [
      {
        title: 'location',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'cases',
        dataIndex: 'cases',
        key: 'cases',
      },
      {
        title: 'infection_rate',
        dataIndex: 'infection_rate',
        key: 'infection_rate',
      },
      {
        title: 'deaths',
        dataIndex: 'deaths',
        key: 'deaths',
      },
      {
        title: 'death_rate',
        dataIndex: 'death_rate',
        key: 'death_rate',
      },
      {
        title: 'vaccinated',
        dataIndex: 'vaccinated',
        key: 'vaccinated',
      },
      {
        title: 'vaccinated_rate',
        dataIndex: 'normalized_population',
        key: 'normalized_population',
      },
    ];

    componentDidMount() {
        fetch('/states').then(res => res.json()).then(data => {
          this.setState({states: data.states});
        });
        fetch('/date').then(res => res.json()).then(data => {
          this.setState({dates: data.dates});
        });
    };

    handleChange = (value) => {
        this.setState({selectedState: value})
    };

    handleDateChange = (value) => {
        this.setState({selectedDate: value})
    };

    getVaccinatedNum = () => {
        fetch('/vaccinated/' + this.state.selectedState + '/' + this.state.selectedDate).then(res => res.json()).then(data => {
          this.setState({vaccinatedData: data.vaccinated});
        });
        fetch('/state/' + this.state.selectedState).then(res => res.json()).then(data2 => {
          let stateData = data2.StateInfo;
          let transformed_data = [];
          for (const element of stateData) {
            transformed_data.push({Date: element.Date, Value: element.Cases, Category: "Cases"});
            transformed_data.push({Date: element.Date, Value: element.Deaths, Category: "Deaths"});
          }
          this.setState({stateTrackData: transformed_data});
        });
    }

    render() {
        const { states, dates, stateTrackData, selectedState, selectedDate, vaccinatedData } = this.state;
        const config1 = {
            data: stateTrackData,
            height: 600,
            xField: 'Date',
            yField: 'Value',
            yAxis: {label:null},
            seriesField: 'Category',
        }
        return (
            <>
            <Title>Select state and date: </Title>
            <Select defaultValue={selectedState} onChange={this.handleChange} >
                {states.map((item, index) => <Select.Option value={item} key={index}><Title level={3}>{item}</Title></Select.Option>)}
            </Select>
            <Select defaultValue={selectedDate} onChange={this.handleDateChange} >
                {dates.map((item, index) => <Select.Option value={item} key={index}><Title level={3}>{item}</Title></Select.Option>)}
            </Select>
            <br />
            <br />
            <Button type="primary" size="Large" onClick={this.getVaccinatedNum}>
            Go!
            </Button>
            <Table dataSource={vaccinatedData} columns={this.columns} />
            <Line {...config1} />
            </>
        );
    }
}

export default Vaccinated;
