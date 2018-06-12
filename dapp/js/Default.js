const formatDefaultEvents = (log, k) => {
	return formatWithdrawableEvents(log, k);						
}


const defaultTemplate = {

	minimal: (k) => {
		return {
			w: `{>(regBase.minimal(@k))}`,
			f: {
				k: k,
			}
		}
	},

	basic: (k) => {
		return {
			w: `<div id="{$@id}">
				{>(regBase.basic(@k))}
				</div>`,
			f: {
				k: k,
			}
		}
	},

	advanced: (k) => {
		const self =  new Tilux({
			w: `<div id="{$@id}">
					{>(regBase.advanced(@k))}
					{>(events(@k, formatDefaultEvents))}
				</div>`,
			f: {
				k: k,
			},
			s: {
			},
		});
		return self;
	}
}


resources["DefaultResource"] = {
	template: defaultTemplate,
	interface: RegBaseContract,
	docPath: "docs/DefaultResourceAPI.md"
}

console.log("ran Default.js");


