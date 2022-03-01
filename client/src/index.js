import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ProductsScreen from './ProductsScreen.js';

class RootApp extends React.Component {

	render() {
		return (

			<div>

				<ProductsScreen />

			</div>

		);
	}

}

ReactDOM.render(<RootApp />, document.getElementById("root"));
