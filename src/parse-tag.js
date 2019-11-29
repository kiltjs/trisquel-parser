
export function parseTag (tag_str, options = {}) {
  const tag = { attrs: {} }
  const tag_prop = options.tag_prop || '$'

  tag_str
    .replace(/^<|>$/g, '')
    .replace(/ *\/$/, function () {
      // delete tag.unclosed
      tag.self_closed = true
      return ''
    })
    .replace(/^\//, function () {
      if( tag.self_closed ) throw new Error('tag closer self_closed: ' + tag_str )
      tag.closer = true
      return ''
    })
    .replace(/^[^ ]+/, function (node_name) {
      if( /^!/.test(node_name) ) {
        tag[tag_prop] = node_name.trim().substr(1)
        tag.warn = true
      } else {
        tag[tag_prop] = node_name.trim()
      }
      return ''
    })
    .replace(/\b([^= ]+) *= *"([^"]*?)"|\b([^= ]+) *= *'([^']*?)'/g, function (_matched, attribute, value) {
      attribute = attribute.trim()
      if( attribute === 'style' ) value = value.replace(/([:;])\s+/g, '$1')
      if( options.compress_attibutes !== false ) value = value.replace(/ *\n */g, '').trim()
      tag.attrs[attribute] = value
      return ''
    })
    .split(/ +/)
    .forEach(function (empty_attr) {
      empty_attr = empty_attr.trim()
      if( !empty_attr ) return
      tag.attrs[empty_attr] = ''
    })

  if( !Object.keys(tag.attrs).length ) delete tag.attrs
  // if( !tag._.length ) delete tag._

  return tag
}
