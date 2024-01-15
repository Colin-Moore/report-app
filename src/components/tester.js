import React, { useState, useEffect } from "react";

const Tester = ({ report, expandAll }) => {
  const [expandedSections, setExpandedSections] = useState([]);
  const [sortByColumn, setSortByColumn] = useState('');
  const [sortType, setSortType] = useState('ascending');

  const categoricalColumns = [
    'Department', 'Description', 'SKU Number', 'Location', 'Retail Location',
    'Tax 1', 'Tax 2', 'Tax 3', 'Customer Name'
  ]
  const colWidths = report.widths.length > 0 ? Object.values(report.widths[0]) : [];

  let fontWidthPercent = 1;

  const getWindowSize = () => {
    return {
      height: window.innerHeight,
      width: window.innerWidth
    }
  }
  const [windowSize, setWindowSize] = useState(getWindowSize());

  const getFontSize = (size) => {
    
    let newSize = fontWidthPercent * size;
    if(newSize < 5) {
      return {fontSize: '5pt'}
    }
      return { fontSize: `${newSize}pt` };
  }

  useEffect(() => {
    const updateDimensions = () => {
      setWindowSize(getWindowSize())
    }
    window.addEventListener('resize', updateDimensions);

    return (() => {
      window.removeEventListener('resize', updateDimensions);
    })
  }, [windowSize])

  const calculateTableWidth = () => {
    const minWidth = 1000;
    const maxWidth = 1800;

    let width = Math.floor(window.innerWidth * 0.8);
    width = Math.min(Math.max(width - 10, minWidth), maxWidth);
    fontWidthPercent = width / maxWidth
    return { width: `${width}px` };
  }

  const tableWidth = calculateTableWidth();

  const toggleSection = (sectionIndex) => {
    if (expandedSections.includes(sectionIndex)) {
      setExpandedSections(expandedSections.filter(index => index !== sectionIndex));
    } else {
      setExpandedSections([...expandedSections, sectionIndex]);
    }
  };

  const calculateColumnWidth = (characters) => {
    const minWidth = 10;
    const maxWidth = 560;
    const widthPerCharacter = 15;

    let width = characters * widthPerCharacter;

    width = Math.min(Math.max(width, minWidth), maxWidth);

    return { width: `${width}px` };
  };

  const RenderTotals = (data, depth = 0) => {
    const indent = {
      paddingLeft: `${depth * 10}px`
    }
    return (
      data.map((dat, i) => (
        <tr>
          {report.header.map((header, j) => (
            <td style={j === 0 ? { ...indent, ...totalLineDesc, ...getFontSize(8) } : { ...totalLineDetail, ...getFontSize(8) }}>{categoricalColumns.includes(header) ? dat[header] :  parseFloat(dat[header]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
          ))}
        </tr>
      ))
    )
  }

  const RenderGrandTotals = (data, depth = 0) => {
    const indent = {
      paddingLeft: `${depth * 10}px`
    }
    return (
      <tr>
        {report.header.map((header, j) => (
          <td style={j === 0 ? { ...indent, ...totalLineDesc, ...getFontSize(8) } : { ...totalLineDetail, ...getFontSize(8) }}>{categoricalColumns.includes(header) ? data?.[j] :  parseFloat(data?.[j]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
        ))}
      </tr>

    )
  }

  const RenderValues = (dat, depth = 0) => {
    let newData = [];
    let hdrs = dat.length > 0 ? Object.keys(dat[0]).filter(x => x.length > 1) : []
    
    if (sortType === 'ascending') {
      newData = [].concat(dat).sort((a, b) => parseFloat(a[sortByColumn]) > parseFloat(b[sortByColumn]) ? 1 : -1)
    }
    else {
      newData = [].concat(dat).sort((a, b) => parseFloat(a[sortByColumn]) < parseFloat(b[sortByColumn]) ? 1 : -1)
    }
    const indent = {
      paddingLeft: `${depth * 15}px`
    }
    if (JSON.stringify(report.header) !== JSON.stringify(hdrs)) {
      return (
        <tr>
          <td colSpan={report.header.length}>
            <table>
              <thead>
                <tr>
                  {hdrs.map((header, i) => (
                    <th onClick={() => SortBy(header)} style={i === 0 ? {  ...calculateColumnWidth(colWidths[0]), ...subTableHeader, ...getFontSize(11) } 
                    : { ...calculateColumnWidth(colWidths[i]), ...subTableHeader, ...getFontSize(11) }} key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {newData.map((section, idx) => (
                  <React.Fragment key={idx}>
                    <tr key={`section-${idx}`}>
                      {hdrs.map((header, j) => (
                        <td style={j === 0 ? { ...indent, ...categoricalColumns.includes(header) ? textColumn : numericalColumn, ...calculateColumnWidth(colWidths[0]), ...getFontSize(8) } :
                          { ...categoricalColumns.includes(header) ? textColumn : numericalColumn, ...calculateColumnWidth(colWidths[j]), ...getFontSize(8) }} key={`${idx}-${j}`}>
                            {categoricalColumns.includes(header) ? section[header] :  parseFloat(section[header]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}</tbody>
            </table>
          </td>
        </tr>
      )
    }
    else {

      return (newData.map((section, idx) => (
        <React.Fragment key={idx}>
          <tr key={`section-${idx}`}>
            {report.header.map((header, j) => (
              <td style={j === 0 ? { ...indent,  ...categoricalColumns.includes(header) ? textColumn : numericalColumn, ...calculateColumnWidth(colWidths[0]), ...getFontSize(8) } :
                { ...categoricalColumns.includes(header) ? textColumn : numericalColumn, ...calculateColumnWidth(colWidths[j]), ...getFontSize(8) }} key={`${idx}-${j}`}>
                  { categoricalColumns.includes(header) ? section[header] : parseFloat(section[header]).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
            ))}
          </tr>
        </React.Fragment>
      ))
      )
    }
  }


  const RenderReportBody = (data, depth = 0) => {
    const indent = {
      paddingLeft: `${depth * 10}px`
    }
    return (
      <>
        {data.map((dat, i) => {
          const sectionKey = dat;
          let len = 0;
          for(let value of dat.name){
            if(value.length > 1){
              len++
            }
          }
          return (
            <React.Fragment key={i}>
              <tr onClick={() => toggleSection(sectionKey)}>
                {dat.name.map((name, j) =>
                  report.header.map((header, x) => (
                    <td style={x === 0 ? { ...indent, ...categoricalColumns.includes(header) ? textSectionHeader : numericalSectionHeader, ...getFontSize(8) } 
                    : { ...categoricalColumns.includes(header) ? textSectionHeader : numericalSectionHeader, ...getFontSize(8) }} key={`${i}-${j}-${x}`}>{name[header]}</td>
                  ))
                )}
              </tr>

              {dat.value && dat.value.length > 0 && (expandAll === true || expandedSections.includes(sectionKey)) &&
                RenderValues(dat.value, depth)
              }
              {dat.subsections && dat.subsections.length > 0 && (expandAll === true || expandedSections.includes(sectionKey)) && 
                RenderReportBody(dat.subsections, ++depth)
              }
              {dat.total && dat.total.length > 0 && (expandAll === true || expandedSections.includes(sectionKey)) &&
                RenderTotals(dat.total, depth)
              }
            </React.Fragment>
          )
        })}
      </>

    )
  }

  const SortBy = (header) => {
    setSortByColumn(header)
    setSortType((sortType === 'ascending' ? 'descending' : 'ascending'))
  }

  return (
    <div>
      <table style={{ ...tableWidth, ...tableStyle }}>
        <thead style={sticky}>
          <tr>
            {report.header.map((header, i) => (
              <th onClick={() => SortBy(header)} 
              style={i === 0 ? { ...calculateColumnWidth(colWidths[0]), ...categoricalColumns.includes(header) ? categoricalHeader : numericalHeader, ...getFontSize(11) } 
              : { ...calculateColumnWidth(colWidths[i]), ...categoricalColumns.includes(header) ? categoricalHeader : numericalHeader, ...getFontSize(11) }} key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RenderReportBody(report.sections)}
          {RenderGrandTotals(report.total[0])}
        </tbody>
      </table>
    </div>
  )
}

const textSectionHeader = {
  fontWeight: '550',
  borderBottom: "1px solid #fefefe",
  borderRight: "none",
  textAlign: "left",
  backgroundColor: "#fff",
}
const numericalSectionHeader = {
  textAlign: "right",
  fontWeight: '550',
  backgroundColor: "#fff",
};

const totalLineDesc = {
  fontWeight: "bold",
  fontFamily: "Arial",
  borderBottom: "1px solid #fefefe",
  borderRight: "1px solid #fefefe",
  textAlign: "left",
  paddingTop: "5px",
  paddingBottom: "5px",
  backgroundColor: "#fff",
};

const totalLineDetail = {
  fontWeight: "bold",
  fontFamily: "Arial",
  textAlign: "right",
  paddingTop: "5px",
  paddingBottom: "5px",
  backgroundColor: "#fff",
};

const tableStyle = {
  borderCollapse: "collapse",
  margin: "auto",
  fontFamily: "Arial",
  overflow: "hidden",
  'overflow-y': 'auto'
};

const numericalHeader = {
  fontWeight: 500,
  color: "#000000",
  backgroundColor: "#F6F6F6",
  borderBottom: "1px solid #F6F6F6",
  borderCollapse: "collapse",
  borderRight: '1px solid #F6F6F6',
  paddingTop: "15px",
  paddingBottom: "15px",
  textAlign: "right",
  fontWeight: 'bold',
  cursor: 'pointer'
};

const categoricalHeader = {
  fontWeight: '500',
  color: "#000000",
  backgroundColor: "#F6F6F6",
  borderBottom: "1px solid #F6F6F6",
  borderCollapse: "collapse",
  borderRight: '1px solid #F6F6F6',
  paddingTop: "15px",
  paddingBottom: "15px",
  textAlign: "left",
  fontWeight: 'bold',
  cursor: 'pointer',
};

const textColumn = {
  fontWeight: '500',
  borderBottom: "1px solid #fefefe",
  borderRight: "none",
  textAlign: "left",
  backgroundColor: "#fff",
}
const numericalColumn = {
  textAlign: "right",
  backgroundColor: "#fff",
};

const subTableHeader = {
  backgroundColor: "#F3F3F3"
}

const sticky = {
  top: '0',
  position: 'sticky'
}
export default Tester;