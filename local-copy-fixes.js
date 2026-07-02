(function () {
  const localRoutes = {
    main: "index.html",
    partner: "partnerregistration.html",
    method: "method_july.html#form",
  };

  function closeCookieBanner() {
    const banner = document.querySelector(".cookies-notification");
    if (!banner) return;
    banner.style.display = "none";
    try {
      localStorage.setItem("usmanova-cookie-accepted", "1");
    } catch (error) {
      // localStorage may be blocked in strict browser modes.
    }
  }

  function showCookieState() {
    try {
      if (localStorage.getItem("usmanova-cookie-accepted") === "1") {
        closeCookieBanner();
      }
    } catch (error) {
      // Keep the banner visible if storage is unavailable.
    }
  }

  function patchButtons() {
    document.querySelectorAll("button, a").forEach((element) => {
      const text = (element.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (text.includes("выбрать программу")) {
        element.removeAttribute("onclick");
        element.addEventListener("click", (event) => {
          event.preventDefault();
          window.location.href = localRoutes.partner + window.location.search;
        });
      }
      if (text.includes("вернуть форму")) {
        element.removeAttribute("onclick");
        element.addEventListener("click", (event) => {
          event.preventDefault();
          window.location.href = localRoutes.method + window.location.search;
        });
      }
    });
  }

  function patchForms() {
    document.querySelectorAll("form").forEach((form) => {
      form.setAttribute("action", "#");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const result = form.querySelector(".form-result-block");
        if (result) {
          result.textContent = "Спасибо! Форма отправлена в демо-режиме.";
          result.style.display = "block";
          result.style.color = "#F66297";
          result.style.fontWeight = "600";
          result.style.textAlign = "center";
          result.style.marginBottom = "16px";
        } else {
          alert("Спасибо! Форма отправлена в демо-режиме.");
        }
      });
    });
  }

  function patchCookie() {
    showCookieState();
    document.querySelectorAll(".js__accept_cookies_policy, .cookies-notification__actions__button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        closeCookieBanner();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    patchCookie();
    patchButtons();
    patchForms();
  });
})();
