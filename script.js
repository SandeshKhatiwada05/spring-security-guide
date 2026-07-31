(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Syntax highlighter ---------- */
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var JAVA_TOK = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"?)|('(?:[^'\\]|\\.)*'?)|(@[A-Za-z_][\w.]*)|(\b\d+(?:\.\d+)?\b)|(\b(?:public|private|protected|static|final|class|interface|enum|record|void|return|new|import|package|extends|implements|if|else|for|while|do|switch|case|break|continue|throw|throws|try|catch|finally|this|super|true|false|null|var|boolean|int|long|double|String|List|User|UserDetails|Authentication|HttpSecurity|Object|throws)\b)/g;

  var XML_TOK = /(<!--[\s\S]*?-->)|(<\/?[\w-]+)|([\w-]+="[^"]*")|(>)/g;

  function highlightJava(text) {
    return text.replace(JAVA_TOK, function (m, c, s, ch, a, n, k) {
      if (c) return '<span class="tok-c">' + escapeHtml(c) + '</span>';
      if (s) return '<span class="tok-s">' + escapeHtml(s) + '</span>';
      if (ch) return '<span class="tok-s">' + escapeHtml(ch) + '</span>';
      if (a) return '<span class="tok-a">' + escapeHtml(a) + '</span>';
      if (n) return '<span class="tok-n">' + escapeHtml(n) + '</span>';
      if (k) return '<span class="tok-k">' + escapeHtml(k) + '</span>';
      return escapeHtml(m);
    });
  }

  function highlightXml(text) {
    return text.replace(XML_TOK, function (m, c, tag, attr, gt) {
      if (c) return '<span class="tok-c">' + escapeHtml(c) + '</span>';
      if (tag) return '<span class="tok-t">' + escapeHtml(tag) + '</span>';
      if (attr) return '<span class="tok-a">' + escapeHtml(attr) + '</span>';
      return escapeHtml(gt);
    });
  }

  document.querySelectorAll("pre code").forEach(function (code) {
    var raw = code.textContent;
    if (code.classList.contains("lang-java")) {
      code.innerHTML = highlightJava(raw);
    } else if (code.classList.contains("lang-xml")) {
      code.innerHTML = highlightXml(raw);
    } else {
      code.innerHTML = escapeHtml(raw);
    }
  });

  /* ---------- Copy buttons on every code block ---------- */
  document.querySelectorAll("pre").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.addEventListener("click", function () {
      var text = pre.querySelector("code").textContent;
      function copied() {
        btn.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(copied);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); copied(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
    pre.appendChild(btn);
  });

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Filter chain stepper ---------- */
  var stepBtns = Array.prototype.slice.call(document.querySelectorAll(".step-btn"));
  var stepPanels = Array.prototype.slice.call(document.querySelectorAll(".step-panel"));

  function showStep(index) {
    if (index < 0 || index >= stepBtns.length) return;
    stepBtns.forEach(function (b, i) {
      var active = i === index;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-expanded", String(active));
    });
    stepPanels.forEach(function (p, i) {
      p.classList.toggle("is-open", i === index);
    });
  }

  stepBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () { showStep(i); });
  });

  var prevBtn = document.getElementById("step-prev");
  var nextBtn = document.getElementById("step-next");
  var current = 0;

  function moveStep(delta) {
    var idx = stepBtns.indexOf(document.querySelector(".step-btn.is-active"));
    var next = Math.min(Math.max(idx + delta, 0), stepBtns.length - 1);
    showStep(next);
    stepBtns[next].focus();
  }
  if (prevBtn) prevBtn.addEventListener("click", function () { moveStep(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { moveStep(1); });

  /* ---------- Try It — path checker ---------- */
  var pathInput = document.getElementById("path-input");
  var pathCheck = document.getElementById("path-check");
  var resultBox = document.getElementById("tryit-result");

  function checkPath() {
    var raw = (pathInput.value || "").trim().split("#")[0].split("?")[0];
    var clean = raw || "";
    var outcome, rule;

    if (!clean.startsWith("/")) {
      resultBox.innerHTML = '<div class="result-box result-block"><span class="res-status">Error</span>' +
        '<span class="res-path">' + escapeHtml(clean || "(empty)") + '</span>' +
        '<span class="res-rule">paths must start with a slash, like /account</span></div>';
      return;
    }

    if (clean === "/login" || clean === "/error" || clean === "/public" || clean.indexOf("/public/") === 0) {
      outcome = "pass"; rule = "permitAll() — public path";
    } else if (clean === "/admin" || clean.indexOf("/admin/") === 0) {
      outcome = "block"; rule = "hasRole('ADMIN') — you only have ROLE_USER";
    } else {
      outcome = "pass"; rule = "anyRequest().authenticated() — you are logged in";
    }

    resultBox.innerHTML =
      '<div class="result-box ' + (outcome === "pass" ? "result-pass" : "result-block") + '">' +
        '<span class="res-status">' + (outcome === "pass" ? "Allowed" : "Blocked") + '</span>' +
        '<span class="res-path">' + escapeHtml(clean) + '</span>' +
        '<span class="res-rule">' + rule + '</span>' +
      '</div>';
  }

  pathCheck.addEventListener("click", checkPath);
  pathInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkPath();
  });

  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      pathInput.value = chip.textContent;
      checkPath();
    });
  });

  /* ---------- Building blocks explorer ---------- */
  var blockBtns = Array.prototype.slice.call(document.querySelectorAll(".block-btn"));

  blockBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      blockBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll(".block-panel").forEach(function (p) {
        p.classList.remove("is-open");
      });
      var panel = document.getElementById(btn.getAttribute("data-target"));
      if (panel) panel.classList.add("is-open");
    });
  });

  /* ---------- Cheat sheet accordion ---------- */
  document.querySelectorAll(".acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.closest(".acc-item");
      var panel = document.getElementById(head.getAttribute("aria-controls"));
      var isOpen = head.getAttribute("aria-expanded") === "true";

      head.setAttribute("aria-expanded", String(!isOpen));
      item.classList.toggle("is-open", !isOpen);
      if (!isOpen) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        panel.style.maxHeight = "";
      }
    });
  });

  /* ---------- Table of contents sidebar ---------- */
  var tocToggle = document.getElementById("toc-toggle");
  var tocBackdrop = document.getElementById("toc-backdrop");
  var tocList = document.getElementById("toc-list");
  var body = document.body;
  var desktopWidth = 1100;

  function isDesktop() { return window.innerWidth >= desktopWidth; }

  function setToc(open) {
    if (isDesktop()) {
      body.classList.toggle("sidebar-hidden", !open);
      body.classList.remove("sidebar-open");
    } else {
      body.classList.toggle("sidebar-open", open);
      body.classList.remove("sidebar-hidden");
    }
    tocToggle.setAttribute("aria-expanded", String(open));
  }

  tocToggle.addEventListener("click", function () {
    var open = isDesktop()
      ? !body.classList.contains("sidebar-hidden")
      : body.classList.contains("sidebar-open");
    setToc(!open);
  });

  tocBackdrop.addEventListener("click", function () { setToc(false); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setToc(false);
  });

  function tocFromViewport() {
    if (isDesktop()) {
      body.classList.remove("sidebar-open");
      body.classList.remove("sidebar-hidden");
      tocToggle.setAttribute("aria-expanded", "true");
    } else {
      body.classList.remove("sidebar-hidden");
      body.classList.remove("sidebar-open");
      tocToggle.setAttribute("aria-expanded", "false");
    }
  }
  tocFromViewport();

  function slugify(text) {
    return text.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  var tocSections = [];
  var tocItems = [];

  function buildToc() {
    var sections = document.querySelectorAll("main section[id]");
    var usedIds = {};

    sections.forEach(function (sec) {
      if (sec.classList.contains("cta-banner")) return;
      var heading = sec.querySelector("h1[id], h2[id]");
      if (!heading) return;

      var item = document.createElement("li");
      item.className = "toc-item";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "toc-chapter";
      btn.dataset.section = sec.id;
      btn.setAttribute("aria-expanded", "false");

      var span = document.createElement("span");
      span.textContent = heading.textContent.trim().replace(/\s+/g, " ");
      var caret = document.createElement("span");
      caret.className = "toc-caret";
      caret.setAttribute("aria-hidden", "true");
      btn.appendChild(span);
      btn.appendChild(caret);
      item.appendChild(btn);

      var subs = [];
      sec.querySelectorAll("h3").forEach(function (h3) {
        if (h3.closest(".step-panel, .block-panel, .acc-item, .tryit, .cta-inner")) return;
        if (!h3.id) {
          var base = slugify(h3.textContent) || "topic";
          var unique = base;
          var n = 1;
          while (usedIds[unique]) unique = base + "-" + (++n);
          h3.id = unique;
        }
        usedIds[h3.id] = true;
        subs.push(h3);
      });

      var subList = null;
      var subLinks = [];
      if (subs.length) {
        subList = document.createElement("ul");
        subList.className = "toc-subs";
        subs.forEach(function (h3) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.href = "#" + h3.id;
          a.textContent = h3.textContent.trim().replace(/\s+/g, " ");
          li.appendChild(a);
          subList.appendChild(li);
          subLinks.push(a);
        });
        item.appendChild(subList);
      }

      tocList.appendChild(item);
      tocItems.push({ item: item, btn: btn, subLinks: subLinks, section: sec });
      tocSections.push(sec);

      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        item.classList.toggle("is-open", !open);
        if (!open) {
          heading.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      subLinks.forEach(function (a) {
        a.addEventListener("click", function () {
          if (!isDesktop()) setToc(false);
        });
      });
    });
  }

  buildToc();

  var activeItem = null;
  var activeSub = null;

  function updateTocSpy() {
    var spyLine = window.scrollY + 96;
    var current = null;

    tocSections.forEach(function (sec) {
      if (sec.offsetTop <= spyLine) current = sec;
    });

    var itemEntry = null;
    if (current) {
      tocItems.forEach(function (entry) {
        if (entry.section === current) itemEntry = entry;
      });
    }

    if (itemEntry !== activeItem) {
      if (activeItem) activeItem.btn.classList.remove("is-active");
      if (itemEntry) itemEntry.btn.classList.add("is-active");
      activeItem = itemEntry;
    }

    if (activeSub) activeSub.classList.remove("is-active");
    activeSub = null;
    if (itemEntry && current) {
      var subTarget = null;
      itemEntry.subLinks.forEach(function (a) {
        var target = document.getElementById(a.getAttribute("href").slice(1));
        if (target && target.offsetTop <= spyLine) subTarget = a;
      });
      if (subTarget) {
        subTarget.classList.add("is-active");
        activeSub = subTarget;
        if (subTarget.closest(".toc-item")) {
          var host = subTarget.closest(".toc-item");
          host.classList.add("is-open");
          var hostBtn = host.querySelector(".toc-chapter");
          if (hostBtn) hostBtn.setAttribute("aria-expanded", "true");
        }
      }
    }

    if (itemEntry && itemEntry.item) {
      itemEntry.item.classList.add("is-open");
      itemEntry.btn.setAttribute("aria-expanded", "true");
    }
  }

  var spyTicking = false;
  window.addEventListener("scroll", function () {
    if (!spyTicking) {
      spyTicking = true;
      window.requestAnimationFrame(function () {
        updateTocSpy();
        spyTicking = false;
      });
    }
  }, { passive: true });
  updateTocSpy();

  window.addEventListener("resize", tocFromViewport);

  /* ---------- Fade-up on scroll ---------- */
  var animated = document.querySelectorAll("[data-animate]");

  if (reduceMotion) {
    animated.forEach(function (el) { el.classList.add("is-visible"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    animated.forEach(function (el) { io.observe(el); });
  } else {
    animated.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();