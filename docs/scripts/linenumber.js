/* global document */
(() => {
  const source = document.getElementsByClassName("prettyprint source linenums");
  let i = 0;
  let lineNumber = 0;
  let lineId;
  let lines;
  let totalLines;
  let anchorHash;

  if (source && source[0]) {
    anchorHash = document.location.hash.substring(1);
    lines = source[0].getElementsByTagName("li");
    totalLines = lines.length;

    for (; i < totalLines; i++) {
      lineNumber++;
      lineId = `line${lineNumber}`;
      lines[i].id = lineId;
      if (lineId === anchorHash) {
        lines[i].className += " selected";
      }
    }
  }
})();

(() => {
  let e = 0;
  let a;
  let t = document.getElementById("source-code");

  if (t) {
    const n = config.linenums;

    if (n) {
      t = t.getElementsByTagName("ol")[0];
      a = Array.prototype.slice.apply(t.children);
      a = a.map(function (a) {
        e++;
        a.id = "line" + e;
      });
    } else {
      t = t.getElementsByTagName("code")[0];
      a = t.innerHTML.split("\n");
      a = a.map(function (a) {
        e++;
        return '<span id="line' + e + '"></span>' + a;
      });
      t.innerHTML = a.join("\n");
    }
  }
})();
