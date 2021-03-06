const header = document.createElement("template");

header.innerHTML = `
<style>
  * {
    margin : 0;
    padding : 0;
  }

  .container {
    width : 100%;
    background : var(--transparency);
    height : 100%;
    scroll-snap-align: start;
  }

  .content {
    display : flex; 
    width : 100%;
    height : 100%;
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
    transition: 0.3s;
    transform : translateY(-10) 
  }

  .fade-in{
   transition: 0.3s;
   transform : translateY(0) 
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
    font-size : 1rem;
    padding : 1%;
  }

@media only screen and (max-width: 900px) {
  .link-container {
    flex-direction : column;
  }

  .link-container a {
    padding-top : 3%;
    text-decoration : none;
    color : var(--pink);
    font-size : 0.8rem;
    padding-top : 2%;
  }
}

</style>

<div class='container'>
 <div class='content'>
  <h1 id='name'><slot name="header"/></h1>
  <h5><slot name="subtitle"/></h5>
  <div class='link-container'>
    <a href="#About"> About Me</a> 
    <a href="#Projects"> Projects</a> 
    <a href="#Contact"> Contact Me</a>
    <a href="https://ps173.github.io/personal-website"> Creative Portfolio </a> 
    <a href="./assets/resume.pdf"> CV </a> 
  </div>
 </div>
</div>
`;

class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(header.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector(".content");
  }

  connectedCallback() {
    const containerAnimation = [
      { transform: "translateY(-30%)", opacity: 0 },
      { transform: "translateY(-15%)", opacity: 0.5 },
      { transform: "translateY(0)", opacity: 1 },
    ];
    this.container.animate(containerAnimation, {
      duration: 700,
      iterations: 1,
      easing: "ease-in-out",
    });
  }
}

window.customElements.define("logo-header", Header);
