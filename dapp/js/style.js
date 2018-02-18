var hue = new Lux(200);
var sat = new Lux(100);
var lit = new Lux(81);

var ss_style = new Tilux({
		f: {
			id: 'ss-style',
			darkest: ()=>{return  `hsl(${hue.value}, ${sat.value + (100 - sat.value) * 0.1}%, ${lit.value * 0.3}%)`},
			dark: ()=>{return  `hsl(${hue.value}, ${sat.value + (100 - sat.value) * 0.05}%, ${lit.value * 0.7}%)`},
			base: ()=>{return `hsl(${hue.value}, ${sat.value}%, ${lit.value}%)`},
			light: ()=>{return  `hsl(${hue.value}, ${sat.value - sat.value * 0.05}%, ${lit.value + (100 - lit.value) * 0.3}%)`},
			lightest: ()=>{return  `hsl(${hue.value}, ${sat.value - sat.value * 0.1}%, ${lit.value + (100 - lit.value) * 0.9}%)`},
			compliment: ()=>{return  `hsl(${(hue.value + 180) % 360}, ${sat.value}%, ${lit.value}%)`},
			trans: `0.20s`,
		},

		w: `
		<style id="{$@id}">

			* {
				box-sizing: border-box;
			}

			html {
			    height: 100%;
			}

			body, .body {
			    margin: 0px;
			    padding: 0px;
			    font-size: 16px;
				font-family: Roboto, sans-serif;
				min-height: 100%;
			    transition-duration: {$@trans};
			}


			div {
			}

			h1 {
				color: {$@base()};
			}

			h3 {
				font-weight: 300;
			}

			.container {
				display: grid;
				min-height: 100%;
				grid-template-rows: 64px 32px auto 64px;
				grid-template-columns: 1fr auto;
				grid-template-areas:
					"banner accounts accounts"
					"path path path"
					"contract contract contract"
					"footer footer footer"
			}

			.item {

			}

			.banner {
				grid-area: banner;
				color: {$@lightest()};
				background-color: {$@darkest()};
			}

			.accounts {
				grid-area: accounts;
				color: {$@lightest()};
				background-color: {$@darkest()};
			}

			.navpath {
				grid-area: path;
				font-size: 1em;
				color: {$@darkest()};
				background-color: {$@compliment()};
				text-transform: uppercase;
				box-shadow: 0px 1px 5px -1px {$@darkest()} inset;				
			}

			.contract {
				grid-area: contract;
			    color: {$@darkest()};
			    background-color: {$@light()};
				// border-bottom: 6px solid {$@compliment()};
			    min-height: 100%;
				font-size: 1.0em;
			}

			.footer {
				grid-area: footer;
				display: grid;
				color: {$@lightest()};
				background-color: {$@darkest()};
				grid-template-rows: auto;
				grid-template-columns: auto auto auto;
				grid-template-areas:
					"net mid soclinks"
			}

			.net {
				grid-area: net;
				font-size: 0.8rem;
			}

			.soc {
				grid-area: soclinks;
				font-size: 1.6rem;
			}
			
			.path-item {
				display: inline-block;
				padding: 8px;
				cursor: pointer;

			}
			.path-item:hover {
				color: {$@lightest()};
				background-color: {$@base()};
				box-shadow: 0px 1.5px 5px {$@darkest()};				
			}

			.path-item + .active {
				color: {$@darkest()};
				background-color: {$@light()};
				box-shadow: 0px 1.5px 5px {$@darkest()};
				text-shadow: 0.5px 0.5px 2px {$@lightest()};				
			}

			.path-item:checked {
				color: {$@lightest()};
				background-color: {$@light()};
				box-shadow: 0px 1.5px 5px {$@darkest()};				
			}

			a:link {
				text-decoration: none;
				// color: {$@dark};
			}

			a:hover {
				text-shadow: 0px 0px 2px {$@base()};	
			}

			a:active {

			}

			.regbase-adv {
				display: grid;
				margin: 16px;
				grid-template-rows: 1.6em 1.2em 1.2em auto;
				grid-template-columns: 70px 350px auto;
				grid-template-areas:
					"idicon title title"
					"idicon addr bal"
					"idicon owner bal"
					"ext ext ext"
			}

			.acc-bal {

			}

			.rb-idicon {
				grid-area: idicon;
			}

			.rb-title {
				grid-area: title;
			}

			.rb-regname {
				color: {$@darkest()};
				font-size: 1.4em;
				text-transform: uppercase;
				text-shadow: 0.5px 0.5px 2px {$@dark()};			
			}

			.rb-regname-sml {
				color: {$@darkest()};
				font-size: 1.0em;
				text-transform: uppercase;
				text-shadow: 0.5px 0.5px 2px {$@dark()};			
			}

			.rb-version {
				justify-self: end;
				font-size: 1.2em;
			}

			.rb-version-sml {
				justify-self: end;
				font-size: 0.8em;
			}

			.rb-addr {
				grid-area: addr;
			}

			.rb-owner {
				grid-area: owner;
			}

			.rb-bal {
				grid-area: bal;
				font-size: 1.6em;
			}

			.rb-ext {
				grid-area: ext;
			}

			.layer {
				border-width: 0 0 4px 0;
				border-style: solid;
				border-color: {$@compliment()};
				// border: 4px solid {$@compliment()};
				box-shadow: 0px 3px 5px -1.5px {$@darkest()};				
				padding: 13px 15.6px;
			}

			.inline {
				display: inline-block;
			}

			.darkest {
				color: {$@darkest()};
			}

			.dark {
				color: {$@darkest()};
			}

			.base {
				color: {$@base()};
			}

			.light {
				color: {$@light()};
			}

			.lightest {
				color: {$@lightest()};
			}

			.compliment {
				color: {$@compliment()};
			}

			ul, ol,
			.ss-list {
				list-style: none;
			}

			.mono,
			.ss-addr
			{
				font-family: monospace;
			}

			.ss-addr {
				font-size: 0.8em;
			}

			.upper {
				text-transform: uppercase;
			}

			select,
			option,
			ss-select
			{
				color: {$@darkest()};
			    background-color: {$@light()};
			    transition-duration: {$@trans};
			}

			button,
			input,
			.ss-button,
			.ss-input,
			.ss-select
			{
				cursor: pointer;
				border-radius: 4px;
				border-color: {$@lightest()};
				border-width: 1.4px;
				border-style: solid;
				background-color: {$@light()};
				padding: 13px 15.6px;
				margin: 9px;
			    transition-duration: 0.3s;
			}

			button,
			.ss-button
			{
				color: {$@darkest()};
				text-transform: uppercase;
			}

			.ss-input,
			.ss-select
			{
				display: inline-block;
			}

			input,
			select,
			textarea
			{
				color: {$@darkest()};
				background-color: {$@light()};
				box-shadow: 0.5px 0.5px 5px {$@darkest()} inset;
				width: 300px
			}

			input:hover,
			select:hover,
			textarea:hover,
			input:focus,
			select:focus
			{
				border-color: {$@light()};
				border-width: 1.4px;
				border-style: solid;
				background-color: {$@base()};
				box-shadow: 0.5px 0.5px 2px {$@darkest()} inset;
			}

			button:hover,
			.ss-button:hover
			{
				border-color: {$@light()};
			    background-color: {$@base()};
				box-shadow: 0.5px 0.5px 5px {$@darkest()};	
			}

			.ss-flex-container {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
				flex-direction: column;
			}

			.ss-flex {
				display: inline-flex;
			}

			.idicon,
			.idicon-sml {
				display: inline-block;
				border-width: 2.2px;
				border-color: {$@lightest()};
				border-style: solid;
				border-radius: 100%;
				width: auto;
			}

			.idicon-sml {
				border-width: 1.6px;
			}

			button + input,
			select + input
			{
				display: inline-block;
			}

			.kaddr:before {
				font-family: FontAwesome;
				
			}
		</style>
		`,
	}
)


console.log("ran style.js");
