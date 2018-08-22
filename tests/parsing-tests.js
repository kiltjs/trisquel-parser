/* global describe, it */

var parseHTML = require('../parser'),
    assert = require('assert');

describe('parser', function () {

  it('div', function () {

    assert.deepEqual( parseHTML(`
<div id="foobar">foo</div>
    `), [{ $:'div', attrs:{ id: 'foobar' }, _:[{ text: 'foo' }] }] );

  });

  it('attrs in lines', function () {

    assert.deepEqual( parseHTML(`
<div id="foobar"
     foo="bar">foo</div>
    `), [{ $:'div', attrs:{ id: 'foobar', foo: 'bar' }, _:[{ text: 'foo' }] }] );

  });

  it('throws', function () {

    assert.throws( () => parseHTML('<div id="foobar">'), Error );

  });

  it('script', function () {

    assert.deepEqual( parseHTML(`
<script template:type="text/javascript">
  var foo = 'bar';
</script>
    `), [{ $:'script', attrs: { 'template:type': 'text/javascript' }, _:`
  var foo = 'bar';
` }] );

  });

  it('code', function () {

    assert.deepEqual( parseHTML(`
<pre><code class="language-html">
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
<html>
</code></pre>
    `), [{ $:'pre', _: [{
      $: 'code', attrs: { class: 'language-html' }, _: `
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
<html>
`
    }] }] );

  });

});
