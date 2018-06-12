const dapp_addressInput = function(placeholder='', value='', _class='', autofocus=false, disabled=false) {
	const self = {	
		w: `
			<div id="{$@id}">
				<div class="dapp-address-input {>('has-name', @hasName)}">
					<input type="text" name="{$@name}"
						placeholder="${placeholder}"
						class="${_class} {>('', @isValid, 'dapp-error')} {>('', @isChecksum, 'dapp-non-checksum')}"
						{$@additionalAttributes}
						value="{$@value}"
						title="{>('', @isChecksum, @i18nText)}" />
					{>('<span class="ens-name">{$@ensDisplay}</span>', @hasName)}
					{>(dapp_identicon(@address, "dapp-small"), @isValid)}
					{>('<span class="ens-loading">{$@spinner}</span>', !@isValid && @ensLoading)}
					{>('<i class="icon-shield"></i>', !@isValid && !@ensLoading)}
					}
				</div>
			</div>
		`,
		f: {
			get hasName(){},
			get isValid(){},
			get isChecksum() {},
			get i18nText() {},
			name: '',
			endLoading: false,
			value: value,
			address: "",
			ensDisplay: "",
			spinner: "",
		},
		s: {

		}
	}

	return self;
}

// <template name="dapp_addressInput">
//     <div class="dapp-address-input {{#if TemplateVar.get 'hasName'}}has-name{{/if}}">
//         <input type="text" name="{{name}}" placeholder="{{placeholder}}" class="{{class}} {{#unless TemplateVar.get 'isValid'}}dapp-error{{/unless}} {{#unless TemplateVar.get 'isChecksum'}} dapp-non-checksum {{/unless}}" {{additionalAttributes}} value="{{value}}" title="{{#unless TemplateVar.get 'isChecksum'}}{{i18nText}}{{/unless}}" >

//         {{#if TemplateVar.get 'hasName'}}
//             <span class='ens-name'>{{ensDisplay}}</span>
//         {{/if}}

//         {{#if TemplateVar.get "isValid"}}
//             {{> dapp_identicon identity=address class="dapp-small"}}
//         {{else}}
//             {{#if TemplateVar.get 'ensLoading'}}
//                 <span class='ens-loading'>{{> spinner}}</span>
//             {{else}}
//                 <i class="icon-shield"></i>
//             {{/if}}
//         {{/if}}
//     </div>
// </template>