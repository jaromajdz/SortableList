import React, { Component } from 'react';
import './App.css';


import MoveBoxes from './components/MoveBox/MoveBoxes';


class App extends Component {

	render() {
		return (
			<div className='App'>
        			<MoveBoxes/>
			</div>
		)
	}
}

export default App;
