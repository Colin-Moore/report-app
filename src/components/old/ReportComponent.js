import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReportComponent() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const FOLDER = 'temp'; // Replace with your folder name
    const FILENAME = 'dlysls3.csv'; //
    // Fetch the report data from the Node.js server
 axios.get(`http://localhost:4444/report/${FOLDER}/${FILENAME}`)
 .then((response) => {
    // Assuming the response contains the report data as JSON
    setReport(response.data);
  })
      .catch((error) => console.error('Error fetching report:', error));
  }, []);

  return (
    <div>
      <h1>Report</h1>
      {report ? (
        report.sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2>{section.name}</h2>
            {section.subsections.map((subsection, subsectionIndex) => (
              <div key={subsectionIndex}>
                <h3>{subsection.name}</h3>
                
              </div>
            ))}
            <h2>{report.total}</h2>
          </div>
        ))
      ) : (
        <p>Loading report data...</p>
      )}
    </div>
  );
}

export default ReportComponent;




/*
   // console.log(this.state.sections)
        // for(let i = 0; i < csvText.sections.length; i++){
        //     let sec = [];
        //     sec.push(csvText.sections[i].name[0] )
        //     for(let j = 0; j < csvText.sections[i].data.length; j++){
        //         sec.push( csvText.sections[i].data[j] )
        //     }
        //     sec.push( csvText.sections[i].sectiontotal[0] )
        //     sectionData.push(sec);
        // }

        // if(divider.length > 0){
        //     const dividers = divider[0].filter(value => value.length > 2);
        //     if(dividers.length > 0){
        //         this.setState({dividers: dividers})
        //     }
        // }
        // for(let i = 0; i < totals.length; i++){
        //     const tots = []
        //     const tot = totals[i];
        //     if (tot.length === headers.length) {
        //         const row = {};
        //         for (let j = 0; j < headers.length; j++) {
        //             row[headers[j]] = tot[j].replace(/['"]+/g, '');
        //         }
        //         tots.push(row);  
        //     }
        //     parsedTotal.push(tots);
        // }
        // this.setState({total: parsedTotal})

        // for (let i = 0; i < sectionData.length; i++) {
        //     const currentLine = sectionData[i];
        //     const section = [];
        //     for(let j = 0; j < currentLine.length - 1; j++){
        //         const newLine = currentLine[j];
        //         if(newLine.length === headers.length){
        //             const row = {}
        //             // console.log(newLine)
        //             for(let x = 0; x < newLine.length; x++){
        //                 row[headers[x]] = newLine[x].replace(/['"]+/g, '');
        //             }
        //             section.push(row)
        //         }
        //         // if (newLine.length === headers.length) {
        //         //     const row = {};
        //         //     // for (let x = 0; x < headers.length; x++) {
        //         //     //     row[headers[x]] = newLine[x].replace(/['"]+/g, '');
        //         //     // }
        //         //     section.push(row);   
        //         // }
        //     }
        //     parsedData.push(section)
        // }
        // this.setState({csvData: parsedData}); 
 */