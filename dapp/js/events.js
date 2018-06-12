
// Event log template
const eventInfo = (log) => {
	return Tilux.l(`
			<div class="ss-addr-sml">
				<span>BLOCK&nbsp;${blockLink(log.blockNumber)}</span> |
				<span>${(new Date(block(log.blockNumber).timestamp * 1000)).toLocaleString()}</span> |
				<span>TX&nbsp;${txHash(log.transactionHash)}</span>
			</div>
		`)
}


const formatUnknownEvents = (log, k) => {
	return Tilux.l({
		w: `
			<h4>${log.event}</h4>
			{#([],@args)}
			`,
		f: {
			args: Object.keys(log.args).map((k)=>{return `<label>${k}</label><span class="mono">${log.args[k]}</span><br />`}),
		}
	});
}

const events = (k, evTmplt) => {
	let self = new Tilux({
		w: `
			<div id="{$@id}" class="layer">
				<h3>Events</h3>
				{#([], @events)}
			</div>
		`,
		f: {
			id: 'k-events',
			k: k,
			// evTmplt: evTmplt,
			events: [['Waiting for events logs...']],
		},
	});

    k.events.get(
		(err, logs)=>{
			if(logs) self.f.events = logs.reverse().map(
				log => {return evTmplt(log, k) + eventInfo(log)}
			)
    	}
    );

    return self;
}
