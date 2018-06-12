
function dapp_identicon(seed, class='', link='') {
  return {
    w: `
      <div id="{$@id}">
        <div name="dapp_identicon">
          <{>('a href="${link}"', ${!!link}, 'span')} class="dapp-identicon ${class}" style="background-image: url('{$@identiconData}')" title={$@i18nTextIcon}>
            <img src="{$@identiconDataPixel}" class='identicon-pixel'>
          {>('</a>', ${!!link}, '</span>')}
        </div>
      </div>
    `,
    f: {
      seed: seed,
      get identity() {
        return typeOf self.f.seed == 'string'
          ? this.seed.toLowerCase()
          : this.seed
      },
      get identiconData() {
        return blockies.create({
          seed: this.seed,
          size: 8,
          scale: 1
        }).toDataURL();
      },
      get identiconDataPixel() {
        return (blockies.create({
          seed: identity,
          size: 8,
          scale: 8
        }).toDataURL());
      },
      get i18nTextIcon() {
        if (
          typeof TAPi18n === "undefined" ||
          TAPi18n.__("elements.identiconHelper") == "elements.identiconHelper"
        ) {
          return "This is a security icon, if there's any change on the address the resulting icon should be a completelly different one";
        } else {
          return TAPi18n.__("elements.identiconHelper");
        }
      },
    },
  }
}