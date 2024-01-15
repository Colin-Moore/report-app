import React, { useState } from "react";

const EnhancedReportTable = ({ report , headers}) => {
  console.log(report)

  const renderTableRow = (rowData, index, rowType, depth = 0) => {
    let rowStyle = {};

    const isExpanded = expandedSections.includes(
      Object.values(rowData).toString().substring(0, 5)
    );
  
    if(rowType === "total"){
      return (
        <tr key={index}>
          {headers.map((header, i) => (
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

      rowStyle = {
        paddingLeft: `${depth * 10}px`,
        ...boldStyle
      }

      return (
        <tr onClick={() => toggleSection(key)} key={index} style={rowStyle}>
          {headers.map((header, i) => (
            header.length > 0 ? (
              <td
                key={i}
                style={
                  i === 0 ? { width: '300px', ...rowStyle } : {}
                }
              >
                {i === 0 && (
                  <>
                    {isExpanded ? '-' : '+'}
                    &nbsp;
                  </>
                )}
                {rowData?.[header]}
              </td>
            ) : null
          ))}
        </tr>
      );
    }
    else{
      return (
        <tr key={index} style={rowStyle}>
          {headers.map((header, i) => (
            header.length > 0 ?
            <td key={i} style={i> 0 ? tableCellStyle : descriptionColumn}>{rowData?.[header]}</td>
            : null
            ))}
        </tr>
      );
    }
  };
  
  const expandAll = (report) => { 
  
  };

  const [expandedSections, setExpandedSections] = useState([]);  

  const toggleSection = (sectionIndex) => {
    if (expandedSections.includes(sectionIndex)) {
      setExpandedSections(expandedSections.filter(index => index !== sectionIndex));
    } else {
      setExpandedSections([...expandedSections, sectionIndex]);
    }
  };
  const renderSubsections = (subsections, parentKey = '', depth = 0) => {
    return (
      <>
      {subsections.map((subsection, index) => {
        const sectionKey = Object.values(subsection.key[0]).toString().substring(0, 5);
        return (
          <React.Fragment key={`${parentKey}-${sectionKey}`}>
            <tr>
              {renderTableRow(subsection.key[0], index, 'key', depth)} {/* Pass depth */}
            </tr>
              {expandedSections.includes(sectionKey) &&
                subsection.value && subsection.value.length > 0 && (
                  renderValueRows(subsection)
                )}
              {expandedSections.includes(sectionKey) &&
                subsection.subsections && subsection.subsections.length > 0 && (
                  renderSubsections(subsection.subsections, sectionKey, depth + 1) // Increase depth
                )}
              {subsection.total && subsection.total.length > 0 && (
                subsection.total.map((row, rowIndex) => (
                  renderTableRow(row, rowIndex, 'total')
                ))
              )}
            </React.Fragment>
          );
        })} 
      </>
    );
  };

  const renderReportSection = (reportData, parentKey = '', depth = 0) => {
    // console.log(JSON.stringify(reportData, null, 2))
    return (
      <>
        {reportData.map((row, index) => {
          const sectionKey = Object.values(row.key[0]).toString().substring(0, 5);
          return (
            <React.Fragment key={`${parentKey}-${sectionKey}`}>
              {renderTableRow(row.key[0], index, 'key', depth)} {/* Pass depth */}
              {expandedSections.includes(sectionKey) &&
                row.subsections && row.subsections.length > 0 && (
                  renderSubsections(row.subsections, sectionKey, depth + 1) // Increase depth
                )}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const renderValueRows = (key) => {
    const valueRows = key.value;
    return (
      <>
        {valueRows.map((row, index) => (
          renderTableRow(row, index, "value")
        ))}
      </>
    );
  };

  return (
    <div>
      {console.log(headers)}
      <button onClick={() => expandAll(report)}>Expand All</button>
      <table style={tableStyle}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              header.length > 0 ? 
              <th key={index} style={index > 0 ? tableHeaderStyle : descriptionHeader}>{header}</th>
              : null
            ))}
          </tr>
        </thead>
        {renderReportSection(report)}
      </table>
    </div>
  );
};
  const totalLineDesc = {  
    fontSize: "7.5pt",
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
    fontSize: "7.5pt",
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
  
export default EnhancedReportTable;


// import { useLocation } from 'react-router-dom'
// import React, { useState} from 'react';
// import withRouter from '../withRouter';
// import {Helmet} from 'react-helmet';

// function PrinterFriendly () {
//   const location = useLocation();
//   const { data, divider, title, grandtotal, parameters, date } = location.state;
//   // const [report, setReport] = useState([]);

//   let headers = data.length > 0 ? Object.keys(data[0].subsection[0].data[0]) : [];
//   const dividerWidth = Math.round(headers.length / divider.length,0);

//   const sections = [];
//   const totals = [];
//   for(let i = 0; i < data.length; i++){
//     sections.push(Object.values(data[i].subsection))
//     totals.push(Object.values(data[i].total))
//   }
//   const grandTotal = grandtotal.length > 0 ? Object.values(grandtotal[0]) : [];

//   return (
    
//     <div style={printy}>
//     <Helmet>
//         <meta charSet="utf-8" />
//         <title>{title[0]}</title>
//     </Helmet>

//     <button onClick={() => window.print()}>Print</button>
//       <div className="report_header_child" style={report_title}>
//         <div style={titleStyle}>
//           <h1>{title[0]}</h1>
//         </div>
//         <div style={dateStyle}>
//           <h3>{date[0]}</h3>
//         </div>
//       </div>
//       <div style={report_area}>
//           <div className="report_header_child" style={parent}>
//             {parameters.map((value, index) => (
//               <p key={index} style={child}>{value}</p>
//             ))}
//           </div>
//       </div>
//       <table style={tableStyle}>
//         <thead>
//           {divider.length > 0 ? 
//           <tr>
//             {divider.map((div, index) => (
//               <th key={`${index}-div`} colSpan={dividerWidth } scope="colgroup">{div}</th>
//             ))}
//           </tr>
//           : null}
//           <tr>
//             {headers.map((header, index) => (
//               <th key={`${index}-header`} style={ index > 0 ? tableHeaderStyle : descriptionHeader }>
//                 {index > 0 && divider.length > 0 ? 
//                 header.substring(0, header.length -1) : header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <React.Fragment key={row}>
//               <tr key={`${row}-title`} style={boldStyle}>
//                 <td style={sectionHeader}>
//                   {row.title}
//                 </td>
//               </tr>
//               {sections[index].map((sec, i) => (
//                 <React.Fragment key={sec}>
//                   <tr key={`${sec}-name`}>
                    
//                     <td key={`${sec}-data`} colSpan={headers.length} style={subsectionHeader}>
//                       {sec.name}
//                     </td>
//                   </tr>
//                   {sec.data.map((row, dataIndex) => (
//                     <tr key={`${row}-row`}>
//                       {headers.map((header, columnIndex) => (
//                         <td key={header} style={columnIndex > 0 ? tableCellStyle : descriptionColumn}>
//                           {columnIndex > 0
//                             ? parseFloat(row[header]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                             : row[header]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))} 
//                   {sec.total.map((tot, i) => (
//                     <tr>
//                       {headers.map((header, index) => (
//                         <td style={index > 0 ? secTotalLineDetail : secTotalLineDesc}>{tot[header]}</td>
//                       ))}
//                     </tr>
//                   ))}
//                 </React.Fragment>
//               ))}
//               {row.total.map((tot, i) => (
//               <tr key={tot}>
//                 {headers.map((header, index) => (
//                   <td key={index} style={index > 0 ? totalLineDetail : totalLineDesc}>
//                     {tot[header]}
//                   </td>
//                 ))}
//               </tr>
//               ))}
//             </React.Fragment>
//           ))}  
//         </tbody>
//         <tfoot>
//           <tr>
//         {headers.map((header, i) => (
//           <td style={i > 0 ? grandTotalLineDetail : grandTotalLineDesc}>{grandTotal[i]}</td>
//         ))}
//         </tr>
//         </tfoot>
//       </table>     
            
//    </div>
        
//         );
// }

// export default withRouter(PrinterFriendly);

// const printy = {
//   backgroundColor:"none"
// }

// const report_title = {
//     width:"70%",
//     marginRight: "auto",
//     marginLeft: "auto"
// }

// const titleStyle = {
//     width: "60%",
//     textAlign: "left",
//     display: "inline-block"
// }
// const dateStyle = {
//     width: "40%",
//     display: "inline-block",
//     textAlign: "right"
// }

// const report_area = {
//     width: "100%",
// }
// const parent = {
//     border: "0.5px solid #DEDEDE",
//     borderRadius: "10px",
//     marginBottom: "20px",
//     width: "80%",
//     marginRight: "auto",
//     marginLeft: "auto",
// }

// const child = {
//     display: "inline-block",
//     paddingLeft: "30px"
// }

// const grandTotalLineDesc = {  
//   fontSize: "8pt",
//   fontWeight: "bold",
//   fontFamily: "Arial",
//   borderBottom: "1px solid #fefefe",
//   borderRight: "1px solid #fefefe",
//   textAlign: "left",
//   backgroundColor: "#fff",
// };

// const grandTotalLineDetail = {    
//   fontSize: "8pt",
//   fontWeight: "bold",
//   fontFamily: "Arial",
//   textAlign: "right",
//   padding: "5px",
//   backgroundColor: "#fff",
// };

// const secTotalLineDesc = {  
//   fontSize: "8pt",
//   fontWeight: "bold",
//   fontFamily: "Arial",
//   borderBottom: "1px solid #fefefe",
//   borderRight: "1px solid #fefefe",
//   textAlign: "left",
//   paddingLeft:"20px",
//   backgroundColor: "#fff",
// };

// const secTotalLineDetail = {    
//   fontSize: "8pt",
//   fontWeight: "bold",
//   fontFamily: "Arial",
//   textAlign: "right",
//   padding: "5px",
//   backgroundColor: "#fff",
// };

// const totalLineDesc = {  
//   fontSize: "8pt",
//   fontWeight: "bold",
//   fontFamily: "Arial",
//   borderBottom: "1px solid #fefefe",
//   borderRight: "1px solid #fefefe",
//   textAlign: "left",
//   backgroundColor: "#fff",
// };

// const totalLineDetail = {    
//   fontSize: "8pt",
//   fontWeight: "bold",
//   fontFamily: "Arial",
//   textAlign: "right",
//   padding: "5px",
//   backgroundColor: "#fff",
// };
// const boldStyle = {
//   fontWeight: "bold",
//   fontFamily: "Arial",
//   fontSize: "8pt",
//   paddingTop: "15px",
// };

// const sectionHeader = {
//   fontWeight: "bold",
//   fontFamily: "Arial",
//   fontSize: "8pt",
//   paddingTop: "10px",
//   paddingLeft: "10px"
  
// };

// const subsectionHeader = {
//   fontWeight: "bold",
//   fontFamily: "Arial",
//   fontSize: "8pt",
//   paddingTop: "10px",
//   paddingLeft: "20px"
  
// };

// const tableStyle = {
//   borderCollapse: "collapse",
//   margin: "auto",
//   width: "100%",
//   border: "none",
//   fontFamily: "Arial",
//   overflow: "hidden",
// };

// const tableHeaderStyle = {
//   fontSize: "8pt",
//   fontWeight: 500,
//   color: "#000000",
//   backgroundColor: "#EEEEEE",
//   borderBottom: "1px solid #eee",
//   borderRight: "1px solid #eee",
//   paddingTop: "15px",
//   paddingBottom: "15px",
//   paddingRight: "5px",
//   textAlign: "right",
// };

// const descriptionHeader = {
//   fontSize: "8pt",
//   fontWeight: 500,
//   color: "#000000",
//   backgroundColor: "#EEEEEE",
//   borderBottom: "1px solid #eee",
//   borderRight: "1px solid #eee",
//   paddingTop: "15px",
//   paddingBottom: "15px",
//   paddingLeft: "10px",
//   paddingRight: "5px",
//   textAlign: "left",
// };

// const descriptionColumn = {
//   fontSize: "8pt",
//   fontWeight: 500,
//   borderBottom: "1px solid #fefefe",
//   borderRight: "1px solid #fefefe",
//   textAlign: "left",
//   padding: "5px",
//   paddingLeft: "30px",
//   backgroundColor: "#fff",
// }
// const tableCellStyle = {
//   fontSize: "8pt",
//   textAlign: "right",
//   padding: "5px",
//   backgroundColor: "#fff",
// };