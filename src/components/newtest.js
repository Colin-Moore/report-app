import React, { useEffect, useState } from 'react';
// Import necessary components

const Newtest = () => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Fetch report data from your server endpoint
    fetch(`http://localhost:4444/test/temp/cust.csv`)
      .then((response) => response.json())
      .then((data) => setReportData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const renderSections = (sections) => {
    return sections.subsections.map((section, index) => (
      <div key={index}>
        {/* Render section details */}
        <h2>{section.key}</h2>
        {/* Render other section attributes here */}

        {/* Render subsections if present */}
        {section.subsections && renderSubsections(section.subsections)}
      </div>
    ));
  };

  const renderSubsections = (subsections) => {
    return subsections.map((subsection, index) => (
      <div key={index}>
        {/* Render subsection details */}
        <h3>{subsection.key}</h3>
        {/* Render other subsection attributes here */}

        {/* Recursive call if subsections have further subsections */}
        {subsection.subsections && renderSubsections(subsection.subsections)}
      </div>
    ));
  };

  return (
    <div>
      <h1>Generated Report</h1>
      {reportData ? (
        <div>
          {/* Render report details */}
          {/* e.g., reportData.title, reportData.date, etc. */}

          {/* Render report sections */}
          {renderSections(reportData.sections)}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Newtest;