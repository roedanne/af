import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import HomeScreen from './HomeScreen.js';

class RootApp extends React.Component {

	render() {
		return (

			<HomeScreen />

		);
	}

}

ReactDOM.render(<RootApp />, document.getElementById("root"));
