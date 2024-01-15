import React, { useState } from "react";
import './App.css';
const PrinterFriendlyList = ({report , headers, total, divider, columnWidths}) => {
console.log(report)
  const colWidths = columnWidths.length > 0 ? Object.values(columnWidths[0]) : [];
  const dividerWidth = Math.round(headers.length / divider.length,0);
  let subtable = false;
  let depth = 0;
  let reportWidth = 0;
  const subtablevalues = {};
  const subhead =  Object.keys((report[0].subsections[0].name[0])).slice(1,);
  const sections = [];
 
  let singlesection = false;
  
 
///////////////////////////
const isNumber = (str) => {
  if (typeof str != "string") return false 
  return !isNaN(str) && 
        !isNaN(parseFloat(str)) 
}
///////////////////////////
  const renderTableRow = (rowData, index, rowType, depth = 0, rowKey = '') => {
    
    let rowStyle = {};
    const totalDesc = {  
      fontSize: "7.5pt",
      fontWeight: "bold",
      fontFamily: "Arial",
      borderBottom: "1px solid #fefefe",
      borderRight: "1px solid #fefefe",
      textAlign: "right",
      backgroundColor: "#fff",
      paddingLeft: `${depth * 10}px`
    };
    
    const totalDetail = {    
      fontSize: "7.5pt",
      fontWeight: "bold",
      fontFamily: "Arial",
      textAlign: "right",
      padding: "5px",
      backgroundColor: "#fff",
      paddingLeft: `${depth * 10}px`
    };

    const descriptionColumn = {
      fontSize: "8pt",
      fontWeight: 500,
      borderBottom: "1px solid #fefefe",
      borderRight: "1px solid #fefefe",
      textAlign: "right",
      padding: "5px",
      paddingLeft: "30px",
      backgroundColor: "#fff",
      paddingLeft: `${depth * 10}px`
    }
    const tableCellStyle = {
      fontSize: "8pt",
      textAlign: "right",
      padding: "5px",
      backgroundColor: "#fff",
      paddingLeft: `${depth * 10}px`
    };

  
    if(rowType === "total"){
      // console.log(rowData)
      return (
        <tr key={index}>
          {headers.map((header, i) => (
            header.length > 0 ? 
            <td key={i}  style={i > 0 ? totalDetail : totalDesc}>{rowData?.[header]}</td>
            : null
            ))}
        </tr>
      );
    }

    if(rowType === "name"){
  
      let key = rowKey
      rowStyle = {
        paddingLeft: `${depth * 20}px`,
        ...boldStyle
      }
      return (
        <tr key={index} style={rowStyle}>
          {headers.map((header, i) => (
            header.length > 0 ? (
              <td
                key={i}
                style={rowStyle}
              >
                
                {rowData?.[header]}
              </td>
            ) : <></>
        
          ))}
        </tr>
      );
    }
    else{
      return (
        <tr key={index} style={rowStyle}>
          {headers.map((header, i) => (
            header.length > 0 ?
            <td key={i} style={i> 0 ? {...calculateColumnWidth(colWidths[i]), ...tableCellStyle} : {...calculateColumnWidth(colWidths[i]), ...descriptionColumn}}>{rowData?.[header]}</td>
            : null
            ))}
        </tr>
      );
    }
  
  };

////////////////////////////
  const renderSubsections = (subsections, parentKey = '', depth = 0, mainTableWidth) => {
    const colwidths = {};
    return (
      <>
        {subsections.map((subsection, index) => {
          // console.log(subsection)
          // console.log(subsection)
          const sectionKey = subsection.name[0] && subsection.name[0].length > 0 ? Object.values(subsection.name[0]).toString().substring(0, 5) + subsection.key : subsection.key + subsection.key;
          const headers = Object.keys(subsection.name.slice(1,));
          return (
            <React.Fragment key={`${parentKey}-${sectionKey}`}>
              <table style={{ width: '100%' }}> 
                <tbody>
                  <tr>
                    {renderTableRow(subsection.name[0], index, 'name', depth + 2, sectionKey)}
                  </tr>
                </tbody>
              </table>
              { subsection.value && subsection.value.length > 0 && subsection.value[0] !== 'end' && (
                  renderValueRows(subsection, depth + 2)
                )}
                  <tr> 
                    <td colSpan={headers.length}>
                      <table style={{ width: '100%' }}>
                        <tbody>
                          {renderSubsections(subsection.subsections, sectionKey, depth + 1, mainTableWidth)}
                        </tbody>
                      </table>
                    </td>
                  </tr>
              {subsection.total && subsection.total.length > 0 && (
              
                subsection.total.map((row, rowIndex) => (
                  renderTableRow(row, rowIndex, 'total', depth, sectionKey)
                ))
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  };
///////////////////////
  const calculateTableWidth = () => {
    colWidths.forEach((x, i) => {
      if(i < colWidths.length -1){
        let val = parseInt(x) === NaN ? 0 : parseInt(x);
        reportWidth += val;
      }
    })
    const minWidth = 1000; 
    const maxWidth = 1500;
    const widthPerCharacter = 10; 

    let width = reportWidth * widthPerCharacter;

    width = Math.min(Math.max(width, minWidth), maxWidth);

    return { width: `${width}px` };
  }

/////////////////
  const tableWidth = calculateTableWidth();

///////////////////////
  const renderValueRows = (key, depth = 0) => {
    // console.log(key.widths[0]['Description'])
    const tableStyle = {
      borderCollapse: "collapse",
      marginLeft: `${depth * 10}px`,
      fontFamily: "Arial",
      overflow: "hidden",
    };
    const rowStyle = {
      paddingTop: "5px",
      ...tableCellStyle
    }
    const valueRows = key.value;
    const valueHeaders = Object.keys(valueRows[0]).slice(1, -1);
    return (
      <>
        <table style={tableStyle}>
          <thead>
            <tr>
              {valueHeaders.map((header, i) => (
                  <th style={{...calculateColumnWidth(key.widths[0][header]), ...boldStyle}} key={i}>
                  {isNumber(header) 
                  ?
                    parseFloat(header).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  :
                    header
                  }
                  </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {valueRows.map((row, index) => (
              
              <tr key={index}>
                {valueHeaders.map((header, i) => (
                  <td style={{...calculateColumnWidth(key.widths[0][header]), ...rowStyle}} key={i}>
                    {isNumber(row[header]) && header.toLowerCase() !== 'sku-num'
                    ? 
                      parseFloat(row[header]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : 
                      row[header] }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };
  
/////////////////////////
  const calculateColumnWidth = (characters) => {
    const minWidth = 50; 
    const maxWidth = 300;
    const widthPerCharacter = 8; 

    let width = characters * widthPerCharacter;

    width = Math.min(Math.max(width, minWidth), maxWidth);

    return { width: `${width}px` };
  };
///////////////////////
  const getSubsections = (data, sectionKey) => {
    const boldStyle = {
      fontWeight: "bold",
      fontFamily: "Arial",
      fontSize: "8pt",
      cursor: 'pointer',
      paddingTop: "5px",
      textAlign: 'right'
    };

    return (
      <tr>
        {subhead.map((header, index) => (
          <td  style={boldStyle} key={index}>  
           {isNumber(data.name[0][header])  ? 
              parseFloat(data.name[0][header]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            :
              data.name[0][header]}</td> 
        ))}
      </tr>
    );
  };

///////////////////////
  const renderReportSection = (reportData, parentKey = '', depth = 0, mainTableWidth) => {
    return reportData.subsections.map((row, index) => {
      const sectionKey = Object.values(row.name[0]).toString().substring(0, 5) + row.key;
      sections.push(sectionKey)
      return (
        <React.Fragment key={`${parentKey}-${sectionKey}`} >
          {index > 0 &&
            <tr style={boldStyle}>
              {subhead.map((subHeader, k) => (
                <th key={k} style={calculateColumnWidth(colWidths[k])}>{subHeader}</th>
              ))}
            </tr>
          }
          
          {getSubsections(row, sectionKey)}
          { (row.subsections && row.subsections.length > 0 && (
            <tr> 
              <td colSpan={subhead.length}>
               
                {renderSubsections(row.subsections, sectionKey, depth + 2, mainTableWidth)}
              </td>
            </tr>       
            
          ))}
            <tr style={{ ...boldStyle}}>
              {subhead.map((header, i) => (
                <td key={i} style={{width: '100px'}}>
                  {row.total[0]?.[header]}
                </td>
              ))}
            </tr>
        </React.Fragment>
      );
    });
  };

  return (
    <table style={{width: tableWidth.width, ...tableStyle}}>
      <thead>
        <tr style={listheader}>
          {headers.slice(0,1).map((header, i) => (
            <td key={i}>{header}</td>
          ))}
        </tr>
      </thead>
      <tbody style={{marginBottom: '10px'}}>
  {report.map((section, i) => (
    
    <React.Fragment key={i}>
      {headers.slice(0, 1).map((header, index) => (
        <React.Fragment key={index}>
          <tr>
            <td style={{ ...listheader }}>{section.name[0][header]}</td>
          </tr>
          
            <tr>
              <td style={listSubHeader} colSpan={headers.length}>
                <table>
                  <thead>
                    <tr style={boldStyle}>
                      {subhead.map((subHeader, k) => (
                        <th key={k} style={calculateColumnWidth(colWidths[k])}>{subHeader}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {renderReportSection(section, index, 0, tableWidth)}
                  </tbody>
                </table>
              </td>
            </tr>
          
        </React.Fragment>
      ))}
    </React.Fragment>
  ))}

{total[0] && total[0].length > 0 && (
    <tr style={{marginTop: '20px', ...totalStyle}}>
      <table width={'70%'}>
        <tbody>
   {headers.map((header, i) => (
    <td>{total[0][header]}</td>
   ))}
   </tbody>
   </table>
  </tr>
  )}
  </tbody>
    </table>
  );
}

  // STYLES
  const listheader = {
    paddingTop: "5px",
    paddingLeft: '10px',
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: "10pt",
    cursor: 'pointer',
  };

  const listSubHeader = {
    paddingLeft: '20px'
  };

  const boldStyle = {
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: "8pt",
    paddingTop: "5rowStylepx",
    cursor: 'pointer',
    textAlign: 'right'
  };

  const tableStyle = {
    borderCollapse: "collapse",
    fontFamily: "Arial",
    marginLeft: 'auto',
    marginRight: "auto",
    marginBottom: "80px",
    overflow: "hidden",
  };

  const tableCellStyle = {
    fontSize: "8pt",
    textAlign: "right",
    // padding: "5px",
    fontWeight: "100",
    backgroundColor: "#fff",
  };
  
  const totalStyle = {
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: "8pt",
  };
export default PrinterFriendlyList;