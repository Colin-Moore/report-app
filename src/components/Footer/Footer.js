import React, { useEffect } from "react";
// import styles from "./TableFooter.module.css";

const Footer = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }    
  }, [slice, page, setPage]);

  const FirstPage = (() => {
    setPage(1);
  });

  const LastPage = (() => {
    setPage(range);
  });

  const NextPage = (() => {
      setPage(page + 1);
  });

  const PrevPage = (() => {
    if(page > 1){
      setPage(page - 1);
    }
  });


  return (
    <div style={buttonArea}>
      <button style={buttonStyle} onClick={() => FirstPage()}>First Page</button>
      <button style={buttonStyle} onClick={() => PrevPage()}>Previous Page</button>
      <button style={buttonStyle} onClick={() => NextPage()}>Next Page</button>
      <button style={buttonStyle} onClick={() => LastPage()}>Last Page</button>

    </div>
  );
};

export default Footer;

const buttonArea = {
  marginLeft: "40%",
  marginTop: "10px"
};

const buttonStyle = {
  backgroundColor: "#6D95E0",
  fontSize: "14pt",
  color: "#FEFEFE",
  padding: "10px",
  borderRadius: "5px",
  margin: "10px"
};