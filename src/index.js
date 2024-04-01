import React from "react";
import client from "react-dom/client";
import ReactDOM from 'react-dom'
import "./styles.css";

import { Board } from "./App";

ReactDOM.render(
    <React.StrictMode>
        <Board />
    </React.StrictMode>, document.getElementById("root")
)

