/* CLAM project page — theme, math, reveal, copy */

(function () {
  "use strict";

  /* ----------------------------------------------------------- math ---- */

  var renderMath = function () {
    if (typeof window.katex === "undefined") return;
    var opts = { throwOnError: false, output: "html" };

    document.querySelectorAll(".math-inline").forEach(function (el) {
      if (el.dataset.rendered) return;
      try {
        window.katex.render(el.textContent, el, Object.assign({ displayMode: false }, opts));
        el.dataset.rendered = "1";
      } catch (e) { /* leave the source text in place */ }
    });

    document.querySelectorAll(".math-display").forEach(function (el) {
      if (el.dataset.rendered) return;
      try {
        window.katex.render(el.textContent, el, Object.assign({ displayMode: true }, opts));
        el.dataset.rendered = "1";
      } catch (e) { /* leave the source text in place */ }
    });
  };

  if (document.readyState === "complete") renderMath();
  else window.addEventListener("load", renderMath);

  /* --------------------------------------------------------- reveal ---- */

  var targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------- wide tables ---- */

  document.querySelectorAll(".table-wrap").forEach(function (wrap) {
    var hint = document.createElement("p");
    hint.className = "scroll-hint";
    hint.textContent = "\u2190 the table scrolls horizontally \u2192";
    hint.hidden = true;
    wrap.insertAdjacentElement("afterend", hint);

    var sync = function () {
      var over = wrap.scrollWidth > wrap.clientWidth + 2;
      wrap.classList.toggle("overflows", over);
      wrap.classList.toggle(
        "scrolled-end",
        over && wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2
      );
      hint.hidden = !over;
    };

    sync();
    wrap.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
  });

  /* ----------------------------------------------------------- copy ---- */

  var copyBtn = document.getElementById("copy-bib");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = (document.getElementById("bib") || {}).textContent || "";
      var done = function () {
        copyBtn.textContent = "Copied";
        setTimeout(function () { copyBtn.textContent = "Copy"; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          copyBtn.textContent = "Press ⌘C";
        });
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
      }
    });
  }
})();
