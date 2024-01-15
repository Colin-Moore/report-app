import React from "react";

const TextData = ({ data }) => {
    return(
       <>
            {data.map((line, index) => (
                <p key={index}>
                    {line}
                </p>
            ))}
       </>
    )
}

export default TextData; 