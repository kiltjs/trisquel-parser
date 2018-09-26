/* global describe, it */

var parseHTML = require('../parser'),
    assert = require('assert');

describe('parser', function () {

  it('div', function () {

    assert.deepEqual( parseHTML(`
<div id="foobar">foo</div>
    `), [{ $:'div', attrs:{ id: 'foobar' }, _:['foo'] }] );

  });

  it('attrs in lines', function () {

    assert.deepEqual( parseHTML(`
<div id="foobar"
     foo="bar">foo</div>
    `), [{ $:'div', attrs:{ id: 'foobar', foo: 'bar' }, _:['foo'] }] );

  });

  it('empty attrs', function () {

    assert.deepEqual( parseHTML(`
<div id="foobar" foo-bar bar-foo foo bar>foo</div>
    `), [{ $:'div', attrs:{ id: 'foobar', 'foo-bar': '', 'bar-foo': '', foo: '', bar: '' }, _:['foo'] }] );

  });

  it('mixed empty attrs', function () {

    assert.deepEqual( parseHTML(`
<div id="foobar" foo-bar bar-foo="foo[bar]">foo</div>
    `), [{ $:'div', attrs:{ id: 'foobar', 'foo-bar': '', 'bar-foo': 'foo[bar]' }, _:['foo'] }] );

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

  it('simple comments', function () {

    assert.deepEqual( parseHTML(`
<!-- foo bar -->
    `), [{ comments: ' foo bar ' }] );

  });

  it('commented script', function () {

    assert.deepEqual( parseHTML(`
<!--<script template:type="text/javascript">
  var foo = 'bar';
</script>-->
    `), [{ comments: `<script template:type="text/javascript">
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

  it('remove_comments (2)', function () {

    assert.deepEqual( parseHTML(`
foo <!--<script template:type="text/javascript">
  var foo = 'bar';
</script>--> bar
    `, { remove_comments: true }), ['foo ', ' bar'] );

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
