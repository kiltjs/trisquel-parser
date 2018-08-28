
function _parseTag (tag_str, options) {
  var tag = { attrs: {}, _: [], unclosed: true };

  tag_str
    .replace(/^<|>$/g, '')
    .replace(/ *\/$/, function () {
      tag.self_closed = true;
      return '';
    })
    .replace(/^\//, function () {
      if( tag.self_closed ) throw new Error('tag closer self_closed: ' + tag_str );
      tag.closer = true;
      return '';
    })
    .replace(/^[^ ]+/, function (node_name) {
      tag.$ = node_name;
      if( /^!/.test(node_name) ) tag.warn = true;
      return '';
    })
    .replace(/\b([^= ]+) *= *"([^"]*?)"|\b([^= ]+) *= *'([^']*?)'/g, function (_matched, attribute, value) {
      attribute = attribute.trim();
      if( attribute === 'style' ) value = value.replace(/([:;])\s+/g, '$1');
      if( options.compress_attibutes !== false ) value = value.replace(/ *\n */g, '').trim();
      tag.attrs[attribute] = value;
      return '';
    })
    .split(/ +/)
    .forEach(function (empty_attr) {
      empty_attr = empty_attr.trim();
      if( !empty_attr ) return;
      tag.attrs[empty_attr] = '';
    });

  return tag;
}

function _trimText (text) {
  return text.replace(/ *\n+ */g, '');
}

function _parseHTML (html, options) {
  options = options || {};

  var contents = html.split(/<[^>]+?>/g);
  var nodes = options.nodes || [],
      node_opened = options.node_opened || { $: '__root__', _: nodes };

  (html.match(/<([^>]+?)>/g) ||[]).map(function (tag, i) {

    if( /\S/.test(contents[i]) ) node_opened._.push({
      text: _trimText(contents[i]),
    });

    tag = _parseTag(tag, options);

    if( tag.closer ) {
      if( tag.$ !== node_opened.$ ) throw new Error('tag closer \'' + tag.$ + '\' for \'' + node_opened.$ + '\'' );
      delete node_opened.unclosed;
      node_opened = node_opened._parent;
    } else if( tag.self_closed ) {
      node_opened._.push(tag);
    } else {
      tag._parent = node_opened;
      // tag._ = [];
      node_opened._.push(tag);
      node_opened = tag;
    }

    return tag;

  });

  if( /\S$/.test(contents[contents.length - 1]) ) nodes.push({
    text: _trimText(contents[contents.length - 1]),
  });

  return {
    nodes: nodes,
    node_opened: node_opened,
  };
}

var full_content_tags = [
  'script',
  'style',
  'code',
];

var RE_full_content = new RegExp( '<!--|-->|' + full_content_tags.map(function (tag_name) {
  return '<' + tag_name + '[^>]*>|<\\/' + tag_name + '>';
}).join('|'), 'g');

function _cleanNodes (nodes) {
  nodes.forEach(function (tag) {
    // avoiding circular structure
    delete tag._parent;

    // removing temporary tester
    delete tag.match_closer;

    // cleaning empty attributes
    if( tag.attrs && Object.keys(tag.attrs).length === 0 ) delete tag.attrs;

    // cleaning empty children
    if( tag._ instanceof Array ) {
      if( !tag._.length ) delete tag._;
      else _cleanNodes(tag._);
    }

  });
  return nodes;
}

function parseHTML (html, options) {
  var tags = html.match(RE_full_content) ||[],
      contents = html.split(RE_full_content),
      tag_opened = null,
      nodes = [],
      last_parse = {};

  options = options || {};

  tags.forEach(function (tag, i) {

    if( tag_opened ) tag_opened._ = contents[i];
    else last_parse = _parseHTML(contents[i], {
      nodes: nodes,
      node_opened: last_parse.node_opened,
      remove_comments: options.remove_comments,
      compress_attibutes: options.compress_attibutes
    });

    if( tag_opened ) {
      if( tag_opened.match_closer.test(tag) ) {
        delete tag_opened.unclosed;
        tag_opened = null;
      } else {
        tag_opened._ = tag;
      }
    } else {
      if( tag === '<!--' ) tag_opened = { comments: true, match_closer: /^-->$/, unclosed: true };
      else {
        tag_opened = _parseTag(tag, options);
        tag_opened.match_closer = new RegExp('^<\\/ *' + tag_opened.$ + ' *>$');
      }

      if( tag === '-->' ) throw new Error('unexpected comments closer \'-->\'');
      if( tag_opened.closer ) throw new Error('unexpected tag closer \'' + tag.$ + '\'');

      (last_parse.node_opened ? last_parse.node_opened._ : nodes).push(tag_opened);
    }

  });

  last_parse = _parseHTML(contents[contents.length - 1], {
    nodes: nodes,
    node_opened: last_parse.node_opened,
  });

  if( !options.ignore_unclosed && last_parse.node_opened && last_parse.node_opened.unclosed && !last_parse.node_opened.warn ) {
    throw new Error('tab unclosed \'' + last_parse.node_opened.$ + '\'');
  }

  return _cleanNodes(nodes);
}

module.exports = parseHTML;
