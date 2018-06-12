// $import ("js/apis/MeteredPaymentsAPI.js");

const formatMeteredPaymentsEvents = (log) => {
	switch (log.event) {
		case 'PaymentsChanged': return Tilux.l(`
			<h4>Payment Changed</h4>
			<label>Address</label> {>(ethAddrSml('${log.args._addr}'))}<br />
			<label>Start Date</label> ${new Date(log.args._startDate * 1000)}<br />
			<label>Total</label> {>(ethVal(${log.args._value}))}<br />
			<label>Rate</label> {>(ethVal(${log.args._rate.mul(3600)}))}/hr<br />
			`);
			break;
		case 'RecipientChanged': return Tilux.l(`
			<h4>Recipient Changed</h4>
			<label>Old Address</label> {>(ethAddrSml('${log.args._old}'))}<br />
			<label>New Address</label> {>(ethAddrSml('${log.args._new}'))}<br />
			`);
			break;
		default: return formatWithdrawableEvents(log);						
	}
}


const recipient = (k, addr) => {
	let recip = k.recipients(addr);
	return {
		w: `
			<div>
				<label>Locked</label>{$@locked}<br />
				<label>Last Withdrawal</label>{$@lastWithdrawal}<br />
				<label>Period Remaining</label>{$@period} hours<br />
				<label>Payment Rate</label>{>(ethVal(@rate))}/hr<br />
				<label>Available</label>{>(ethVal(@balAvailable))}
			</div>
		`,
		f: {
			period: recip[0].div(3600),
			lastWithdrawal: new Date(recip[1] * 1000),
			locked: recip[2],
			rate: recip[3].mul(3600),
			balAvailable: k.etherBalanceOf(addr),
		},
	}
}

const changePayments = (k) => {
	let d = new Date();
	const self =  {
		w: `
			<div>
				<h3>New or Change Payment</h3>
				<input id="rAddr-inp" type="text" placeholder="Payment address" value="{$@rAddr}"/>Recipient address<br />
				<input id="startDate-inp" type="date" value="{$@startDate.value}"/>Date Start<br />
				<input id="endDate-inp" type="date" value="{$@endDate.value}"/>Date Complete<br />
				<input id="pmtValue-inp" type="number" placeholder="Total Payment" value="{$@pmtValue}"/>Total Payment<br />
				<button id="meteredPayments-btn">Commit Payment</button>
			</div>
		`,
		f: {
			rAddr: '',
			startDate: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,
			endDate:  `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,
			pmtValue: 0,
		},
		s: {
			"#rAddr-inp": {
				"change": (event) => {self.f.rAddr = event.target.value;},
			},
			"#startDate-inp": {
				"change": (event) => {
					let d = event.target;
					self.f.startDate = d;
					if (self.f.endDate.valueAsNumber < self.f.startDate.valueAsNumber) self.f.endDate = self.f.startDate;
				},
			},
			"#endDate-inp": {
				"change": (event) => {
					let d = event.target;
					self.f.endDate = d;
					if (self.f.endDate.valueAsNumber < self.f.startDate.valueAsNumber) self.f.startDate = self.f.endDate;
				},
			},
			"#pmtValue-inp": {
				"change": (event) => {self.f.pmtValue = event.target.value;},
			},
			"#meteredPayments-btn": {
				"click": () => {
					let startTime = self.f.startDate.valueAsNumber / 1000;
					let period = (self.f.endDate.valueAsNumber - self.f.startDate.valueAsNumber) / 1000;
					self.f.k.changePayment(self.f.rAddr, startTime, period, {from: currAccountLux.address, value: toWei(self.f.pmtValue), gas: 200000});
				},
			},		
		}
	}
	return self;

}

const meteredPayments = {

	minimal: (k) => {
		return {
			w: `{>(regBase.minimal(@k))}
			`,
			f: {
				k: k,
			},			
		}
	},

	basic: (k) => {
		return {
			w: `{>(regBase.basic(@k))}
			`,
			f: {
				k: k,
			},			
		}
	},

	advanced: (k) => {
		const self = new Tilux({
			w: `<div id="{$@id}">
					{>(regBase.advanced(@k))}
					<div class="layer">
						<div>
							<label>Paid Out</label>{>(ethVal(@totalPaid))}<br />
							<label>Escrowed Ether</label>{>(ethVal(@commPayments))}<br />
							<label>Committed Time</label>{$@commTime} hours<br />
						</div>
					</div>
					{>(changePayments(@k), @isOwner)}
					<div class="layer">
						<h3>Recipient Lookup</h3>
						<input id="recipLU" type="text" placeholder="Recipient Address" value="{$@luAddr}"/>
						{>(recipient(@k, @luAddr))}
					</div>
					{>(events(@k, formatMeteredPaymentsEvents))}
				</div>`,
			f: {
				id: `meteredPayments-${k.address}-adv`,
				k: k,
				luAddr: currAccountLux.address,
				get totalPaid() {return k.paidOut()},
				get commTime() {return k.committedTime().div(3600)},
				get commPayments() {return k.committedPayments()},
				get isOwner() {return k.owner() === currAccountLux.address;},
				get registered() {
					return meteredPayments.getRegistered(k).map(addr=>Tilux.l(kCandles[addr].minimal));
				},
			},
			s: {
				"#recipLU": {
					"change": (event) => {self.f.luAddr = event.target.value;},
				},
			}
		});

		return self;
	}
}


resources["MeteredPayments v0.4.1"] = {
	template: meteredPayments,
	interface: MeteredPaymentsContract,
	docPath: "docs/MeteredPaymentsAPI.md"
}

resources["MeteredPaymentsFactory v0.4.1"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/MeteredPaymentsAPI.md"
}

resources["MeteredPayments v0.4.2"] = {
	template: meteredPayments,
	interface: MeteredPaymentsContract,
	docPath: "docs/MeteredPaymentsAPI.md"
}

resources["MeteredPaymentsFactory v0.4.2"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/MeteredPaymentsAPI.md"
}


console.log("ran MeteredPayments.js");

