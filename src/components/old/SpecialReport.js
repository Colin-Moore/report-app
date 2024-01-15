import React, { useState } from "react";
import axios from "axios";
import useTable from "./useTable";
import Footer from "./Footer/Footer";

const SpecialReport = ({ divider, data, rowsPerPage }) => {
  let headers = data.length > 0 ? Object.keys(data[0]) : [];
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  const dividerWidth = Math.round(headers.length / divider.length,0);

  return (
    <>
      {data.length === 0 ? (
        <p style={tableStyle}>No data available.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            {divider.length > 0 ? 
            <tr>
              {divider.map((div, index) => (
                <th colspan={dividerWidth} scope="colgroup">{div}</th>
              ))}
            </tr>
            : <div></div>}
            <tr>
              {headers.map((header, index) => (
                <th key={index} style={ index > 0 ? tableHeaderStyle : descriptionHeader }>
                  {index > 0 && divider.length > 0 ? 
                  header.substring(0, header.length -1) : header} 
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, index) => (
              <tr key={index} >
                {headers.map((header, columnIndex) => (
                  <td key={columnIndex} style={ columnIndex > 0 ? tableCellStyle : descriptionColumn}>
                    {columnIndex > 0 ? parseFloat(row[header]).toFixed(2) : row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>        
      )}
      <Footer range={range} slice={slice} setPage={setPage} page={page}/>
    </>
  );
};


const tableStyle = {
  borderCollapse: "collapse",
  margin: "auto",
  width: "80%",
  border: "1px solid #000",
  borderRadius: "10px",
  fontFamily: "Arial",
  overflow: "hidden",
  boxShadow: "40px 90px 55px -20px rgba(155, 184, 243, 0.2)",
};

const tableHeaderStyle = {
  fontSize: "12px",
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
  fontSize: "12px",
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
  fontSize: "12px",
  fontWeight: 500,
  borderBottom: "1px solid #fefefe",
  borderRight: "1px solid #fefefe",
  textAlign: "left",
  padding: "5px",
  backgroundColor: "#fff",
}
const tableCellStyle = {
  fontSize: "12px",
  textAlign: "right",
  padding: "5px",
  backgroundColor: "#fff",
};

export default SpecialReport;

// const tableStyle = {
//     borderCollapse: "collapse",
//     width: "100%",
//     borderRadius: "10px",
//     overflow: "hidden",
//     boxShadow: "40px 90px 55px -20px rgba(155, 184, 243, 0.2)",
//   };

//   const brStyle = {
//     padding: '5px'
//   };
  
//   const tableHeaderStyle = {
//     fontSize: "10px",
//     fontWeight: 500,
//     color: "#000000",
//     backgroundColor: "#DEDEDE",
//     borderRight: "1px solid #AAA",
//     borderBottom: "1px solid #ddd",
//     textAlign: 'left',
//     padding: "5px",
//   };
  
//   const tableHeaderStyle2 = {
//     fontSize: "10px",
//     fontWeight: 500,
//     color: "#000000",
//     backgroundColor: "#DEDEDE",
//     textAlign: 'left',
//     'padding-left': '30px',
//     padding: "5px",
//   };

//   const tableCellStyle = {
//     fontSize: "10px",
//     'font-family': "Arial",
//     fontWeight: 250,
//     textAlign: 'left',
//     color: '#555555',
//     borderBottom: "1px solid #ddd",
//     borderRight: "1px solid #ddd",
//     padding: "8px",
//     backgroundColor: "#fff",
//   };

//   const tableCellStyle2 = {
//     fontSize: "10px",
//     textAlign: "right",
//     'font-family': "Arial",
//     fontWeight: 250,
//     color: '#555555',
//     textAlign:'right',
//     'padding-top': '5px',
//     'padding-left': '30px',
//     backgroundColor: "#fff",
//   };
  
// export default CSVDataTable;