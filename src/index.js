import React from "react"
import ReactDom from "react-dom"
import App from './components/app/App'

import './style/style.scss'

ReactDom.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)

