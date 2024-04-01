import React, { StrictMode } from "react";
import client from "react-dom/client";
import ReactDOM from 'react-dom'
import "./styles.css";

import App from "./App";

ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>, document.getElementById("root")
)

