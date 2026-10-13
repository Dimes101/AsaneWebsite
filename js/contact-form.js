/* Asane Solutions — contact form
   Validates input in the browser, then delivers the message one of two ways:

   1. endpoint set  → POSTs JSON to a form service (Formspree, Basin, Getform, …).
   2. endpoint empty → opens the visitor's email app with the message pre-filled.

   No backend is required for either. */

var CONTACT_CONFIG = {
  // PLACEHOLDER: replace with the real inbox (also update the address in index.html).
  email: "hello@example.com",
  // Optional: a form-service URL, e.g. "https://formspree.io/f/abcdwxyz". Leave "" to use email.
  endpoint: ""
};

(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = form.querySelector("[data-form-status]");
  var submitBtn = form.querySelector('button[type="submit"]');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Each rule returns an error message, or "" when the value is fine.
  var rules = {
    name: function (v) {
      if (!v) return "Enter your name.";
      if (v.length < 2) return "Name looks too short.";
      return "";
    },
    email: function (v) {
      if (!v) return "Enter your email so we can reply.";
      if (!EMAIL_RE.test(v)) return "Enter a valid email, like name@company.com.";
      return "";
    },
    message: function (v) {
      if (!v) return "Tell us a little about what you need.";
      if (v.length < 20) return "Add a bit more detail (20 characters minimum).";
      return "";
    }
  };

  function field(name) { return form.elements[name]; }
  function value(name) { return (field(name).value || "").trim(); }

  function showError(name, message) {
    var input = field(name);
    var slot = document.getElementById(input.id + "-err");
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    if (slot) slot.textContent = message;
  }

  function validate() {
    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var message = rules[name](value(name));
      showError(name, message);
      if (message && !firstInvalid) firstInvalid = field(name);
    });
    return firstInvalid;
  }

  function setStatus(message, kind) {
    status.textContent = message;
    status.className = "form__status" + (kind ? " is-" + kind : "");
  }

  // Once a field has been flagged, re-check it as the visitor types.
  Object.keys(rules).forEach(function (name) {
    field(name).addEventListener("input", function () {
      if (field(name).getAttribute("aria-invalid") === "true") {
        showError(name, rules[name](value(name)));
      }
    });
  });

  function collect() {
    return {
      name: value("name"),
      email: value("email"),
      organization: value("organization"),
      area: field("area").value,
      message: value("message")
    };
  }

  function sendViaEmailApp(data) {
    var subject = "[Asane] Project inquiry — " + data.name;
    var body = [
      "Name: " + data.name,
      "Email: " + data.email,
      "Company: " + (data.organization || "—"),
      "Area of interest: " + data.area,
      "",
      data.message
    ].join("\n");

    window.location.href = "mailto:" + CONTACT_CONFIG.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    setStatus("Your email app should open with the message filled in. If it doesn't, write to " +
      CONTACT_CONFIG.email + ".", "success");
  }

  function sendViaEndpoint(data) {
    submitBtn.disabled = true;
    setStatus("Sending…");

    return fetch(CONTACT_CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        setStatus("Received. You'll hear back by email.", "success");
      })
      .catch(function () {
        setStatus("That didn't go through. Please try again, or email " + CONTACT_CONFIG.email + ".", "error");
      })
      .then(function () { submitBtn.disabled = false; });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot filled → almost certainly a bot. Pretend success, send nothing.
    if (value("website")) {
      setStatus("Received. You'll hear back by email.", "success");
      return;
    }

    var firstInvalid = validate();
    if (firstInvalid) {
      setStatus("Check the highlighted fields.", "error");
      firstInvalid.focus();
      return;
    }

    var data = collect();
    if (CONTACT_CONFIG.endpoint) sendViaEndpoint(data);
    else sendViaEmailApp(data);
  });
})();
