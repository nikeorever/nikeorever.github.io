(()=>{"use strict";var e={321:(e,t,n)=>{e.exports=n.p+"3466d5ff685bda18ccff.wasm"}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var a=t[o]={exports:{}};return e[o](a,a.exports,n),a.exports}n.m=e,n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var o=t.getElementsByTagName("script");if(o.length)for(var r=o.length-1;r>-1&&!e;)e=o[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})(),n.b=self.location+"",(()=>{let e;const t="undefined"!=typeof TextDecoder?new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};"undefined"!=typeof TextDecoder&&t.decode();let o=null;function r(){const n={wbg:{}};return n.wbg.__wbg_alert_6b988f3c3ef02440=function(n,r){var a,i;alert((a=n,i=r,a>>>=0,t.decode((null!==o&&0!==o.byteLength||(o=new Uint8Array(e.memory.buffer)),o).subarray(a,a+i))))},n}async function a(t){if(void 0!==e)return e;void 0===t&&(t=new URL(n(321),n.b));const i=r();("string"==typeof t||"function"==typeof Request&&t instanceof Request||"function"==typeof URL&&t instanceof URL)&&(t=fetch(t));const{instance:s,module:c}=await async function(e,t){if("function"==typeof Response&&e instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if("application/wasm"==e.headers.get("Content-Type"))throw t;console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",t)}const n=await e.arrayBuffer();return await WebAssembly.instantiate(n,t)}{const n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}}(await t,i);return function(t,n){return e=t.exports,a.__wbindgen_wasm_module=n,o=null,e}(s,c)}("undefined"!=typeof TextEncoder?new TextEncoder("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}}).encodeInto;const i=a;self.onmessage=function(t){console.log("Start init Wasm with Rust ...");let n=performance.now();i().then((()=>{let o=performance.now();console.log(`Init Wasm with Rust done, took ${o-n} milliseconds!`);let r=t.data,a=performance.now(),i=(s=r,e.fib(s));var s;let c=performance.now()-a;console.log(`Calculating ${r}th Fibonacci with Wasm_Rust took ${c} milliseconds,${r}th fibonacci is ${i}.`),self.postMessage({r:i,take:c})}))}})()})();