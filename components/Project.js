const projects = document.createElement("template");

projects.innerHTML = `
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
	height: 90%;
  overflow : auto;
}

.container p {
  font-size : 1.1rem;
}

.heading {
	text-align : center;
	color : var(--pink);
  font-family: "Noto Serif Display", serif;
  font-weight : lighter;
  padding-bottom : 2%;
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
</style>

<div class='background'>
  <div class='container'>
    <h1 class="heading">Projects</h1>
      <p>
        I generally work with web technologies which include working 
        with typescript, golang, scss(css) and frameworks like react or svelte.
        Ilike using lua for game-development with love2d framework.

        Some projects that I have worked on are : 
        <slot name="project-list"/>
      </p>
      <div class="links">
		    <a href="#Main">Go Back</a> / <a href="#Contact">Next</a>
      </div>
  </div>
</div>
`;

class Projects extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(projects.content.cloneNode(true));
  }

  connectedCallback() {
    // TODO: Simple animation
  }
}

window.customElements.define("project-section", Projects);
