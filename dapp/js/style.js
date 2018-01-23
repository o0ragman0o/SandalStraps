var hue = new Lux(270);
var sat = new Lux(100);
var lit = new Lux(81);

var ss_style = new Tilux({
		f: {
			id: 'ss-style',
			darkest: `hsl(${hue.value}, ${sat.value + (100 - sat.value) * 0.1}%, ${lit.value * 0.3}%)`,
			dark: `hsl(${hue.value}, ${sat.value + (100 - sat.value) * 0.05}%, ${lit.value * 0.7}%)`,
			base: `hsl(${hue.value}, ${sat.value}%, ${lit.value}%)`,
			light: `hsl(${hue.value}, ${sat.value - sat.value * 0.05}%, ${lit.value + (100 - lit.value) * 0.3}%)`,
			lightest: `hsl(${hue.value}, ${sat.value - sat.value * 0.1}%, ${lit.value + (100 - lit.value) * 0.9}%)`,
			trans: `0.20s`,
		},

		w: `
		html, body, .body {
		    margin: 0px;
		    padding: 0px;
		    height: 100%;
		    font-size: 16px;
		    /* overflow: scroll; */
		}

		div {
		    transition-duration: {@trans};
		}

		h1 {
			color: {@baseColor};
		}

		.container {
			display: grid;
			grid-template-rows: 64px 32px auto 64px;
			grid-template-columns: 1fr 1fr 1fr;
			grid-template-areas:
				"title accounts accounts"
				"path path path"
				"body body body"
				"footer footer footer"
		}

		.item {

		}

		.header {
			grid-area: title;
			color: {@lightest};
			background-color: {@darkest};
			font-family: Roboto, sans-serif;
		}

		.accounts {
			grid-area: accounts;
			background-color: {@darkest};
		}

		.navpath {
			grid-area: path;
			font-size: 1em;
			color: {@darkest};
			background-color: {@base};
			font-family: Roboto, sans-serif;
			text-transform: uppercase;
			box-shadow: 0px 1px 5px -1px {@darkest} inset;				
		}

		.path-item {
			display: inline-block;
			padding: 8px;
			cursor: pointer;

		}
		.path-item:hover {
			color: {@lightest};
			background-color: {@base};
			box-shadow: 0px 1.5px 5px {@darkest};				
		}

		.path-item:active, path-item + .active {
			color: {@lightest};
			background-color: {@light};
			box-shadow: 0px 1.5px 5px {@darkest};				
		}

		.path-item:checked {
			color: {@lightest};
			background-color: {@light};
			box-shadow: 0px 1.5px 5px {@darkest};				
		}

		.body {
			grid-area: body;
		    color: {@darkest};
		    background-color: {@light};
			font-size: 1.0em;
			font-family: Roboto, sans-serif;
		}

		.footer {
			grid-area: footer;
			// position: absolute;
			// bottom: 0px;
		    background-color: {@darkest};
		    color: {@lightest};
		    padding: 15px;
			font-size: 0.8rem;
			font-family: Roboto, sans-serif;
			box-shadow: 0px -0.5px 5px {@darkest};	
		}

		.regbase-adv {
			display: grid;
			margin: 16px;
			grid-template-rows: 1.6em 1.2em 1.2em 1.2em;
			grid-template-columns: 70px auto;
			grid-template-areas:
				"idicon title"
				"idicon addr"
				"idicon owner"
				"idicon bal"			
		}

		.rb-idicon {
			grid-area: idicon;
		}

		.rb-title {
			grid-area: title;
		}

		.rb-regname {
			color: {@lightest};
			font-size: 1.4em;
			text-transform: uppercase;
		}

		.rb-version {
			justify-self: end;
			font-size: 1.2em;
		}

		.rb-addr {
			grid-area: addr;
		}

		.rb-owner {
			grid-area: owner;
		}

		.rb-bal {
			grid-area: bal;
		}

		.layer {
			box-shadow: 0px 1.5px 5px {@darkest};				
			padding: 13px 15.6px;
		}

		.inline {
			display: inline-block;
		}

		.darkest {
			color: {@darkest};
		}

		.dark {
			color: {@darkest};
		}

		.base {
			color: {@base};
		}

		.light {
			color: {@light};
		}

		.lightest {
			color: {@lightest};
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

		.upper {
			text-transform: uppercase;
		}

		select,
		option,
		ss-select
		{
			color: {@darkest};
		    background-color: {@light};
		    transition-duration: {@trans};
		}

		button,
		input,
		.ss-button,
		.ss-input,
		.ss-select
		{
			cursor: pointer;
			border-radius: 4px;
			border-color: {@lightest};
			border-width: 1.4px;
			border-style: solid;
			background-color: {@light};
			padding: 13px 15.6px;
			margin: 9px;
		    transition-duration: 0.3s;
		}

		button,
		.ss-button
		{
			color: {@darkest};
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
			color: {@darkest};
			background-color: {@light};
			box-shadow: 0.5px 0.5px 5px {@darkest} inset;
		}

		input:hover,
		select:hover,
		textarea:hover,
		input:focus,
		select:focus
		{
			border-color: {@light};
			border-width: 1.4px;
			border-style: solid;
			background-color: {@base};
			box-shadow: 0.5px 0.5px 2px {@darkest} inset;
		}

		button:hover,
		.ss-button:hover
		{
			border-color: {@light};
		    background-color: {@base};
			box-shadow: 0.5px 0.5px 5px {@darkest};	
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
			border-color: {@lightest};
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
		`,
	}
)