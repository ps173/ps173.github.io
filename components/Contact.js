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
	background : var(--alt-background);
	display : flex;
	align-items : center;
	justify-content : center;
}

.container {
	max-width: 50% ; 
	min-width: 500px ; 
	height: 80%;
  overflow : auto;
}

.heading {
	text-align : center;
	color : var(--pink);
  font-family: "Noto Serif Display", serif;
  padding-bottom : 5%;
}

.container p {
  font-size : 1.2rem;
}
</style>

<div class='background'>
  <div class='container'>
    <h1 class="heading">Contact Me</h1>
      <p>
       You can Connect with me :
				<slot name="contact-info"/>  
      </p>
  </div>
</div>
`;

class Contact extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(contact.content.cloneNode(true));
  }

  connectedCallback() {
    // TODO: Simple animation
  }
}

window.customElements.define("contact-section", Contact);
