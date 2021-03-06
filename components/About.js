const about = document.createElement("template");

about.innerHTML = `
<style>
*{
	margin : 0;
	padding : 0;
}

.background {
	width : 100%;
	background : var(--alt-transparency);
	height : 100%;
	display : flex;
	flex-direction : column;
	align-items : center;
	justify-content : center;
 scroll-snap-align: start;
}

.container {
	max-width: 50% ; 
	min-width: 300px ; 
	height: 70%;
	overflow : auto;
}

.heading {
  font-family: "Noto Serif Display", serif;
	text-align : center;
	font-weight : lighter;
	color : var(--pink);
	padding-bottom : 5%;
}

.container p {
	font-size : 1.2rem;		
	padding-top : 10%;
}

.container p a {
	font-size : 1.3rem;		
	text-decoration : none;
	color : var(--pink)
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
    <h1 class='heading'>About Me</h1>
	<div class='container'>
    <p>
		 I really like to play with computers. You may find me
     making some game or maybe some cli or playing with some really old
     software from 90's. I really like reading books and interacting
     with people (sometimes). 
		 <br/>
		 <br/>
		 <br/>
		 I started when I was 14 and back then I didn't do any cool stuff.
		 I remember vaguely trying to make games in lua. But I was unable to 
		 figure out lot of stuff. Then I discovered python and the world of
		 web-dev.  
		 <br/>
		 <br/>
		 <br/>
		 And I am still learning... :)
    </p>
    <div class="links">
		  <a href="#Main">Home</a> / <a href="#Projects">Next</a>
    </div>
	</div>
</div>
`;

class About extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(about.content.cloneNode(true));
  }
}

window.customElements.define("about-section", About);
