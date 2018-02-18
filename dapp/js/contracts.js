
const templateLUT = new Proxy(
	{
		"RegBase v0.4.0": regBase,
		"Registrar v0.4.0": registrar,
		"RegistrarFactory v0.4.0": factory,
		"BytesMap v0.4.0": bytesMap,
		"BytesMapFactory v0.4.0": factory,
		"Value v0.4.0": Value,
		"ValueFactory v0.4.0": factory,
		"SandalStraps v0.4.0": sandalStraps,
		"SandalStrapsFactory v0.4.0": factory,
		"InvoicesFactory v0.4.0": factory,
		"Invoices v0.4.0": invoices,
		"Invoice v0.4.0": invoice,
		"PayableERC20Factory v0.4.3": factory,
		"PayableERC20 v0.4.3": payableErc20,
		"DepositWithdrawAllFactory v0.4.1": factory,
		"DepositWithdrawAll v0.4.1": depositWithdrawAll,
		"EscrowingITOFactory v0.4.0": factory,
		"EscrowingITOFactory v0.4.0": escrowingITO,
		"MeteredPaymentFactory v0.4.1": factory,
		"MeteredPayments v0.4.1": meteredPayments,
	},
	{
		get: (target, key) => {	return target[key] || regBase; }
	}
);

const interfaceLUT = new Proxy(
	{
		"RegBase v0.4.0": RegBaseContract,
		"Registrar v0.4.0": RegistrarContract,
		"RegistrarFactory v0.4.0": FactoryContract,
		"BytesMap v0.4.0": BytesMapContract,
		"BytesMapFactory v0.4.0": FactoryContract,
		"Value v0.4.0": ValueContract,
		"ValueFactory v0.4.0": FactoryContract,
		"SandalStraps v0.4.0": SandalStrapsContract,
		"SandalStrapsFactory v0.4.0": FactoryContract,
		"InvoicesFactory v0.4.0": FactoryContract,
		"Invoices v0.4.0": InvoicesContract,
		"Invoice v0.4.0": InvoiceContract,
		"PayableERC20Factory v0.4.3": FactoryContract,
		"PayableERC20 v0.4.3": PayableERC20Contract,
		"DepositWithdrawAllFactory v0.4.1": FactoryContract,
		"DepositWithdrawAll v0.4.1": DepositWithdrawAllContract,
		"EscrowingITOFactory v0.4.0": FactoryContract,
		"EscrowingITO v0.4.0": EscrowingITOContract,
		"MeteredPaymentFactory v0.4.1": FactoryContract,
		"MeteredPayments v0.4.1": MeteredPaymentsContract,
	},
	{
		get: (target, key) => {	return target[key] || RegBaseContract; }
	}
);

const contracts = new Proxy(new Map(),
	{
		get: (target, kAddr) => {
			if (!web3.isAddress(kAddr)) return undefined;
			if (!(target.has(kAddr))) {
				k = RegBaseContract.at(kAddr);
				let regName = k.regName();
				let ver = utf8(k.VERSION());
				if(ver && regName) {
					target.set(kAddr, interfaceLUT[ver].at(kAddr));
				} else {
					return undefined;
				}
			}
			return target.get(kAddr);
		},
	}
);

const kCandles = new Proxy(new Map(),
	{
		get: (target, kAddr) => {
			if (!web3.isAddress(kAddr)) return undefined;
			if (!(target.has(kAddr))) {
				let k = contracts[kAddr];
				if(!k) return undefined;
				let template = templateLUT[utf8(k.VERSION())];
				target.set(kAddr, {
					minimal: template.minimal(k),
					basic: template.basic(k),
					advanced: template.advanced(k),
				})
			}
			return target.get(kAddr);		
		},
	}
);

function getRegName(kAddr) { return utf8(RegBaseContract.at(kAddr).regName()); }


console.log("ran contracts.js");
