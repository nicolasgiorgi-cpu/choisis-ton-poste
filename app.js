(function () {
  "use strict";

  var POSTES = window.POSTES || [];
  var CONFIG = window.CONFIG || { formAction: "", champs: {} };
  var LABELS = ["Puissance", "Vitesse", "Mains", "Plaquage", "Vision", "Jeu au pied"];
  var KEY = "m12-top3-v2";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- petites aides ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function byId(id) { for (var i = 0; i < POSTES.length; i++) if (POSTES[i].id === id) return POSTES[i]; return null; }
  function vars(p) { return "--c:" + p.color + ";--d:" + p.dark + ";--glow2:" + hexA(p.color, 0.28); }
  function hexA(hex, a) {
    var h = hex.replace("#", "");
    var r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
  function nbStars(v) { return v >= 90 ? 5 : v >= 75 ? 4 : v >= 60 ? 3 : v >= 45 ? 2 : 1; }
  function store(get, val) {
    try {
      if (get) return JSON.parse(localStorage.getItem(KEY) || "null");
      localStorage.setItem(KEY, JSON.stringify(val));
    } catch (e) { return null; }
  }

  /* ---------- dessins ---------- */
  var CREST = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4L90 18V48C90 72 72 88 50 97C28 88 10 72 10 48V18Z" fill="#0A0F1F" stroke="currentColor" stroke-width="3.2"/><path d="M50 12L82 23V48C82 67 68 80 50 88C32 80 18 67 18 48V23Z" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/><path d="M24 26C36 20 46 18 50 18" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round"/></svg>';
  var SYM = {
    colonne: '<g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 32h40"/><path d="M34 32l4-6h24l4 6"/><path d="M38 36v28M50 36v28M62 36v28"/><path d="M30 68h40M27 75h46"/></g>',
    cible: '<g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><circle cx="50" cy="50" r="19"/><circle cx="50" cy="50" r="6" fill="currentColor"/><path d="M50 22v10M50 68v10M22 50h10M68 50h10"/></g>',
    griffe: '<g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M38 28L30 72"/><path d="M52 26L46 76"/><path d="M66 28L60 72"/></g>',
    eclair: '<path d="M56 20L32 54h16l-6 28 26-38H52z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="4.5" stroke-linejoin="round"/>',
    oeil: '<g fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 52C32 40 40 34 50 34S68 40 76 52C68 64 60 70 50 70S32 64 24 52z"/><circle cx="50" cy="52" r="9" fill="currentColor" fill-opacity="0.35"/><path d="M50 22v6M36 26l3 5M64 26l-3 5"/></g>',
    perce: '<g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M60 26v14M60 60v14"/><path d="M54 44l-4 6 4 6"/><path d="M26 50h44M60 38l12 12-12 12"/></g>',
    aile: '<g fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 64C42 60 52 50 58 32C63 44 60 56 52 64"/><path d="M36 70C48 70 60 64 68 52"/><path d="M44 76C54 77 64 73 72 66"/></g>'
  };
  function emblem(p) {
    return CREST + '<svg viewBox="0 0 100 100" aria-hidden="true">' + (SYM[p.emblem] || "") + "</svg>";
  }
  var ICON = {
    colonne: '<path d="M5 7h14M6 7l1.5-2.5h9L18 7M8 9v8M12 9v8M16 9v8M5 19h14M4 21.5h16"/>',
    belier: '<path d="M19 4v16"/><path d="M3 12h11M10 8l4 4-4 4"/>',
    cible: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    eclair: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 12l6-5"/>',
    griffe: '<path d="M8 4L6 20M12.5 3.5L11 20.5M17 4l-2 16"/>',
    aimant: '<path d="M6 4v8a6 6 0 0 0 12 0V4"/><path d="M6 8h3M15 8h3"/>',
    oeil: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    pied: '<ellipse cx="14" cy="9" rx="6.5" ry="4" transform="rotate(-30 14 9)"/><path d="M3 20l5-4M3 15l4-1.5M7 21l2-4"/>',
    perce: '<path d="M15 3v6M15 15v6"/><path d="M3 12h17M16 8l4 4-4 4"/>',
    bouclier: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    turbo: '<path d="M3 6l6 6-6 6M10 6l6 6-6 6M17 6l4 6-4 6"/>',
    essai: '<ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-35 12 12)"/><path d="M9 15l6-6M10.5 10.5l1.5 1.5M12 9l1.5 1.5M9 12l1.5 1.5"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[name] || "") + "</svg>";
  }
  var STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";
  function stars(v, color) {
    var n = nbStars(v), out = '<span class="stars" role="img" aria-label="' + n + ' étoiles sur 5">';
    for (var k = 0; k < 5; k++) {
      out += '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + STAR + '" fill="' + (k < n ? color : "none") + '" stroke="' + (k < n ? color : "#34405F") + '" stroke-width="2" stroke-linejoin="round"/></svg>';
    }
    return out + "</span>";
  }
  var SKYLINE = '<svg class="skyline" viewBox="0 0 390 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 80V50h22V34h16v16h12V24h24v56h10V40h18V28h14v52h12V44h26V20h16v60h10V52h20V34h12v46h14V38h24V26h14v54h12V46h18V30h12v50h14V42h20V32h16v48z" fill="#070A12"/></svg>';
  var SILHOUETTE = '<svg viewBox="0 0 110 130" aria-hidden="true"><circle cx="55" cy="42" r="24" fill="currentColor"/><path d="M8 130c4-34 24-52 47-52s43 18 47 52z" fill="currentColor"/></svg>';

  /* ---------- état : top 3 ---------- */
  /* tout est gardé sur le téléphone : top 3, prénom, nom, dernier envoi */
  var state = store(true) || {};
  if (Array.isArray(state)) state = { top3: state };
  var top3 = (state.top3 || []).filter(function (id) { return byId(id); }).slice(0, 3);
  function save() { state.top3 = top3; store(false, state); }
  function rankOf(id) { return top3.indexOf(id); }
  function addPick(id) {
    if (rankOf(id) >= 0 || top3.length >= 3) return;
    top3.push(id); save(); refreshAll();
    toast("Ajouté en choix n°" + top3.length + " !");
  }
  function removePick(id) {
    var i = rankOf(id); if (i < 0) return;
    top3.splice(i, 1); save(); refreshAll();
    toast("Retiré de ton top 3");
  }
  function move(i, dir) {
    var j = i + dir; if (j < 0 || j >= top3.length) return;
    var t = top3[i]; top3[i] = top3[j]; top3[j] = t; save(); refreshAll();
  }

  /* ---------- carte ---------- */
  function cardHTML(p, big) {
    var r = rankOf(p.id);
    var rows = p.stats.map(function (v, j) {
      return '<div class="stars-row"><span>' + LABELS[j] + "</span>" + stars(v, p.color) + "</div>";
    }).join("");
    return '<div class="tilt" style="' + vars(p) + '">' +
      '<button type="button" class="card' + (big ? " card--big" : "") + '" data-open="' + p.id + '" aria-label="Ouvrir la carte ' + esc(p.nom) + " : " + esc(p.surnom) + '">' +
      '<span class="card__in">' +
      '<span class="art">' + (big ? SKYLINE : "") +
      '<span class="art__num">' + esc(p.n) + "</span>" +
      (r >= 0 ? '<span class="pick-badge">CHOIX ' + (r + 1) + "</span>" : "") +
      '<span class="emblem">' + emblem(p) + "</span></span>" +
      '<span class="card__body"><span><span class="card__surnom" style="display:block">' + esc(p.nom) + "</span>" +
      '<span class="card__role" style="display:block">' + esc(p.surnom) + " · " + esc(p.cls) + "</span></span>" +
      '<span class="stars-list">' + rows + "</span></span>" +
      '<span class="card__holo"></span><span class="card__shine"></span></span></button></div>';
  }

  function renderGrid() {
    var html = POSTES.map(function (p) { return cardHTML(p, false); }).join("");
    html += '<div class="top3-card"><strong>TOP 3</strong><em>Forme ton équipe</em><span>Plusieurs postes te plaisent ? C\'est normal : choisis-en 3, dans l\'ordre.</span></div>';
    $("#grid").innerHTML = html;
    bindTilt($("#grid"));
  }
  var featuredId = POSTES.length ? POSTES[Math.floor(Math.random() * POSTES.length)].id : null;
  function renderFeature() {
    var p = byId(featuredId); if (!p) return;
    $("#feature").innerHTML = cardHTML(p, true);
    bindTilt($("#feature"));
  }

  /* effet carte brillante (holographique) + inclinaison : souris ET doigt */
  function shineAt(card, clientX, clientY, tiltAmount) {
    var r = card.getBoundingClientRect();
    var x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    var y = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    card.classList.add("is-shiny");
    card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    card.style.setProperty("--px", (25 + x * 50).toFixed(1) + "%");
    card.style.setProperty("--py", (25 + y * 50).toFixed(1) + "%");
    card.style.setProperty("--hyp", Math.min(1, Math.hypot(x - 0.5, y - 0.5) * 1.6).toFixed(2));
    if (!reduceMotion) {
      card.style.setProperty("--ry", ((x - 0.5) * tiltAmount).toFixed(1) + "deg");
      card.style.setProperty("--rx", ((0.5 - y) * tiltAmount * 0.8).toFixed(1) + "deg");
    }
  }
  function shineOff(card) {
    card.classList.remove("is-shiny");
    card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg");
  }
  function bindTilt(root) {
    var cards = root.querySelectorAll(".card");
    Array.prototype.forEach.call(cards, function (card) {
      var offT;
      card.addEventListener("pointermove", function (e) {
        if (e.pointerType === "touch") return;
        shineAt(card, e.clientX, e.clientY, 22);
      });
      card.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch") shineOff(card); });
      /* au doigt : le reflet suit le doigt qui glisse (sans bloquer le défilement) */
      var onTouch = function (e) {
        var t = e.touches && e.touches[0]; if (!t) return;
        clearTimeout(offT);
        shineAt(card, t.clientX, t.clientY, 12);
      };
      card.addEventListener("touchstart", onTouch, { passive: true });
      card.addEventListener("touchmove", onTouch, { passive: true });
      card.addEventListener("touchend", function () { offT = setTimeout(function () { shineOff(card); }, 450); }, { passive: true });
      card.addEventListener("touchcancel", function () { offT = setTimeout(function () { shineOff(card); }, 450); }, { passive: true });
    });
  }

  /* ---------- barre du bas ---------- */
  function renderBar() {
    var html = "";
    for (var i = 0; i < 3; i++) {
      var p = byId(top3[i]);
      if (p) {
        html += '<button type="button" class="slot filled" style="' + vars(p) + '" data-goform aria-label="Choix ' + (i + 1) + " : " + esc(p.nom) + ', toucher pour modifier mon top 3"><span class="slot__txt">' + (i + 1) + " · " + esc(p.code) + "</span></button>";
      } else {
        html += '<span class="slot" aria-label="Choix ' + (i + 1) + ' vide">' + (i + 1) + "</span>";
      }
    }
    $("#slots").innerHTML = html;
    var go = $("#go");
    go.disabled = top3.length < 3;
    go.textContent = top3.length < 3 ? top3.length + "/3" : "VALIDER";
  }

  /* ---------- carte ouverte ---------- */
  var detail = $("#detail");
  var lastRect = null, lastFocus = null;

  function detailHTML(p) {
    var r = rankOf(p.id);
    var statRows = p.stats.map(function (v, j) {
      return '<div><span class="lbl">' + LABELS[j] + "</span>" + stars(v, p.color) + "</div>";
    }).join("");
    var powers = p.pouvoirs.map(function (w) {
      return '<div class="power">' + icon(w.icon) + "<b>" + esc(w.titre) + "</b><p>" + esc(w.texte) + "</p></div>";
    }).join("");
    var li = function (a) { return a.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join(""); };
    var heroes = p.heros.map(function (h) {
      var src = h.photo || (h.commons ? "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(h.commons) + "?width=480" : "");
      var ph = src ? '<img src="' + esc(src) + '" alt="' + esc(h.nom) + '" loading="lazy" onerror="this.remove()">' : "";
      var cr = (h.commons && h.credit) ? '<a class="heroc__cr" href="https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(h.commons) + '" target="_blank" rel="noopener">Photo : ' + esc(h.credit) + "</a>" : "";
      return '<div class="heroc"><div class="heroc__ph">' + SILHOUETTE + ph + cr + '</div><div class="heroc__txt"><b>' + esc(h.nom) + "</b><small>" + esc(h.info) + "</small></div></div>";
    }).join("");
    var vids = p.videos.map(function (v) {
      return '<div class="vid"><div class="vid__frame" data-vid="' + esc(v.id) + '" data-start="' + (v.start || "") + '" data-end="' + (v.end || "") + '">' +
        '<button type="button" class="vid__play" aria-label="Lire la vidéo : ' + esc(v.titre) + '"><img src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="" loading="lazy">' +
        '<span class="pbtn"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#0A0F1F"/></svg></span></button></div>' +
        '<div class="vid__txt"><b>' + esc(v.titre) + "</b><small>" + esc(v.source) + "</small></div></div>";
    }).join("");
    var hl = p.highlight ? '<a class="hl" href="https://www.youtube.com/watch?v=' + esc(p.highlight.id) + '" target="_blank" rel="noopener">' +
      '<img src="https://i.ytimg.com/vi/' + esc(p.highlight.id) + '/mqdefault.jpg" alt="" loading="lazy"><span><span class="hl__k">LES MEILLEURES ACTIONS</span>' +
      "<b>" + esc(p.highlight.titre) + "</b><small>" + esc(p.highlight.source) + '</small><br><span class="hl__go">Voir sur YouTube ↗</span></span></a>' : "";

    return '<header class="d-head" id="d-head"><button type="button" class="back" data-close aria-label="Revenir aux postes"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>POSTES</button>' +
      '<span class="d-head__name" aria-hidden="true">' + esc(p.nom) + '</span><span class="chip">' + esc(p.cls) + '</span></header>' +
      '<div class="d-art">' + SKYLINE +

      '<span class="d-num">' + esc(p.n) + "</span>" +
      '<span class="d-emblem" id="d-emblem">' + emblem(p) + '<span class="em-holo"></span><span class="em-shine"></span></span></div>' +
      '<div class="d-body fade">' +
      '<div><h2 class="d-title" id="d-title">' + esc(p.nom) + '</h2><div class="d-sub">' + esc(p.numeros) + " · « " + esc(p.surnom) + " »</div>" + '<p class="d-intro">' + esc(p.intro) + "</p></div>" +
      '<section class="panel d-stats" aria-label="Caractéristiques">' + statRows + "</section>" +
      '<section><h3 class="sh">Ses pouvoirs</h3><div class="powers">' + powers + "</div></section>" +
      '<section><h3 class="sh">Ta mission</h3><div class="mission"><div><b>EN ATTAQUE</b><ul>' + li(p.attaque) + '</ul></div><div class="def"><b>EN DÉFENSE</b><ul>' + li(p.defense) + "</ul></div></div></section>" +
      '<section class="j10"><span>JEU À 10</span><span>' + esc(p.jeu10) + "</span></section>" +
      '<section><h3 class="sh">Fait pour toi si…</h3><div class="fit">' + p.pourToi.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div></section>" +
      '<section><h3 class="sh">Ils jouent à ce poste au Stade Toulousain</h3><div class="heroes">' + heroes + "</div></section>" +
      '<section><h3 class="sh">Regarde-le en action</h3><div class="videos">' + hl + vids + "</div></section>" +
      "</div>" +
      '<div class="d-action fade"><div class="d-action__in">' +
      '<div class="act-row"><span class="act-lbl" id="d-lbl"></span></div>' +
      '<div class="ranks" id="d-ranks"></div></div></div>';
  }

  /* place un poste au rang k (0, 1 ou 2) : les autres se décalent */
  function setRank(id, k) {
    var i = rankOf(id);
    if (i === k) return;
    if (i >= 0) top3.splice(i, 1);
    top3.splice(Math.min(k, top3.length), 0, id);
    var bumped = top3.length > 3 ? top3.pop() : null;
    save(); refreshAll();
    toast(byId(id).nom + " en choix n°" + (rankOf(id) + 1) + (bumped ? " · " + byId(bumped).nom + " sort du top 3" : ""));
  }

  function refreshDetailAction() {
    var id = detail.getAttribute("data-id"); if (!id) return;
    var p = byId(id), r = rankOf(id), box = $("#d-ranks"), lbl = $("#d-lbl");
    if (!box) return;
    lbl.textContent = r >= 0 ? "Choix n°" + (r + 1) + " · change de numéro si tu veux" : "Mets ce poste dans ton top 3 :";
    var html = "";
    for (var k = 0; k < 3; k++) {
      var q = byId(top3[k]), me = top3[k] === id;
      html += '<button type="button" class="rk' + (me ? " me" : q ? " taken" : "") + '" data-rank="' + k + '" style="' + vars(q || p) + '"' +
        ' aria-label="Mettre en choix ' + (k + 1) + (q && !me ? " (à la place de " + esc(q.nom) + ")" : "") + '"' + (me ? ' aria-current="true"' : "") + ">" +
        "<b>" + (k + 1) + "</b><small>" + (me ? "CE POSTE" : q ? esc(q.code) : "LIBRE") + "</small></button>";
    }
    if (r >= 0) html += '<button type="button" class="rk rk--x" data-remove="' + id + '" aria-label="Retirer de mon top 3"><b>×</b><small>RETIRER</small></button>';
    box.innerHTML = html;
    detail.style.cssText = vars(p);
  }

  function openDetail(id, fromEl) {
    var p = byId(id); if (!p) return;
    lastFocus = document.activeElement;
    detail.setAttribute("data-id", id);
    detail.style.cssText = vars(p);
    detail.innerHTML = detailHTML(p);
    detail.hidden = false;
    detail.scrollTop = 0;
    document.body.classList.add("locked");
    refreshDetailAction();
    var rect = fromEl ? fromEl.getBoundingClientRect() : null;
    if (rect && !reduceMotion && detail.animate) {
      var sx = rect.width / window.innerWidth, sy = rect.height / window.innerHeight;
      detail.classList.add("flipping");
      var a = detail.animate([
        { transform: "translate(" + rect.left + "px," + rect.top + "px) scale(" + sx + "," + sy + ")", opacity: 0.6 },
        { transform: "none", opacity: 1 }
      ], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
      a.onfinish = function () { detail.classList.remove("flipping"); };
    } else {
      detail.classList.add("anim-in");
      setTimeout(function () { detail.classList.remove("anim-in"); }, 320);
    }
    var t = $("#d-title"); if (t) { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
    bindEmblem();
    var head = $("#d-head");
    detail.onscroll = function () { if (head) head.classList.toggle("scrolled", detail.scrollTop > 240); };
  }

  /* emblème de la fiche : rotation 3D + reflet brillant au doigt et à la souris */
  function bindEmblem() {
    var zone = $(".d-art", detail), em = $("#d-emblem");
    if (!zone || !em) return;
    var offT;
    function at(cx, cy) {
      var r = em.getBoundingClientRect();
      var x = Math.min(1, Math.max(0, (cx - r.left) / r.width));
      var y = Math.min(1, Math.max(0, (cy - r.top) / r.height));
      em.classList.add("is-shiny");
      em.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      em.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      em.style.setProperty("--px", (20 + x * 60).toFixed(1) + "%");
      em.style.setProperty("--py", (20 + y * 60).toFixed(1) + "%");
      if (!reduceMotion) {
        em.style.setProperty("--ery", ((x - 0.5) * 34).toFixed(1) + "deg");
        em.style.setProperty("--erx", ((0.5 - y) * 28).toFixed(1) + "deg");
      }
    }
    function off() { em.classList.remove("is-shiny"); em.style.setProperty("--erx", "0deg"); em.style.setProperty("--ery", "0deg"); }
    zone.addEventListener("pointermove", function (e) { if (e.pointerType !== "touch") at(e.clientX, e.clientY); });
    zone.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch") off(); });
    var onT = function (e) { var t = e.touches && e.touches[0]; if (!t) return; clearTimeout(offT); at(t.clientX, t.clientY); };
    zone.addEventListener("touchstart", onT, { passive: true });
    zone.addEventListener("touchmove", onT, { passive: true });
    zone.addEventListener("touchend", function () { offT = setTimeout(off, 600); }, { passive: true });
  }

  function closeOverlays() {
    var open = [detail, $("#form")].filter(function (el) { return !el.hidden; });
    if (!open.length) return;
    open.forEach(function (el) {
      el.classList.add("closing");
      setTimeout(function () {
        el.classList.remove("closing"); el.hidden = true;
        if (el === detail) { detail.innerHTML = ""; detail.removeAttribute("data-id"); }
      }, 200);
    });
    document.body.classList.remove("locked");
    if (lastFocus && lastFocus.focus) setTimeout(function () { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }, 220);
  }

  /* lecture vidéo à la demande (plus léger, et rien ne se charge sans clic) */
  function playVideo(frame) {
    var id = frame.getAttribute("data-vid"), s = frame.getAttribute("data-start"), e = frame.getAttribute("data-end");
    var src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&playsinline=1&modestbranding=1" + (s ? "&start=" + s : "") + (e ? "&end=" + e : "");
    frame.innerHTML = '<iframe src="' + src + '" title="Vidéo YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  }

  /* ---------- formulaire ---------- */
  var form = $("#form");
  var formReady = !!(CONFIG.formAction && CONFIG.champs && CONFIG.champs.prenom && CONFIG.champs.choix1);

  function picksHTML(editable) {
    var html = "";
    for (var i = 0; i < 3; i++) {
      var p = byId(top3[i]);
      if (!p) { html += '<div class="pick pick--empty">CHOIX ' + (i + 1) + " · À CHOISIR</div>"; continue; }
      html += '<div class="pick" style="' + vars(p) + '"><span class="pick__rank">' + (i + 1) + '</span><span class="pick__em">' + emblem(p) + "</span>" +
        '<span class="pick__txt"><b>' + esc(p.nom) + "</b><small>" + esc(p.surnom) + " · " + esc(p.cls) + "</small></span>" +
        (editable ? '<span class="pick__ctl"><button type="button" class="icon-btn" data-move="' + i + '" data-dir="-1" aria-label="Monter" ' + (i === 0 ? "disabled" : "") + '><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>' +
          '<button type="button" class="icon-btn" data-move="' + i + '" data-dir="1" aria-label="Descendre" ' + (i === top3.length - 1 ? "disabled" : "") + '><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
          '<button type="button" class="icon-btn" data-remove="' + p.id + '" aria-label="Retirer ' + esc(p.nom) + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span>' : "") +
        "</div>";
    }
    return html;
  }

  var draft = { prenom: state.prenom || "", nom: state.nom || "", message: state.message || "" };
  function sameAsSent() { return !!state.sent && state.sent.join() === top3.join(); }
  function fmtDate(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) + " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  function renderSent() {
    var el = $("#sent"); if (!el) return;
    if (!state.sentAt) { el.hidden = true; return; }
    el.hidden = false;
    var changed = !sameAsSent();
    el.innerHTML = '<div class="sent__ico" aria-hidden="true">' + (changed ? "!" : "✓") + "</div><div>" +
      "<b>" + (changed ? "Tu as changé ton top 3 : pense à le renvoyer !" : "Choix envoyés, " + esc(state.prenom || "") + " !") + "</b>" +
      "<span>Dernier envoi : " + esc(fmtDate(state.sentAt)) + ". Tu peux changer d'avis quand tu veux : c'est ton dernier envoi qui compte.</span>" +
      (top3.length === 3 ? '<button type="button" class="sent__btn" data-goform>' + (changed ? "Renvoyer mon top 3" : "Modifier mes choix") + "</button>" : "") +
      "</div>";
  }
  function renderForm() {
    form.innerHTML = '<div class="f-wrap">' +
      '<div class="f-head"><button type="button" class="back" data-close><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>COLLECTION</button><span class="kicker">ÉTAPE FINALE</span></div>' +
      '<h2 class="f-title" id="f-title" tabindex="-1">Mon top 3</h2>' +
      '<p class="note">Range tes 3 postes dans l\'ordre : ton préféré en n°1. Les éducateurs feront le choix final en tenant compte de tes vœux et de l\'équipe.</p>' +
      '<div class="picks" id="picks">' + picksHTML(true) + "</div>" +
      '<form id="f" novalidate>' +
      '<div class="row2"><div class="field"><label for="f-prenom">Prénom</label><input id="f-prenom" name="prenom" autocomplete="given-name" required value="' + esc(draft.prenom) + '"></div>' +
      '<div class="field"><label for="f-nom">Nom</label><input id="f-nom" name="nom" autocomplete="family-name" required value="' + esc(draft.nom) + '"></div></div>' +
      '<div class="field" style="margin-top:14px"><label for="f-msg">Un mot pour les éducs (facultatif)</label><textarea id="f-msg" name="message" placeholder="Pourquoi ces postes ? Un poste que tu ne veux pas ?">' + esc(draft.message) + "</textarea></div>" +
      '<p class="err" id="f-err" role="alert" style="margin-top:12px"></p>' +
      (state.sentAt ? '<p class="note" style="margin-top:12px">Tu as déjà envoyé tes choix (' + esc(fmtDate(state.sentAt)) + '). Pas de souci : c\'est ton dernier envoi qui compte.</p>' : "") +
      (formReady ? "" : '<p class="testmode" style="margin-top:12px">MODE TEST : le formulaire n\'est pas encore branché, rien ne sera envoyé.</p>') +
      '<button type="submit" class="btn-send" id="f-send" style="width:100%;margin-top:14px">' + (state.sentAt ? "Renvoyer mes choix" : "Envoyer mes choix") + "</button>" +
      "</form></div>";
  }

  function openForm() {
    lastFocus = document.activeElement;
    renderForm();
    form.hidden = false; form.scrollTop = 0;
    document.body.classList.add("locked");
    form.classList.add("anim-in");
    setTimeout(function () { form.classList.remove("anim-in"); }, 320);
    var t = $("#f-title"); if (t) t.focus({ preventScroll: true });
  }

  function submitForm(e) {
    e.preventDefault();
    var prenom = $("#f-prenom").value.trim(), nom = $("#f-nom").value.trim(), msg = $("#f-msg").value.trim();
    var err = $("#f-err");
    if (top3.length < 3) { err.textContent = "Il te faut 3 postes dans ton top 3."; return; }
    if (!prenom || !nom) { err.textContent = "Écris ton prénom et ton nom."; return; }
    err.textContent = "";
    var btn = $("#f-send"); btn.disabled = true; btn.textContent = "Envoi…";
    var names = top3.map(function (id) { return byId(id).nom; });
    var done = function (ok) {
      if (!ok) { btn.disabled = false; btn.textContent = "Envoyer mes choix"; err.textContent = "L'envoi n'a pas marché. Vérifie ta connexion et réessaie."; return; }
      state.prenom = prenom; state.nom = nom; state.message = msg;
      if (formReady) { state.sentAt = Date.now(); state.sent = top3.slice(); }
      save(); renderSent();
      showThanks(prenom);
    };
    if (!formReady) { setTimeout(function () { done(true); }, 400); return; }
    var fd = new FormData(), c = CONFIG.champs;
    fd.append(c.prenom, prenom); fd.append(c.nom, nom);
    fd.append(c.choix1, names[0]); fd.append(c.choix2, names[1]); fd.append(c.choix3, names[2]);
    if (c.message && msg) fd.append(c.message, msg);
    fetch(CONFIG.formAction, { method: "POST", mode: "no-cors", body: fd })
      .then(function () { done(true); })
      .catch(function () { done(false); });
  }

  function showThanks(prenom) {
    form.innerHTML = '<div class="f-wrap merci">' +
      '<span class="kicker">' + (formReady ? "CHOIX ENREGISTRÉS" : "MODE TEST · RIEN N'A ÉTÉ ENVOYÉ") + "</span>" +
      '<h2 class="f-title" id="f-title" tabindex="-1">Bravo ' + esc(prenom) + "&nbsp;!</h2>" +
      '<p class="lead">Ton top 3 est entre les mains des éducateurs. Tu changes d\'avis ? Reviens sur ce site avec ce téléphone, modifie ton top 3 et renvoie-le : c\'est le dernier envoi qui compte.</p>' +
      '<div class="picks">' + picksHTML(false) + "</div>" +
      '<button type="button" class="back" data-close style="margin-top:6px">REVOIR LES CARTES</button></div>';
    var t = $("#f-title"); if (t) t.focus({ preventScroll: true });
  }

  /* ---------- navigation (bouton retour du téléphone compris) ---------- */
  var pendingEl = null;
  function route() {
    var h = location.hash.replace(/^#\/?/, "");
    if (h.indexOf("poste/") === 0) {
      if (!form.hidden) { form.hidden = true; }
      var id = h.slice(6);
      if (detail.getAttribute("data-id") !== id) openDetail(id, pendingEl);
    } else if (h === "valider") {
      if (!detail.hidden) { detail.hidden = true; detail.innerHTML = ""; detail.removeAttribute("data-id"); }
      if (form.hidden) openForm();
    } else {
      closeOverlays();
    }
    pendingEl = null;
  }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function back() { if (history.length > 1 && /poste\/|valider/.test(location.hash)) history.back(); else go("#/"); }

  /* ---------- événements ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target : null; if (!t) return;
    var el;
    if ((el = t.closest("[data-open]"))) { pendingEl = el; go("#/poste/" + el.getAttribute("data-open")); return; }
    if ((el = t.closest("[data-close]"))) { back(); return; }
    if ((el = t.closest("[data-remove]"))) { removePick(el.getAttribute("data-remove")); return; }
    if ((el = t.closest("[data-rank]"))) { setRank(detail.getAttribute("data-id"), +el.getAttribute("data-rank")); return; }
    if ((el = t.closest(".vid__play"))) { playVideo(el.parentNode); return; }
    if ((el = t.closest("[data-move]"))) { move(+el.getAttribute("data-move"), +el.getAttribute("data-dir")); return; }
    if ((el = t.closest("#go"))) { if (!el.disabled) go("#/valider"); return; }
    if ((el = t.closest("[data-goform]"))) { go("#/valider"); return; }
  });
  document.addEventListener("input", function (e) {
    if (e.target.id === "f-prenom") draft.prenom = state.prenom = e.target.value;
    if (e.target.id === "f-nom") draft.nom = state.nom = e.target.value;
    if (e.target.id === "f-msg") draft.message = state.message = e.target.value;
    if (/^f-/.test(e.target.id)) save();
  });
  document.addEventListener("submit", function (e) { if (e.target.id === "f") submitForm(e); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && (!detail.hidden || !form.hidden)) back(); });
  window.addEventListener("hashchange", route);

  var toastT;
  function toast(msg) {
    var el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove("show"); }, 1800);
  }

  function refreshAll() {
    renderGrid(); renderFeature(); renderBar(); renderSent(); refreshDetailAction();
    if (!form.hidden && $("#picks")) $("#picks").innerHTML = picksHTML(true);
  }

  /* barres de Safari / Chrome mobile : on remonte la barre du bas si elles recouvrent la page */
  function syncViewport() {
    var vv = window.visualViewport;
    var hidden = vv ? Math.max(0, window.innerHeight - (vv.height + vv.offsetTop)) : 0;
    document.documentElement.style.setProperty("--vvb", Math.round(hidden) + "px");
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncViewport);
    window.visualViewport.addEventListener("scroll", syncViewport);
  }
  window.addEventListener("resize", syncViewport);
  syncViewport();

  refreshAll();
  route();
})();
