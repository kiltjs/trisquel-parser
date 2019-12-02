
function _addAttribute (attrs, options = {}) {
  return function __addAttribute (_matched, attribute, value) {
    attribute = attribute.trim()
    if( attribute === 'style' ) value = value.replace(/([:;])\s+/g, '$1')
    if( options.compress_attibutes !== false ) value = value.replace(/ *\n */g, '').trim()
    attrs[attribute] = value
    return ''
  }
}

// const self_closed_tags = 'meta, link, img'.split(/ *, */)
//   .reduce(function (_tags, tag) {
//     _tags[tag] = true
//     return _tags
//   }, {})

export function parseTag (tag_str, options = {}) {
  const tag = { attrs: {} }
  const tag_prop = options.tag_prop || '$'

  tag_str
    .replace(/^<|>$/g, '')
    .trim()
    .replace(/\/$/, function () {
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
        tag[tag_prop] = node_name.trim()
        tag.type = 'directive'
      } else {
        tag[tag_prop] = node_name.trim()
      }
      return ''
    })
    .replace(/\b([^= ]+) *= *"([^"]*?)"/g, _addAttribute(tag.attrs, options) )
    .replace(/\b([^= ]+) *= *'([^']*?)'/g, _addAttribute(tag.attrs, options) )
    .split(/ +/)
    .forEach(function (empty_attr) {
      empty_attr = empty_attr.trim()
      if( !empty_attr ) return
      tag.attrs[empty_attr] = ''
    })

  if( !Object.keys(tag.attrs).length ) delete tag.attrs
  // if( !tag._.length ) delete tag._
  // if( tag.$ && !tag.closer && !tag.self_closed && self_closed_tags[tag.$] ) tag.self_closed = true

  return tag
}
