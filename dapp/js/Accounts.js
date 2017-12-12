
function accountsTplt() {
	return `
	<div>
		<select id="accounts" class="ss-input ss-addr" onchange="ethBal(event)">
			${$list('option', accounts())}
		</select>
		<label id="ethBal"></label>
	</div>
	`
}

function ethBal(event) {
	$id("ethBal").innerText = balance(event.target.value);
}