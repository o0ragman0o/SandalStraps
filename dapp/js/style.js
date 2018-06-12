var hue = new Lux(200);
var sat = new Lux(100);
var lit = new Lux(81);

var ss_style = new Tilux({
		f: {
			id: 'ss-style',
			get darkest() {return  `hsl(${hue.value}, ${sat.value + (100 - sat.value) * 0.1}%, ${lit.value * 0.3}%)`},
			get dark() {return  `hsl(${hue.value}, ${sat.value + (100 - sat.value) * 0.05}%, ${lit.value * 0.7}%)`},
			get base() {return `hsl(${hue.value}, ${sat.value}%, ${lit.value}%)`},
			get light() {return  `hsl(${hue.value}, ${sat.value - sat.value * 0.05}%, ${lit.value + (100 - lit.value) * 0.3}%)`},
			get lightest() {return  `hsl(${hue.value}, ${sat.value - sat.value * 0.1}%, ${lit.value + (100 - lit.value) * 0.9}%)`},
			get compliment() {return  `hsl(${(hue.value + 180) % 360}, ${sat.value}%, ${lit.value}%)`},
			trans: `0.20s`,
		},

		w: `
		<style id="{$@id}">

			* {
				box-sizing: border-box;
			}

			html {
			    height: 100%;
			    width: 100%;
			}

			body, .body {
			    margin: 0px;
			    padding: 0px;
			    font-size: 16px;
				font-family: Roboto, sans-serif;
				height: 100%;
				width: 100%;
			    transition-duration: {$@trans};
				background-color: {$@compliment};
			}

			article {
			    height: 100%;
			    display: grid;
			    grid-template-rows: 64px 1fr 64px;
			    grid-template-columns: 100%;
			}

			div {
			}

			h1 {
				color: {$@base};
			}

			h3 {
				font-weight: 300;
			}

			label {
				display: inline-block;
				width: 130px;
			}

			.row {
				display: grid;
				grid-auto-flow: column;
				justify-items: stretch;
			}

			.column {
				display: grid;
				grid-auto-flow: row;
				justify-items: center;
			}

			.as-start {
				align-self: start;
			}
			
			.as-center {
				align-self: center;
			}
			
			.as-end {
				align-self: end;
			}
			
			.js-start {
				justify-self: start;
			}

			.js-stretch {
				justify-self: stretch;
			}

			.js-center {
				justify-self: center;
			}

			.js-end {
				justify-self: end;
			}

			.layout {
				height: 100%
				display: grid;
				grid-template-rows: 64px 1fr 64px;
			}

			.banner {
				position: sticky;
				top: 0px;
				background-color: {$@darkest};
				color: {$@lightest};
			}


			.main{
				width: 90%;
				max-width: 1310px;
				height: 100%;
			}

			.nav-tree {
				font-size: 0.8em;
				color: {$@darkest};
				text-transform: uppercase;
			}

			.nav-path {
				font-size: 1em;
				position: sticky;
				top: 64px;
				color: {$@darkest};
				text-transform: uppercase;
				background-color: {$@compliment};
			}

			.contract {
			    color: {$@darkest};
			    background-color: {$@light};
				font-size: 1.0em;
				box-shadow: 0px 0px 5px -1px {$@darkest};
				height: calc(100% - (16px + 1em));
				overflow: auto;
			}

			.footer-row {
				display: grid;
				position: sticky;
				bottom: 0px; 
				grid-auto-flow: column;
				color: {$@lightest};
				background-color: {$@darkest};
			}

			.net {
				font-size: 0.8rem;
			}

			.soc {
				font-size: 1.6rem;
			}
			
			.path-item {
				display: inline-block;
				padding: 8px;
				cursor: pointer;
			}

			.path-item:hover {
				color: {$@lightest};
				background-color: {$@base};
				box-shadow: 0px -3px 3px{$@darkest};
			}

			.path-item + .active {
				color: {$@darkest};
				background-color: {$@light};
				box-shadow: 0px -3px 3px {$@darkest};
				text-shadow: 0.5px 0.5px 2px {$@lightest};
			}

			a:link {
				text-decoration: none;
			}

			a:hover {
				text-shadow: 0px 0px 2px {$@base};	
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

			.rb-idicon {
				grid-area: idicon;
			}

			.rb-title {
				grid-area: title;
			}

			.rb-regname {
				color: {$@darkest};
				font-size: 1.4em;
				text-transform: uppercase;
				text-shadow: 0.5px 0.5px 2px {$@dark};			
			}

			.rb-regname-sml {
				color: {$@darkest};
				font-size: 1.0em;
				text-transform: uppercase;
				text-shadow: 0.5px 0.5px 2px {$@dark};			
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
				border-color: {$@compliment};
				box-shadow: 0px 0px 5px -1px {$@darkest};
				padding: 13px 15.6px;
			}

			.inline {
				display: inline-block;
			}

			.darkest {
				color: {$@darkest};
			}

			.dark {
				color: {$@darkest};
			}

			.base {
				color: {$@base};
			}

			.light {
				color: {$@light};
			}

			.lightest {
				color: {$@lightest};
			}

			.compliment {
				color: {$@compliment};
			}

			ul, ol,
			.ss-list {
				list-style: none;
			}

			.fs08 {
				font-size: 0.8rem;
			}

			.fs09 {
				font-size: 0.9rem;
			}

			.fs10 {
				font-size: 1.0rem;
			}

			.fs11 {
				font-size: 1.1rem;
			}

			.fs12 {
				font-size: 1.2rem;
			}

			.fs14 {
				font-size: 1.4rem;
			}

			.fs16 {
				font-size: 1.6rem;
			}

			.mono,
			.ss-val,
			.ss-addr,
			.ss-addr-sml
			{
				font-family: monospace;
				cursor: pointer;
			}

			.ss-addr-sml {
				font-size: 0.8em;
			}

			.upper {
				text-transform: uppercase;
			}

			select,
			option,
			ss-select
			{
				color: {$@darkest};
			    transition-duration: {$@trans};
			}

			button,
			input,
			.ss-button,
			.rb-button,
			.ss-input,
			.ss-select,
			.ss-row
			{
				cursor: pointer;
				border-radius: 4px;
				border-color: {$@lightest};
				border-width: 1.4px;
				border-style: solid;
				background-color: {$@light};
				padding: 13px 15.6px;
				margin: 9px;
			    transition-duration: 0.3s;
			}

			button,
			.rb-button
			.ss-button
			{
				color: {$@darkest};
				text-transform: uppercase;
			}

			.rb-button
			{
				width: 300px;
			}

			.ss-input,
			.ss-select
			{
				cursor: pointer;
				display: inline-block;
			}

			input,
			select,
			textarea
			{
				cursor: pointer;
				color: {$@darkest};
				box-shadow: 0.5px 0.5px 5px {$@darkest} inset;
				width: 300px
			}

			textarea
			{
				cursor: pointer;
				width: 90%;
				min-height: 5rem;
			}

			input:hover,
			select:hover,
			textarea:hover,
			input:focus,
			select:focus
			{
				border-color: {$@light};
				border-width: 1.4px;
				border-style: solid;
				background-color: {$@base};
				box-shadow: 0.5px 0.5px 2px {$@darkest} inset;
			}

			button:hover,
			.ss-button:hover,
			.rb-button:hover
			{
				border-color: {$@light};
			    background-color: {$@base};
				box-shadow: 0.5px 0.5px 5px {$@darkest};	
			}

			.ss-flex-container {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
				flex-direction: row;
			}

			.ss-flex {
				display: inline-flex;
			}

			.idicon,
			.idicon-sml {
				display: inline-block;
				border-width: 2.2px;
				border-color: {$@lightest};
				border-style: solid;
				border-radius: 100%;
				width: auto;
			}

			.idicon-sml {
				border-width: 1.6px;
			}

			.idicon-tny {
				border-width: 1px;
			}

			button + input,
			select + input
			{
				display: inline-block;
			}

			.modal {
				position: fixed;
				display: grid;
				z-index: 1;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0,0.4);
			}

			.modal-inner {
				background-color:{$@lightest};				
				font-size: 1.4em;
				color: {$@darkest};
				margin: 150px;
				padding: 20px;
				height: calc(100% - 300px);
			}

			.modal-content {
				overflow-x: hidden;
				overflow-y: auto;
				height: calc(100% - 200px);
			}

			.evnt-label {
				display: inline-block;
				width: 130px;
			}

		</style>
		`,
	}
)

console.log("ran style.js");
