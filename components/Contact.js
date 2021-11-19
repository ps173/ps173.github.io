const contact = document.createElement("template");

contact.innerHTML = `
<style>
*{
	margin : 0;
	padding : 0;
}

.background {
	width : 100%;
	height : 100%;
  background : var(--alt-transparency);
	display : flex;
  flex-direction : column;
	align-items : center;
	justify-content : center;
}

.container {
	max-width: 50% ; 
	min-width: 300px; 
	height: 80%;
  overflow : auto;
}

.heading {
	text-align : center;
	color : var(--pink);
  font-family: "Noto Serif Display", serif;
  font-weight : lighter;
  padding-bottom : 5%;
  padding-top : 2%;
}

.container p {
  font-size : 1.2rem;
}

.container .links a {
	font-size : 1.3rem;		
	text-decoration : none;
	color : var(--pink)
}

.container .links{
  padding-top : 3%;
  text-align: center;
  width : 100%;
}

@media only screen and (max-width: 900px) {
   .container p {
      font-size : 1rem;
   }
   .container .links{
      padding-top : 5%;
      padding-bottom : 5%;
   }
}
</style>

<div class='background'>
    <h1 class="heading">Contact Me</h1>
  <div class='container'>
      <p>
       You can Connect with me :
				<slot name="contact-info"/>  
      </p>
      <div class="links">
		    <a href="#Main">Home</a>
      </div>
  </div>
</div>
`;

class Contact extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(contact.content.cloneNode(true));
  }
}

window.customElements.define("contact-section", Contact);
