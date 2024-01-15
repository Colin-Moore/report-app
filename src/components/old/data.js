import React, { Component } from "react";
import axios from "axios";
import withRouter from "../withRouter";
import EnhancedReportTable from "./EnhancedReportTable";

class EnhancedReport extends Component {
  constructor() {
    super();

    this.state = {
      title: "Report",
      date: "",
      headers: [],
      parameters: [],
      total: [],
      sections: [],
      dividers: [],
      csvData: [],
      report: [],
      isLoading: true,
      expandedSections: []
    };
  }
  componentDidMount () {
    const FOLDER = this.props.params.folder;
    const FILENAME = this.props.params.filename;

    this.setState({ folder: FOLDER, filename: FILENAME});
   
    axios.get(`http://localhost:4444/test/${FOLDER}/${FILENAME}`).then(res => {
        this.parseCSV(res.data);
        // console.log(res.data)
        // setTimeout(() => {
          this.setState({ isLoading: false });
        // }, 2000);
    }).catch(function(err) {
        alert(err);
    });
}    

  parseCSV = (csvText) => {
    const report = this.buildReport(csvText.sections, this.state.headers);
    // setReport(report); 
    const reportSections = [];
    report.subsections.forEach(sec => {
      reportSections.push(sec);
    })
    this.setState({report: reportSections})

    const divider = []
    const parameters = [];
    this.setState({title: csvText.title});
    this.setState({date: csvText.date});
    this.setState({headers: csvText.header[0]});
    // console.log(csvText)
    // console.log(this.state.headers)
    this.setState({parameters: csvText.parameters[0]})
    divider.push(csvText.divider[0]) 

    if(divider.length > 0 && divider[0] !== undefined){
        const dividers = divider[0].filter(value => value.length > 2);
        if(dividers.length > 0){
            this.setState({divider: dividers});
        }
    }
    // console.log(this.state.report)
  };
  
  buildReport = (data, headers) => {
    const report = {
        key: [],
        value: [], 
        total: [],
        subsections: []
      };
        data.key?.forEach((line) => {
          // console.log(line)

            if (line.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header] = line[index];
            });
            // console.log(row)
            report.key.push(row);
            }    
        }); 
         
        data.value?.forEach((line) => {
        line.forEach((val) => {
          
            if (val.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                  row[header] = val[index];
                });
                report.value.push(row);
            }})   
        });
           
        data.total?.forEach((line) => {
            line.forEach((val) => {
                if (val.length === headers.length) {
                    const row = {};
                    headers.forEach((header, index) => {
                    row[header] = val[index];
                    });
                    report.total.push(row);    
                }}) 
            });

        data.subsections?.forEach((subsection) => {
            report.subsections.push(this.buildReport(subsection, headers));
        });
      return report; 
    }
  
    toggleSection = (sectionIndex) => {
      // if (expandedSections.includes(sectionIndex)) {
      //   setExpandedSections(expandedSections.filter(index => index !== sectionIndex));
      // } else {
      //   setExpandedSections([...expandedSections, sectionIndex]);
      // }
    };

    renderTableRow = (rowData, index, rowType) => {
      if(rowType === "total"){
        return (
          <tr key={index}>
            {this.state.headers.map((header, i) => (
              header.length > 0 ? 
              <td key={i}  style={i > 0 ? totalLineDetail : totalLineDesc}>{rowData?.[header]}</td>
              : null
              ))}
          </tr>
        );
      }
      if(rowType === "key"){
        let values = Object.values(rowData).toString();
        let key = values.substring(0, 5)
        return (
          <tr onClick={() => this.toggleSection(key)} key={index} >
            {this.state.headers.map((header, i) => (
              header.length > 0 ? 
              <td key={i} style={boldStyle}>{rowData?.[header]}</td>
              : null
              ))} 
          </tr>
        );
      }
      else{
        return (
          <tr key={index}>
            {this.state.headers.map((header, i) => (
              header.length > 0 ?
              <td key={i} style={i> 0 ? tableCellStyle : descriptionColumn}>{rowData?.[header]}</td>
              : null
              ))}
          </tr>
        );
      }
    }; 

    renderSubsections = (subsections, parentKey = '') => {
      return (
        <>
          {subsections.map((subsection, index) => {
            const sectionKey = Object.values(subsection.key[0]).toString().substring(0, 5);
            return (
              <React.Fragment key={`${parentKey}-${sectionKey}`}>
                <tr>
                  {this.renderTableRow(subsection.key[0], index, 'key')}
                </tr>
                {this.state.expandedSections.includes(sectionKey) &&
                  subsection.value && subsection.value.length > 0 && (
                    this.renderValueRows(subsection)
                  )}
                {this.state.expandedSections.includes(sectionKey) &&
                  subsection.subsections && subsection.subsections.length > 0 && (
                    this.renderSubsections(subsection.subsections, sectionKey)
                )}
                {subsection.total && subsection.total.length > 0 && (
                  subsection.total.map((row, rowIndex) => (
                    this.renderTableRow(row, rowIndex, 'total')
                  ))
                )}
              </React.Fragment>
            );
          })} 
        </>
      );
    };
  
    renderReportSection = (reportData, parentKey = '') => {
      console.log(JSON.stringify(reportData, null, 2))
      return (
        <>
          {reportData.map((row, index) => {
            const sectionKey = Object.values(row.key[0]).toString().substring(0, 5);
            return (
              <React.Fragment key={`${parentKey}-${sectionKey}`}>
                {this.renderTableRow(row.key[0], index, 'key')}
                {this.state.expandedSections.includes(sectionKey) &&
                  row.subsections && row.subsections.length > 0 && (
                    this.renderSubsections(row.subsections, sectionKey)
                  )}
              </React.Fragment>
            );
          })}
        </>
      );
    };
  
    renderValueRows = (key) => {
      const valueRows = key.value;
      return (
        <>
          {valueRows.map((row, index) => (
            this.renderTableRow(row, index, "value")
          ))}
        </>
      );
    };


    renderReport(){
    }

  render() {
    const { isLoading, title, date, parameters, headers, report } = this.state;

      return (
       
    <div> 
      {isLoading ? ( 
        <p>Loading...</p> 
      ) : (
    <>
    {console.log(report)}
      <div className="report_header_child" style={report_title}>
                    <div style={reportTitle}>
                        <h1>{title}</h1>
                    </div>
                    <div style={reportDate}>
                        <h3>{date}</h3>
                    </div>
                </div>
                <div style={report_area}>
                    <div className="report_header_child" style={parent}>
                        {parameters.map((value, index) => (
                            <p key={index} style={child} >{value}</p>
                        ))}
                    </div>
      <div style={report_area}>
        <div >
            {/* <EnhancedReportTable report={this.state.report} headers={this.state.headers} /> */}
        </div>
      </div>
    </div>
    </>
      )}
    </div>
  );
  } 
}
 
export default withRouter(EnhancedReport);
const report_title = {
  width: "70%",
  marginRight: "auto",
  marginLeft: "auto"
};

const reportTitle = {
  width: "60%",
  textAlign: "left",
  display: "inline-block"
};
const reportDate = {
  width: "40%",
  display: "inline-block",
  textAlign: "right"
};

const report_area = {
  width: "100%"
};
const parent = {
  border: "0.5px solid #DEDEDE",
  borderRadius: "10px",
  marginBottom: "20px",
  width: "80%",
  marginRight: "auto",
  marginLeft: "auto"
};

const child = {
  display: "inline-block",
  paddingLeft: "30px"
};

const buttonStyle = {
    padding: "1px",
    marginLeft: "10px",
    marginBottom: "5px",
    marginTop: "3px"
  };

  const totalLineDesc = {  
    fontSize: "8pt",
    fontWeight: "bold",
    fontFamily: "Arial",
    borderBottom: "1px solid #fefefe",
    borderRight: "1px solid #fefefe",
    textAlign: "left",
    backgroundColor: "#fff",
  };
  
  const subTotalLineDetail = {    
    fontSize: "8pt",
    fontWeight: "bold",
    fontFamily: "Arial",
    textAlign: "right",
    padding: "5px",
    backgroundColor: "#fff",
  };
  const subTotalLineDesc = {  
    fontSize: "8pt",
    fontWeight: "bold",
    fontFamily: "Arial",
    borderBottom: "1px solid #fefefe",
    borderRight: "1px solid #fefefe",
    textAlign: "left",
    paddingLeft:"20px",
    backgroundColor: "#fff",
  };
  
  const totalLineDetail = {    
    fontSize: "8pt",
    fontWeight: "bold",
    fontFamily: "Arial",
    textAlign: "right",
    padding: "5px",
    backgroundColor: "#fff",
  };
  const secTotalLineDesc = {  
    fontSize: "8pt",
    fontWeight: "bold",
    fontFamily: "Arial",
    borderBottom: "1px solid #fefefe",
    borderRight: "1px solid #fefefe",
    textAlign: "left",
    paddingLeft: "10px",
    backgroundColor: "#fff",
  };
  
  const secTotalLineDetail = {    
    fontSize: "8pt",
    fontWeight: "bold",
    fontFamily: "Arial",
    textAlign: "right",
    padding: "5px",
    backgroundColor: "#fff",
  };

  const boldStyle = {
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: "8pt",
    paddingTop: "15px",
  };

  const sectionHeader = {
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: "8pt",
    paddingTop: "10px",
    paddingLeft: "10px"
    
  };

  const subsectionHeader = {
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: "8pt",
    paddingTop: "10px",
    paddingLeft: "20px"
    
  };

  const tableStyle = {
    borderCollapse: "collapse",
    margin: "auto",
    width: "80%",
    border: "1px solid #000",
    borderRadius: "10px",
    fontFamily: "Arial",
    overflow: "hidden",
  };
  
  const tableHeaderStyle = {
    fontSize: "8pt",
    fontWeight: 500,
    color: "#000000",
    backgroundColor: "#EEEEEE",
    borderBottom: "1px solid #eee",
    borderRight: "1px solid #eee",
    paddingTop: "15px",
    paddingBottom: "15px",
    paddingRight: "5px",
    textAlign: "right",
  };
  
  const descriptionHeader = {
    fontSize: "8pt",
    fontWeight: 500,
    color: "#000000",
    backgroundColor: "#EEEEEE",
    borderBottom: "1px solid #eee",
    borderRight: "1px solid #eee",
    paddingTop: "15px",
    paddingBottom: "15px",
    paddingLeft: "10px",
    paddingRight: "5px",
    textAlign: "left",
  };
  
  const descriptionColumn = {
    fontSize: "8pt",
    fontWeight: 500,
    borderBottom: "1px solid #fefefe",
    borderRight: "1px solid #fefefe",
    textAlign: "left",
    padding: "5px",
    paddingLeft: "30px",
    backgroundColor: "#fff",
  }
  const tableCellStyle = {
    fontSize: "8pt",
    textAlign: "right",
    padding: "5px",
    backgroundColor: "#fff",
  };
  
  const totalStyle = {
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: "8pt",
    paddingTop: "15px",
  };
  

  
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import withRouter from "../withRouter";
// import EnhancedReportTable from "./EnhancedReportTable";
  
// const EnhancedReport = (props) => {
//   const [title, setTitle] = useState("Report");
//   const [date, setDate] = useState("");
//   const [headers, setHeaders] = useState([]);
//   const [parameters, setParameters] = useState([]);
//   const [total, setTotal] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [dividers, setDividers] = useState([]);
//   const [csvData, setCsvData] = useState([]);
//   const [report, setReport] = useState([]); 
//   const [isLoading, setIsLoading] = useState(true)
//   const {folder, filename} = useParams()
    
     
//   useEffect(() => {   
//     const fetchData = async () => {
//       if(folder && filename){
//         console.log(folder + " -- " + filename)
//         try {
//           const res = await axios.get(`http://localhost:4444/test/${folder}/${filename}`);
//           const csvData = res.data;
//           setCsvData(csvData);
//           parseCSV(csvData);
//           setIsLoading(false);
//         } catch (err) {
//           alert(err);
//           setIsLoading(false)
//         }     
        
//       };
//     }     
         
//     fetchData();
//   }, [folder, filename]);
      
//   const parseCSV = (csvText) => {
//     const report = buildReport(csvText.sections, headers);
//     // setReport(report); 
//     const reportSections = [];
//     report.subsections.forEach(sec => {
//       reportSections.push(sec);
//     })
//     setReport(reportSections)

//     const divider = []
//     const parameters = [];
//     setTitle(csvText.title);
//     setDate(csvText.date);
//     setHeaders(csvText.header[0]);
    
//     setParameters(csvText.parameters[0])
//     divider.push(csvText.divider[0]) 

//     if(divider.length > 0 && divider[0] !== undefined){
//         const dividers = divider[0].filter(value => value.length > 2);
//         if(dividers.length > 0){
//             setDividers(dividers);
//         }
//     }
//   };
  
//   const buildReport = (data, headers) => {
//     const report = {
//         key: [],
//         value: [], 
//         total: [],
//         subsections: []
//       };
//         data.key?.forEach((line) => {
//             if (line.length === headers.length) {
//             const row = {};
//             headers.forEach((header, index) => {
//                 row[header] = line[index];
//             });
//             report.key.push(row);
//             }    
//         }); 
         
//         data.value?.forEach((line) => {
//         line.forEach((val) => {
//             if (val.length === headers.length) {
//                 const row = {};
//                 headers.forEach((header, index) => {
//                   row[header] = val[index];
//                 });
//                 report.value.push(row);
//             }})   
//         });
           
//         data.total?.forEach((line) => {
//             line.forEach((val) => {
//                 if (val.length === headers.length) {
//                     const row = {};
//                     headers.forEach((header, index) => {
//                     row[header] = val[index];
//                     });
//                     report.total.push(row);    
//                 }}) 
//             });

//         data.subsections?.forEach((subsection) => {
//             report.subsections.push(buildReport(subsection, headers));
//         });
//         return report; 
//     }
  
     
//   return (
//     <div> 
//       {isLoading ? ( 
//         <p>Loading...</p> 
//       ) : (
//     <>
//       <div className="report_header_child" style={report_title}>
//                     <div style={reportTitle}>
//                         <h1>{title}</h1>
//                     </div>
//                     <div style={reportDate}>
//                         <h3>{date}</h3>
//                     </div>
//                 </div>
//                 <div style={report_area}>
//                     <div className="report_header_child" style={parent}>
//                         {parameters.map((value, index) => (
//                             <p key={index} style={child} >{value}</p>
//                         ))}
//                     </div>
//       <div style={report_area}>
//         <div >
//             <EnhancedReportTable report={report} headers={headers} />
//         </div>
//       </div>
//     </div>
//     </>
//       )}
//     </div>
//   );
// };
 