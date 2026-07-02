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
      if (text.includes("занять место") || text.includes("выбрать тариф") || text.includes("забрать")) {
        element.removeAttribute("onclick");
        element.addEventListener("click", (event) => {
          event.preventDefault();
          openDemoModal();
        });
      }
      if (element.matches("a")) {
        const href = element.getAttribute("href") || "";
        if (/^(https?:|mailto:)/i.test(href)) {
          element.setAttribute("href", "#");
          element.removeAttribute("target");
          element.addEventListener("click", (event) => event.preventDefault());
        }
      }
    });
  }

  function ensureDemoModal() {
    let modal = document.querySelector("[data-demo-modal]");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.setAttribute("data-demo-modal", "");
    modal.innerHTML = `
      <div class="demo-modal__backdrop" data-demo-close></div>
      <div class="demo-modal__card" role="dialog" aria-modal="true" aria-label="Форма заявки">
        <button class="demo-modal__close" type="button" data-demo-close aria-label="Закрыть">×</button>
        <h2>Оставьте контакты</h2>
        <p>Мы закрепим выбранный формат и отправим доступ в демо-режиме.</p>
        <form class="demo-modal__form" action="#" method="get">
          <input class="f-input" type="text" name="formParams[full_name]" placeholder="Введите ваше имя" required>
          <input class="f-input" type="text" name="formParams[email]" placeholder="Введите ваш эл. адрес" required>
          <input class="f-input" type="text" name="formParams[phone]" placeholder="Введите ваш телефон" required>
          <div class="form-result-block"></div>
          <button class="f-btn" type="submit">Отправить заявку</button>
        </form>
      </div>
    `;

    const styles = document.createElement("style");
    styles.textContent = `
      [data-demo-modal] {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
      }
      [data-demo-modal].is-open { display: flex; }
      .demo-modal__backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.44);
      }
      .demo-modal__card {
        position: relative;
        width: min(460px, 100%);
        border-radius: 28px;
        padding: 28px;
        background: #fff;
        box-shadow: 0 26px 90px rgba(0, 0, 0, 0.22);
      }
      .demo-modal__card h2 {
        margin: 0 32px 10px 0;
        color: #F66297;
        font-size: 28px;
        line-height: 1.15;
        font-weight: 600;
      }
      .demo-modal__card p {
        margin: 0 0 18px;
        color: #555;
        font-size: 15px;
        line-height: 1.4;
      }
      .demo-modal__close {
        position: absolute;
        top: 14px;
        right: 16px;
        border: 0;
        background: transparent;
        color: #F66297;
        font-size: 30px;
        line-height: 1;
        cursor: pointer;
      }
      .demo-modal__form {
        display: grid;
        gap: 12px;
      }
      @media (max-width: 520px) {
        .demo-modal__card { padding: 22px; border-radius: 22px; }
        .demo-modal__card h2 { font-size: 24px; }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-demo-close]").forEach((button) => {
      button.addEventListener("click", () => modal.classList.remove("is-open"));
    });
    patchForms();
    return modal;
  }

  function openDemoModal() {
    const modal = ensureDemoModal();
    modal.classList.add("is-open");
    const firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function showDemoSuccess(form) {
    const result = form.querySelector(".form-result-block");
    if (result) {
      result.textContent = "Спасибо! Форма отправлена в демо-режиме.";
      result.style.display = "block";
      result.style.color = "#F66297";
      result.style.fontWeight = "600";
      result.style.textAlign = "center";
      result.style.margin = "0 0 16px";
    }

    const button = form.querySelector('button[type="submit"], input[type="submit"], .f-btn');
    if (button) {
      if ("value" in button) button.value = "Отправлено";
      button.textContent = "Отправлено";
      button.setAttribute("disabled", "disabled");
      button.style.opacity = "0.85";
    }
  }

  function interceptFormSubmit(event) {
    const form = event.target.closest && event.target.closest("form");
    if (!form) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    showDemoSuccess(form);
  }

  function patchForms() {
    document.querySelectorAll("form").forEach((form) => {
      form.setAttribute("action", "#");
      form.setAttribute("method", "get");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showDemoSuccess(form);
      }, true);
    });

    document.querySelectorAll('button[type="submit"], input[type="submit"], .f-btn').forEach((button) => {
      const form = button.closest("form");
      if (!form) return;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showDemoSuccess(form);
      }, true);
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

  document.addEventListener("submit", interceptFormSubmit, true);
})();
