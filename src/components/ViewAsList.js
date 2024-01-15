import React, { useState } from "react";
let font_size = 10;

const setFontSize = (width) => {
  font_size = 10;
}

const ViewAsList = ({report , headers, total, divider, columnWidths } ) => {

  // console.log(JSON.stringify(report, null, 2))

  let reportWidth = 0;
  const colWidths = columnWidths.length > 0 ? Object.values(columnWidths[0]) : [];
  const subhead = report[0].subsections[0].name[0] ? Object.keys((report[0].subsections[0].name[0])) : Object.keys(report[0].name[0]);
  const sections = [];
  const [expandedSections, setExpandedSections] = useState([]);  
let singlesection = false;
  
if(report[0].name[0][headers[0]] === 'head'){
    singlesection = true;
    expandedSections.push('head')
  }
  
//////////////////////////// 
  const isExpanded = (sectionKey) => {
    return expandedSections.includes(sectionKey)
  };

////////////////////////////
  const toggleSection = (sectionIndex) => {
    if (expandedSections.includes(sectionIndex)) {
      setExpandedSections(expandedSections.filter(index => index !== sectionIndex));
    } else {
      setExpandedSections([...expandedSections, sectionIndex]);
    }
  };

///////////////////////////
  const isNumber = (str) => {
    // if (typeof str != "string") return false 
    // return !isNaN(str) && 
    //       !isNaN(parseFloat(str)) 
  }

///////////////////////////
  const renderTableRow = (rowData, index, rowType, depth = 0, rowKey = '') => {
    
    let rowStyle = {};
    const totalDesc = {  
      fontWeight: "bold",
      fontFamily: "Arial",
      borderBottom: "1px solid #fefefe",
      borderRight: "1px solid #fefefe",
      textAlign: "right",
      backgroundColor: "#fff",
      paddingLeft: `${depth * 10}px`
    };
    
    const totalDetail = {    
      // fontSize: "7.5pt",
      fontWeight: "bold",
      fontFamily: "Arial",
      textAlign: "right",
      padding: "5px",
      backgroundColor: "#fff",
      paddingLeft: `${depth * 10}px`
    };

    const descriptionColumn = {
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
      textAlign: "right",
      padding: "5px",
      backgroundColor: "#fff",
      paddingLeft: `${depth * 10}px`
    };
  
    if(rowType === "total"){
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
    if(rowData === undefined){
      expandedSections.push(rowKey)
    }
    else{

      if(rowType === "name"){
    
        let key = rowKey
        rowStyle = {
          paddingLeft: `${depth * 20}px`,
          ...boldStyle
        }
        return (
          <tr onClick={() => toggleSection(key)} key={index} style={rowStyle}>
            {headers.map((header, i) => (
              header.length > 0 ? (
                <td
                  key={i}
                  style={rowStyle}
                >
                  {i === 0 && (
                    <>
                      {isExpanded(key) ? '-' : '+'}
                      &nbsp;
                    </>
                  )}
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
    }
  };

////////////////////////////
  const renderSubsections = (subsections, parentKey = '', depth = 0, mainTableWidth) => {
    return (
      <>
        {subsections.map((subsection, index) => {
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
              {expandedSections.includes(sectionKey) &&
                subsection.value && subsection.value.length > 0 && subsection.value[0] !== 'end' && (
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
    const widthPerCharacter = 6; 

    let width = reportWidth * widthPerCharacter;

    setFontSize(width);
    
    width = Math.min(Math.max(width, minWidth), maxWidth);

    return { width: `${width}px` };
  }

///////////////////////
  const tableWidth = calculateTableWidth();

///////////////////////
  const renderValueRows = (key, depth = 0) => {
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
    const widthPerCharacter = 10; 

    let width = characters * widthPerCharacter;

    width = Math.min(Math.max(width, minWidth), maxWidth);

    return { width: `${width}px` };
  };

  ///////////////////////
  const getSubsections = (data, sectionKey) => {
    const boldStyle = {
      fontWeight: "bold",
      fontFamily: "Arial",
      cursor: 'pointer',
      paddingTop: "5px",
      textAlign: 'right'
    };

    return (
      <tr key={sectionKey} onClick={() => toggleSection(sectionKey)}>
        {subhead.map((header, index) => (
          <td  style={boldStyle} key={index}>  
            {index === 0 && (
              <>
                {isExpanded(sectionKey) ? '-' : '+'}
                &nbsp;
              </>
            )}
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
    console.log(depth)
    return reportData.subsections.map((row, index) => {
      const sectionKey = Object.values(row.name[0]).toString().substring(0, 5) + row.key;
      sections.push(sectionKey)
      return (
        <React.Fragment key={`${parentKey}-${sectionKey}`} >
          {index > 0 && expandedSections.includes(sections[index - 1]) &&
            <tr style={boldStyle}>
              {subhead.map((subHeader, k) => (
                <th key={k} style={calculateColumnWidth(colWidths[k])}>{subHeader}</th>
              ))}
            </tr>
          }
          
          {getSubsections(row, sectionKey)}
          {expandedSections.includes(sectionKey) && (row.subsections && row.subsections.length > 0 && (
            <tr> 
              <td colSpan={subhead.length}>
               
                {renderSubsections(row.subsections, sectionKey, depth , mainTableWidth)}
              </td>
            </tr>       
            
          ))}
          {/* {console.log(row.total[0])} */}
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
            
            <td key={i}>{singlesection === false ? header : ""}</td>
          ))}
        </tr>
      </thead>
      <tbody style={{marginBottom: '10px'}}>
  {report.map((section, i) => (
    
    <React.Fragment key={i}>
      {headers.slice(0, 1).map((header, index) => (
        <React.Fragment key={index}>
          
          <tr onClick={() => toggleSection(section.name[0][header])} >
            <td style={{ ...listheader }}> {
              singlesection === false ? index === 0 && (
              <>
                {isExpanded(section.name[0][header]) ? '-' : '+'}
                &nbsp;
              </>
            ) : "" }{ singlesection === false ? section.name[0][header] : ""}</td>
          </tr>
          {expandedSections.includes(section.name[0][header]) && (
            <tr>
              <td colSpan={headers.length}>
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
          )}
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
    cursor: 'pointer',
  };

  const boldStyle = {
    fontWeight: "bold",
    fontFamily: "Arial",
    paddingTop: "5px",
    cursor: 'pointer',
    textAlign: 'right'
  };

  const tableStyle = {
    borderCollapse: "collapse",
    fontFamily: "Arial",
    margin: 'auto',
    overflow: "hidden",
    fontSize: `${font_size}px`,
  };
  
  const tableCellStyle = {
    textAlign: "right",
    // padding: "5px",
    fontWeight: "100",
    backgroundColor: "#fff",
  };
  
  const totalStyle = {
    fontWeight: "bold",
    fontFamily: "Arial",
  };

export default ViewAsList;