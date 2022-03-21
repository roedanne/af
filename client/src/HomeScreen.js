import React, { Component} from "react";

import styles from './App.css';
import Logo from './logo.js';

import axios from 'axios';
import background from './snickare.png';

class HomeScreen extends Component {

  constructor(props) {
    super(props);

    this.changeColors = this.changeColors.bind(this);

    this.inputRef = React.createRef();
    this.unisonLabelRef = React.createRef();
    this.whiteHeaderRef = React.createRef();
  }

  componentDidMount() {
  }

  changeColors() {

    let value = this.inputRef.current.value;
    let colors = ['#' + value.substring(0, 6), '#' + value.substring(6, 12), '#' + value.substring(12, 18), '#' + value.substring(18, 24)];

  	let elements = document.getElementsByClassName('logo-a'); // get all elements
    let color = colors[Math.floor(Math.random() * 4)];
    for(var i = 0; i < elements.length; i++){
  		elements[i].style.fill = color;
  	}

    elements = document.getElementsByClassName('logo-j'); // get all elements
    color = colors[Math.floor(Math.random() * 4)];
    for(var i = 0; i < elements.length; i++){
  		elements[i].style.fill = color;
  	}

    elements = document.getElementsByClassName('logo-outline'); // get all elements
    color = colors[Math.floor(Math.random() * 4)];
    for(var i = 0; i < elements.length; i++){
  		elements[i].style.stroke = color;
  	}

    let headerColor = "#FFFFFF";
    elements = document.getElementsByTagName('header'); // get all elements
    if (!this.whiteHeaderRef.current.checked) {
      headerColor = colors[Math.floor(Math.random() * 4)];
    }
    elements[0].style.backgroundColor = headerColor;

    elements = document.getElementsByClassName('alla'); // get all elements
    color = headerColor;
    while (color === headerColor) {
      color = colors[Math.floor(Math.random() * 4)];
    }
    for(var i = 0; i < elements.length; i++){
      elements[i].style.color = color;
    }

    elements = document.getElementsByClassName('jobb'); // get all elements
    if (!this.unisonLabelRef.current.checked) {
      color = headerColor;
      while (color === headerColor) {
        color = colors[Math.floor(Math.random() * 4)];
      }
    }
    for(var i = 0; i < elements.length; i++){
  		elements[i].style.color = color;
  	}

    elements = document.getElementsByClassName('header-links'); // get all elements
    color = colors[Math.floor(Math.random() * 4)];
    elements[0].style.backgroundColor = color;

  }

  render () {
      return (
        <div className='App'>
          <header>
            <Logo />
            <div class="label">
              <span class="alla">alla</span>
              <span class="jobb">jobb</span>
            </div>

            <div className="header-links">
              <a>Arbetstagare</a>
              <a>Arbetsgivare</a>
              <a>Företag</a>
            </div>

          </header>
          <main style={{ backgroundImage: `url(${background})` }}>

            <input ref={this.inputRef} />

            <button onClick={this.changeColors}>Go</button>

            <br />
            <input ref={this.whiteHeaderRef} type='checkbox' value='White header' />
            <span>White header</span>
            <br/>
            <input ref={this.unisonLabelRef} type='checkbox' value='One color label' />
            <span>One color label</span>

          <div className="centerBox">
            <div className="checkBox">
              <div>
                <img src='./select.png' />
              </div>
              <div>
                Snabbt, enkelt och billigt!
              </div>
            </div>
            <div className="checkBox">
              <div>
                <img src='./select.png' />
              </div>
              <div>
                Hitta allt arbete!
              </div>
            </div>
            <div className="checkBox">
              <div>
                <img src='./select.png' />
              </div>
              <div>
                Nåt annat bra!
              </div>
            </div>
          </div>
             <p>
                dasdkas
               dasldaskdlaskd
               al
             </p>
                 <p>
                dasdkas
               dasldaskdlaskd
               al
             </p>
                 <p>
                dasdkas
               dasldaskdlaskd
               al
             </p>
                 <p>
                dasdkas
               dasldaskdlaskd
               al
             </p>
                 <p>
                dasdkas
               dasldaskdlaskd
               al
             </p>
                 <p>
                dasdkas
               dasldaskdlaskd
               al
             </p>
                 <p>
                dasdkas
               dasldaskdlaskd
               al
             </p>
          </main>
        </div>
      );
    }
}


export default HomeScreen;
