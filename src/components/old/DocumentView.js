


import React, { Component } from "react";
import axios from "axios";
import withRouter from "../withRouter";
import EnhancedReportTable from "./EnhancedReportTable";
import CSVDataTable from "./CSVDataTable";
import { Link } from "react-router-dom";
import DocumentView from "./DocumentView";

class EnhancedReport extends Component{
    constructor(){
        super();
        this.state = {
            title: "title",
            date: "",
            headers: [],
            parameters: [''],
            dividers: [''],
            total: [''],
            sections: [],
            csvData: [],
            hasSubsections: false,
            report:  {key: [] || null,
            value: [] || null,
            subsections: []}
        }
    }


    componentDidMount = async() => {
        const FOLDER = this.props.params.folder;
        const FILENAME = this.props.params.filename;

        this.setState({ folder: FOLDER, filename: FILENAME});
        const csvData = [];
         await axios.get(`http://localhost:4444/test/${FOLDER}/${FILENAME}`).then(res => {
            csvData.push(res.data)
            // console.log(res.data)
        }).then(() => {
          this.parseCSV(csvData[0])
        }).catch(function(err) {
            alert(err);
        });
    }
       
    toggleSection = (sectionIndex) => {
        const { expandedSections } = this.state;

        if (expandedSections.includes(sectionIndex)) {
            this.setState({
                expandedSections: expandedSections.filter(index => index !== sectionIndex),
            });
        } else {
            this.setState({
                expandedSections: [...expandedSections, sectionIndex],
            });
        }
    }
    // subsection.value.forEach(line => {
    //     if (line.length === headers.length) {
    //         const row = {};
    //         headers.forEach((header, index) => {
    //             row[header] = line[index].replace(/['"]+/g, '');
    //         });
    //         sectionlist.data.push(row);
    //         console.log(row)
    //     }
    // });

    // buildReport(data, headers) {
        
    //     const report = {
    //       name: [],
    //       value: [] || null,
    //       subsections: []
    //     };
    //     // console.log(data.key)
    //     if(data.key !== "head"){
    //     data.key.forEach(line => {
    //         // console.log(line.length)
    //             if(line.length === headers.length){
    //                 const row = {};
    //                 headers.forEach((header, index) => {
    //                     row[header] = line[index];
    //                 });
    //                 report.name.push(row);
    //             }
    //         })
    //     }
    //         data.value.forEach(line => {
    //             // console.log(line)
    //             if(line.length === headers.length){
    //                 const row = {};
    //                 headers.forEach((header, index) => {
    //                     row[header] = line[index];
    //                 });
    //                 report.value.push(row);
    //             }
    //         })
        
    //     if (data.subsections.length > 0) {
    //       data.subsections.forEach((subsection) => {
    //         report.subsections.push(this.buildReport(subsection, headers));
    //       });
    //     }
      
    //     return report;
    //   };

    parseCSV(csvText) {
        const sections = csvText.sections;
        this.setState({csvData: csvText});
        const title = csvText.title;
        const date = csvText.date;
        const headers = csvText.header[0];
        this.setState({headers: headers});
        const divider = []
        const parameters = [];
        headers.push();
        parameters.push(csvText.parameters[0]);
        divider.push(csvText.divider[0])
    
        this.setState({ title: title,
                        date: date,
                        parameters: parameters[0],
                        dividers: divider,
                        headers: csvText.header,
                        sections: csvText.sections
                    });
        if(divider.length > 0 && divider[0] !== undefined){
            const dividers = divider[0].filter(value => value.length > 2);
            if(dividers.length > 0){
                this.setState({dividers: dividers})
            }
        }
        
        let report = this.buildReport(sections, headers);
        this.setState({report: report});
        if(this.state.report.subsections){
        console.log(this.state.report)
    }
}

    buildReport = (data, headers) => {
        const report = {
          key: [] || null,
          value: [] || null,
          subsections: []
        };
        if(data){
            // if (data.key !== "head") {
            data.key.forEach((line) => {
                if (line.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = line[index];
                });
                report.key.push(row);
                }
            });
            // }
        
            data.value.forEach((line) => {
            if (line.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                row[header] = line[index];
                });
                report.value.push(row);
            }
            });
        
            if (data.subsections.length > 0) {
            data.subsections.forEach((subsection) => {
                report.subsections.push(this.buildReport(subsection, headers));
            });
            }
        }
        return report;
      };
    
      renderTable = (data) => {
        // if (!data || (!data.key.length && !data.value.length && !data.subsections.length)) {
        //   alert('hey')
        //     return null;
        // })
        console.log(data)
      }
    //     if(data){
     
    //         return (
    //         <table>
    //             <thead>
    //             <tr>
    //                 {Object.keys(data.subsections[0].key || {}).map((header, index) => (
    //                 <th key={index}>{header}</th>
    //                 ))}
    //             </tr>
    //             </thead>
    //             <tbody>
    //             {data.key.map((row, rowIndex) => (
    //                 <tr key={rowIndex}>
    //                 {Object.values(row).map((cell, cellIndex) => (
    //                     <td key={cellIndex}>{cell}</td>
    //                 ))}
    //                 </tr>
    //             ))}
    //             </tbody>
    //         </table>
    //         );
    //     }
    //   };
    
    //   render() {
    //     const { data, headers } = this.props;
    //     const reportData = this.buildReport(data, headers);
    
    //     return (
    //       <div>
    //         {this.renderTable(reportData)}
    //       </div>
    //     );
    //   }

   render(){
    return(
        <div>
            <Link to="/printerfriendly" 
            state={{ title:this.state.title,
                     parameters: this.state.parameters,
                     divider:this.state.dividers,
                     data:this.state.csvData,
                     date:this.state.date,
                     grandtotal:this.state.total 
                }}>
                Printer Friendly
            </Link>
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
                    {this.state.parameters.map((value, index) => (
                        <p key={index} style={child}>{value}</p>
                    ))}
                </div>
                {this.renderTable(this.state.report)}
                {/* <EnhancedReportTable  divider = {this.state.dividers}
                                       headers = {this.state.headers}
                                       data={this.state.report}
                                       grandtotal={this.state.total} />       */}
                
            </div>
        </div>
        );
    }
};

export default withRouter(EnhancedReport);

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
    paddingLeft: "30px"
}

  
/*
 sections.subsections.map(currentSection => {
            // console.log(currentSection)
            if (currentSection.subsections.length > 0) {
                this.setState({hasSubsections: true})
                const sectionObject = {
                    title: currentSection.key,
                    total: [],
                    subsection: currentSection.subsections.map(subsection => {
                        const sectionlist = {
                            name: subsection.key,
                            total: [],
                            data: [],
                            subsections: []
                        };
                        // subsection.value.forEach(currentData => {
                            subsection.value.forEach(line => {
                                if (line.length === headers.length) {
                                    const row = {};
                                    headers.forEach((header, index) => {
                                        row[header] = line[index].replace(/['"]+/g, '');
                                    });
                                    sectionlist.data.push(row);
                                    console.log(row)
                                }
                            });
                        // });

                        // subsection.subsectiontotal.forEach(currentData => {
                        //     currentData.forEach(line => {
                        //         if (line.length === headers.length) {
                        //             const row = {};
                        //             headers.forEach((header, index) => {
                        //                 row[header] = line[index].replace(/['"]+/g, '');
                        //             });
                        //             sectionlist.total.push(row);
                        //         }
                        //     });
                        // });
                        // console.log(sectionlist)

                        return sectionlist;
                    })
                };
                // if(currentSection.total[0] !== undefined){
                // const sectotal = currentSection.total[0];
                // const totrow = {};
                // headers.forEach((header, i) => {
                //     totrow[header] = sectotal[i];
                // })
                // sectionObject.total.push(totrow);
                // }
                report.push(sectionObject);
            }
            else{
                // const sectionlist = {
                //     name: currentSection.name[0],
                //     total: [],
                //     data: []
                // };

                // currentSection.data.forEach(currentData => {
                //     currentData.forEach(line => {
                //         if (line.length === headers.length) {
                //             const row = {};
                //             headers.forEach((header, index) => {
                //                 row[header] = line[index].replace(/['"]+/g, '');
                //             });
                //             sectionlist.data.push(row);
                //         }
                //     });
                // });
                // const totalRow = {}
                // headers.forEach((header, index) => {
                //     totalRow[header] = currentSection.total[0][index].replace(/['"]+/g, '');
                // });
                // sectionlist.total.push(totalRow);
                // report.push(sectionlist)
                // return sectionlist;

            }
        });
        // console.log(report)

  */