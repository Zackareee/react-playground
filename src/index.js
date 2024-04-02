import React from "react";
import client from "react-dom/client";
import ReactDOM from 'react-dom'
import "./styles.css";

import { Game } from "./App";

ReactDOM.render(
    <React.StrictMode>
        <Game />
    </React.StrictMode>, document.getElementById("root")
)

