import React, { useState } from "react";

const EnhancedReportTable = ({ report, headers, total, divider, columnWidths }) => {
  console.log(report)
  const colWidths = columnWidths.length > 0 ? Object.values(columnWidths[0]) : [];
  const dividerWidth = Math.round(headers.length / divider.length, 0);
  let subtable = false;
  let reportWidth = 0;
  const subtablevalues = {};

  const calculateTableWidth = () => {
    colWidths.forEach((x, i) => {
      if (i < colWidths.length - 1) {
        let val = parseInt(x) === NaN ? 0 : parseInt(x);
        reportWidth += val;
      }
    })
    const minWidth = 1000;
    const maxWidth = 2000;
    const widthPerCharacter = 10;

    let width = reportWidth * widthPerCharacter + 100;

    width = Math.min(Math.max(width, minWidth), maxWidth);

    return { width: `${width}px` };
  }

  const tableWidth = calculateTableWidth();
  const tStyle = {
    width: `100%`,
    marginLeft: 'auto',
    marginRight: 'auto',
    ...tableStyle
  }


  ///////////////////////////
  const isNumber = (str) => {
    // if (typeof str != "string") return false
    // return !isNaN(str) &&
    //   !isNaN(parseFloat(str))
  }
  const renderTableRow = (rowData, index, rowType, depth = 0, rowKey = '') => {

    let rowStyle = {
      textAlign: "right"
    };

    const totalDesc = {
      fontSize: "7.5pt",
      fontWeight: "bold",
      fontFamily: "Arial",
      borderBottom: "1px solid #fefefe",
      borderRight: "1px solid #fefefe",
      textAlign: "left",
      backgroundColor: "#fff",

    };

    const totalDetail = {
      fontSize: "7.5pt",
      fontWeight: "bold",
      fontFamily: "Arial",
      textAlign: "right",
      padding: "5px",
      backgroundColor: "#fff",
      // paddingLeft: `${depth * 5}px`
    };

    const descriptionColumn = {
      fontSize: "7.5pt",
      fontWeight: 500,
      borderBottom: "1px solid #fefefe",
      borderRight: "1px solid #fefefe",
      textAlign: "left",
      padding: "5px",
      paddingLeft: "30px",
      backgroundColor: "#fff",
      // paddingLeft: `${depth * 5}px`
    }
    const tableCellStyle = {
      fontSize: "7.5pt",
      textAlign: "right",
      padding: "5px",
      backgroundColor: "#fff",
      // paddingLeft: `${depth * 5}px`
    };

    const isExpanded = expandedSections.includes(
      rowKey
    );

    if (rowType === "total") {
      return (
        <tr key={index}>
          {headers.map((header, i) => (
            header.length > 0 ?
              <td key={i} style={i > 0 ? totalDetail : totalDesc}>
                {isNumber(rowData?.[header]) ?
                  parseFloat(rowData?.[header]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  :
                  rowData?.[header]}</td>
              : null
          ))}
        </tr>
      );
    }

    else {

      if (rowType === "name") {

        let key = rowKey
        rowStyle = {
          paddingLeft: `${depth * 15}px`,
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
                      {isExpanded ? '-' : '+'}
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

      if (rowData === 'end') {
        subtable = false;
        const sectionData = [subtablevalues[rowKey]]
        const subheaders = Object.keys(sectionData[0])
        const newStyle = {
          paddingLeft: `${depth * 7}px`
        }

        return (
          <tr >
            <td>
              <table style={newStyle}>
                <thead>
                  <tr>
                    {subheaders.map((header, i) => (
                      i > 0 && i < headers.length - 1 ?
                        <th style={tableCellStyle}>{header}</th>
                        :
                        null
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sectionData.map((sub, index) => (
                    <tr>
                      {subheaders.map((header, i) => (
                        i === 0 ? null :
                          <td style={tableCellStyle}>{sub[header]}</td>
                      ))}

                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>

        )

      }

      if (rowData[0] === 'subtable' || subtable === true) {
        subtablevalues[rowKey] = rowData;
      }

      else {
        return (
          <tr key={index} style={rowStyle}>
            {headers.map((header, i) => (
              header.length > 0 ?
                <td key={i} style={i > 0 ? tableCellStyle : descriptionColumn}>
                  {isNumber(rowData?.[header])
                    ? parseFloat(rowData?.[header]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    :
                    rowData?.[header]}</td>
                : null
            ))}
          </tr>
        );
      }
    }
  };

  const [expandedSections, setExpandedSections] = useState([]);

  const toggleSection = (sectionIndex) => {
    console.log(sectionIndex)
    if (expandedSections.includes(sectionIndex)) {
      setExpandedSections(expandedSections.filter(index => index !== sectionIndex));
    } else {
      setExpandedSections([...expandedSections, sectionIndex]);
    }
  };

  const renderSubsections = (subsections, parentKey = '', depth = 0, mainTableWidth) => {
    return (
      <>
        {subsections.map((subsection, index) => {
          const sectionKey = subsection.name[0] && subsection.name[0].length > 0 ? Object.values(subsection.name[0]).toString().substring(0, 5) + subsection.key : subsection.key + subsection.key;
          return (
            <React.Fragment key={`${parentKey}-${sectionKey}`}>
              <tr>
                {renderTableRow(subsection.name[0], index, 'name', depth, sectionKey)}
              </tr>
              {expandedSections.includes(sectionKey) &&
                subsection.value && subsection.value.length > 0 && (
                  renderValueRows(subsection, depth + 2)
                )}
              {expandedSections.includes(sectionKey) &&
                subsection.subsections && subsection.subsections.length > 0 && (
                  <tr>
                    <td colSpan={headers.length}>
                      <table style={{ width: '100%' }}>
                        <tbody>
                          {renderSubsections(subsection.subsections, sectionKey, depth + 1, mainTableWidth)}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
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

  const renderReportSection = (reportData, parentKey = '', depth = 0, mainTableWidth) => {
    return (
      <>
        {reportData.map((row, index) => {
          const sectionKey = Object.values(row.name[0]).toString().substring(0, 5) + row.key;
          return (
            <React.Fragment key={`${parentKey}-${sectionKey}`}>
              {renderTableRow(row.name[0], index, 'name', depth, sectionKey)}
              {expandedSections.includes(sectionKey) && (
                row.subsections && row.subsections.length > 0 ?
                  <tr>
                    <td colSpan={headers.length}>
                      <table style={{ width: '100%' }}>
                        <tbody>
                          {renderSubsections(row.subsections, sectionKey, depth + 1, mainTableWidth)}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  :
                  renderValueRows(row, depth + 1)
              )}
              {row.total && row.total.length > 0 && (renderTableRow(row.total[0], index, 'total'))}
            </React.Fragment>
          );
        })}
      </>
    );
  };
  const renderValueRows = (key, depth) => {
    const valueRows = key.value;

    return (
      <>
        {valueRows.map((row, index) => (
          renderTableRow(row, index, "value", depth)
        ))}
      </>
    );
  };

  const calculateColumnWidth = (characters) => {
    const minWidth = 50;
    const maxWidth = 800;
    const widthPerCharacter = 3

    let width = characters * widthPerCharacter;

    width = Math.min(Math.max(width, minWidth), maxWidth);

    return { width: `${width}px` };
  };

  return (
    <table>
       <thead>
        {divider.length > 0 ?
          <tr>
            {divider.map((div, index) => (
              <th colspan={dividerWidth} scope="colgroup">{div}</th>
            ))}
          </tr>
          : <></>}
        <tr>
          {headers.length > 0 ?
            headers.map((header, index) => (
              header.length > 0 ?
                <th key={index} style={index > 0 ? { ...calculateColumnWidth(colWidths[index]), ...tableHeaderStyle } : { ...calculateColumnWidth(colWidths[index]), ...descriptionHeader }}>{header}</th>
                : null
            )) : null}
        </tr>
      </thead>
      <tbody>
        {renderReportSection(report, '', 0, tableWidth)}
        {total.length > 0 ?
          total.map((total, i) => (
            <tr key={i}>
              {headers.map((header, i) => (
                header.length > 0 ?
                  <td key={i} style={i > 0 ? { ...calculateColumnWidth(colWidths[i]), ...totalLineDetail }
                    :
                    { ...calculateColumnWidth(colWidths[i]), ...totalLineDesc }}>
                    {isNumber(total?.[header]) ?
                      parseFloat(total?.[header]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      :
                      total?.[header]}
                  </td>
                  : null
              ))}
            </tr>
          )) : null}
      </tbody>
    </table>
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

const totalLineDetail = {
  fontSize: "7.5pt",
  fontWeight: "bold",
  fontFamily: "Arial",
  textAlign: "right",
  padding: "5px",
  backgroundColor: "#fff",
};

const boldStyle = {
  fontWeight: "bold",
  fontFamily: "Arial",
  fontSize: "7.5pt",
  paddingTop: "15px",
  cursor: 'pointer'
};

const tableStyle = {
  borderCollapse: "collapse",
  margin: "auto",
  fontFamily: "Arial",
  overflow: "hidden",
};

const tableHeaderStyle = {
  fontSize: "7.5pt",
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
  fontSize: "7.5pt",
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

export default EnhancedReportTable;
