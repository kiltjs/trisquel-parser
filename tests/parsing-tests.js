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

  it('empty attrs', function () {

    assert.deepEqual( parseHTML(`
<div id="foobar" foo-bar bar-foo foo bar>foo</div>
    `), [{ $:'div', attrs:{ id: 'foobar', 'foo-bar': '', 'bar-foo': '', foo: '', bar: '' }, _:[{ text: 'foo' }] }] );

  });

  it('mixed empty attrs', function () {

    assert.deepEqual( parseHTML(`
<div id="foobar" foo-bar bar-foo="foo[bar]">foo</div>
    `), [{ $:'div', attrs:{ id: 'foobar', 'foo-bar': '', 'bar-foo': 'foo[bar]' }, _:[{ text: 'foo' }] }] );

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

  it('simple commente', function () {

    assert.deepEqual( parseHTML(`
<!-- foo bar -->
    `), [{ comments: true, _: ' foo bar ' }] );

  });

  it('commented script', function () {

    assert.deepEqual( parseHTML(`
<!--<script template:type="text/javascript">
  var foo = 'bar';
</script>-->
    `), [{ comments:true, _:`<script template:type="text/javascript">
  var foo = 'bar';
</script>` }] );

  });

  it('remove_comments', function () {

    assert.deepEqual( parseHTML(`
<!--<script template:type="text/javascript">
  var foo = 'bar';
</script>-->
    `, { remove_comments: true }), [] );

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
