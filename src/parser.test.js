
import assert from 'assert'

import { parseHTML } from './parser'

/** */
describe( '.' + __filename.substr( process.cwd().length ), function () {
// --------------------------------------

describe('parseTag', function () {

  function _runTestCases (html, result, options) {

    it(html + ( options ? (' | ' + JSON.stringify(options) + ')') : '' ), function () {

      assert.deepStrictEqual(
        parseHTML(html, options),
        result
      )

    })

  }

  [

    [ '<div></div>', [{ $: 'div' }] ],
    [ '<div class="foo"></div>', [{ $: 'div', attrs: { class: 'foo' } }] ],
    [ '<div id="foo"></div>', [{ $: 'div', attrs: { id: 'foo' } }] ],

    [ '<!DOCTYPE html>', [{ $: '!DOCTYPE', attrs: { html: '' }, type: 'directive' }] ],

    [ '<img src="./pic.png"/>', [{ $: 'img', attrs: { src: './pic.png' }, self_closed: true }] ],
    [ '<img src="./pic.png" />', [{ $: 'img', attrs: { src: './pic.png' }, self_closed: true }] ],

    [`<pre><code class="language-html">
    <!DOCTYPE html>
    <html>
      <head></head>
      <body></body>
    <html>
    </code></pre>`, [{ $:'pre', _: [{
          $: 'code', attrs: { class: 'language-html' }, _: `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body></body>
    <html>
    `
        }] }] ],

    [`<!--<script template:type="text/javascript">
      var foo = 'bar';
    </script>-->`, [{ type: 'comment', _: `<script template:type="text/javascript">
      var foo = 'bar';
    </script>` }] ],

    ['<div>foo<!-- foobar -->bar</div>', [{ $: 'div', _: ['foo', { type: 'comment', _: ' foobar ' }, 'bar'] }] ],

    ['<div>foo<!-- foobar -->bar</div>', [{ $: 'div', _: ['foo', 'bar'] }], { remove_comments: true }],

    // [`
    // <body class="mediawiki ltr sitedir-ltr mw-hide-empty-elt ns-4 ns-subject page-Wikipedia_Portada rootpage-Wikipedia_Portada skin-vector action-view">    <div id="mw-page-base" class="noprint"></div>
    //     <div id="mw-head-base" class="noprint"></div>
    //     <div id="content" class="mw-body" role="main">
    //       <a id="top"></a>
    
    //               <div id="siteNotice" class="mw-body-content"><!-- CentralNotice --></div>
    //             <div class="mw-indicators mw-body-content">
    // </div>
    //       <h1 id="firstHeading" class="firstHeading" lang="es">Wikipedia:Portada</h1>
    //                   <div id="bodyContent" class="mw-body-content">
    //                   <div id="siteSub">De Wikipedia, la enciclopedia libre</div>
    //                 <div id="contentSub"></div>
    //                         <div id="jump-to-nav" class="mw-jump">
    //           Saltar a:          <a href="#mw-head">navegación</a>,           <a href="#p-search">búsqueda</a>
    //         </div>
    //         <div id="mw-content-text" lang="es" dir="ltr" class="mw-content-ltr"><table style="margin:4px 0 0 0; width:100%; background:none">
    // <tr>
    // <td class="MainPageBG" style="width:100%; border:1px solid #C7D0F8; background:#F2F5FD; vertical-align:top; color:#000; -moz-border-radius:4px; -webkit-border-radius: 4px; border-radius: 4px;">
    // `, [], { ignore_unclosed: true } ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})


/** */
})
/** */
