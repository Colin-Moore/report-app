// import React from 'react';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Data from './components/data'; 
// import CSVData from './components/CSVData';
// import EnhancedReport from './components/EnhancedReport';
// import ReportComponent from './components/ReportComponent';
// import DocumentView from './components/DocumentView';
// function App() {
//   return (

//       <Routes>
//         <Route path="/report/:folder/:filename" element={<EnhancedReport/>}/>
//         <Route path="/printerfriendly" element={<PrinterFriendly/>}/>
//       </Routes>
//   );
// }
 
// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EnhancedReport from './components/EnhancedReport';
import { Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/report/:folder/:filename" element={<EnhancedReport />}/>

        {/* Add other routes if needed */}
        {/* <Route exact path="/other-route"> <OtherComponent /> </Route> */}
        {/* Handle 404 - Page Not Found */}
        {/* <Route path="*"> <NotFound /> </Route> */}
      </Routes>
    </Router>
  );
};

export default App;