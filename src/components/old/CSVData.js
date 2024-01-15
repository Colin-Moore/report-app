import React, { Component } from "react";
import withRouter from "../withRouter";
import axios from "axios";
import CSVDataTable from "./CSVDataTable";
class CSVData extends Component{
    constructor(){
        super();
        this.state = {  report_params: [],
                        title: "Report",
                        date: "",
                        csvData: [],
                        folder: "",
                        filename: "",
                        divided: false,
                        dividers: [],
                        perPage: 50 };
        this.changePerPage = this.changePerPage.bind(this);
    }
    

    componentDidMount() {
        const FOLDER = this.props.params.folder;
        const FILENAME = this.props.params.filename;

        this.setState({ folder: FOLDER, filename: FILENAME});
       
        axios.get(`http://localhost:4444/${FOLDER}/${FILENAME}`).then(res => {
            this.parseCSV(res.data);
            console.log(res.data)
        }).catch(function(err) {
            alert(err);
        });
    }    

    changePerPage = (e) => {
        this.setState({perPage: e.target.value})
    }


    parseCSV = (csvText) => {
        this.setState({title: csvText.title[0]});
        this.setState({date: csvText.date[0]});
        this.setState({report_params: csvText.parameters[0]});
        this.setState({dividers: csvText.divider});
        this.setState({data: csvText.data});

        const dividers = csvText.divider;
        const data = csvText.data;
        const parsedData = [];

        if(dividers.length > 0){
            const divider = dividers[0].filter(value => value.length > 2);
            if(divider.length > 0){
                this.setState({dividers: divider})
            }
        }
        const headers = data[0];
        
        for (let i = 1; i < data.length; i++) {
            const currentLine = data[i];
        
            if (currentLine.length === headers.length) {
                const row = {};
                for (let j = 0; j < headers.length; j++) {
                    row[headers[j]] = currentLine[j].replace(/['"]+/g, '');
                }
                parsedData.push(row);
            }
        }
        
        this.setState({csvData: parsedData });
    };

    render(){
        return(
            <div>
                <button>Printer Friendly</button>
                <div className="report_header_child" style={report_title}>
                    <div style={title}>
                        <h1>{this.state.title}</h1>
                    </div>
                    <div style={date}>
                        <h3>{this.state.date}</h3>
                    </div>
                </div>
                <div style={report_area}>
                    <div className="report_header_child" style={parent}>
                        {this.state.report_params.map((value, index) => (
                            <p key={index} style={child} >{value}</p>
                        ))}
                    </div>
                    <CSVDataTable  divider = {this.state.dividers}
                                   data={this.state.csvData}
                                   rowsPerPage={this.state.perPage} />
                </div>
                <label for="perpage">Results Per Page: </label>
                <select id="perpage" onChange={ this.changePerPage}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={40}>40</option>
                    <option value={50}>50</option>
                </select>
            </div>
        );
    }
};

export default withRouter(CSVData);

const report_title = {
    width:"70%",
    marginRight: "auto",
    marginLeft: "auto"
}

const title = {
    width: "60%",
    textAlign: "left",
    display: "inline-block"
}
const date = {
    width: "40%",
    display: "inline-block",
    textAlign: "right"
}

const report_area = {
    width: "100%",
}
const parent = {
    border: "0.5px solid #DEDEDE",
    borderRadius: "10px",
    marginBottom: "20px",
    width: "80%",
    marginRight: "auto",
    marginLeft: "auto",
}

const child = {
    display: "inline-block",
    paddingLeft: "40px"
}

// .replace(/['"]+/g, '')