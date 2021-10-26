const header = document.createElement("template");

header.innerHTML = `
<style>
  * {
    margin : 0;
    padding : 0;
  }

  .container {
    background : var(--background);
    width : 100%;
    height : 100%;
    display : flex; 
    flex-direction : column;
    justify-content : center;
    align-items : center;
  }

  h1 {
	  text-align: center;
    color : var(--green);
    font-weight : lighter;
    font-family: "Noto Serif Display", serif;
    font-size : 2.4rem;
    display : block;
    width : 100%;
  }

  h5 {
	  text-align: center;
    color : var(--cream);
    padding-top: 1%;
    font-weight : lighter;
    font-size : 1.2rem;
    display : block;
    width : 100%;
  }

  .link-container{
    padding-top : 1%;
    width :  100%;
    display : flex; 
    align-items : center;
    justify-content : center;
    overflow : hidden;
   }

  .link-container a {
    text-decoration : none;
    color : var(--pink);
    font-size : 1.1rem;
    padding : 1%;
  }
</style>

<div class='container'>
  <h1><slot name="header"/></h1>
  <h5><slot name="subtitle"/></h5>
  <div class='link-container'>
    <a href="#About"> About Me</a> 
    <a href="#Projects"> Projects</a> 
    <a href="#Contact"> Contact Me</a>
  </div>
</div>
`;

class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(header.content.cloneNode(true));
  }

  connectedCallback() {
    // TODO: Simple animation
  }
}

window.customElements.define("logo-header", Header);
