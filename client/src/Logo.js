import React, { Component} from "react";


class Logo extends Component {

  constructor(props) {
    super(props);

  }

  render () {
    return (
      <svg xmlns="http://www.w3.org/2000/svg">

        <path d="M100,100 L100,150   A50,50 0 0,0 150,100    z" className="logo-j" />

         <path d="M100,50  L150,50 150,100    "
          className="logo-j" />

        <path d="M100,50 150,50  150,100 100,100  z"
          className="logo-j" />

         <path d="M100,150  A50,50 0 0,0 150,100    "
          className="logo-j logo-outline" />

        <path d="M97,50  L150,50 150,100    "
          className="logo-j logo-outline" />

        <path d="M100,50  L50,150 100,150    "
          className="logo-a" />
        <path d="M98,47.5  L50,150 100,150    "
          className="logo-a logo-outline" />
        <path d="M93.5,50  L100,50    "
          className="logo-outline" />
      </svg>

    );
  }
}
export default Logo;
