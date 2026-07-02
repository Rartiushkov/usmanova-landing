(function () {
  const routes = {
    home: "index.html",
    partner: "partnerregistration.html",
    method: "method_july.html#form"
  };

  function withCurrentQuery(path) {
    const url = new URL(path, window.location.href);
    url.search = window.location.search;
    return url.toString();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-go]");
    if (!button) return;

    const route = routes[button.dataset.go];
    if (route) window.location.href = withCurrentQuery(route);
  });

  const cookie = document.querySelector("[data-cookie]");
  const cookieOk = document.querySelector("[data-cookie-ok]");
  if (cookie && localStorage.getItem("usmanovaCookiesAccepted") === "1") {
    cookie.classList.add("is-hidden");
  }
  if (cookieOk) {
    cookieOk.addEventListener("click", () => {
      localStorage.setItem("usmanovaCookiesAccepted", "1");
      cookie?.classList.add("is-hidden");
    });
  }

  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll('input[name="tgid"]').forEach((input) => {
    input.value = params.get("tgid") || "";
  });
  document.querySelectorAll('input[name="ambassid"]').forEach((input) => {
    input.value = params.get("ambassid") || "";
  });

  document.querySelectorAll("[data-tariff]").forEach((button) => {
    button.addEventListener("click", () => {
      const form = document.querySelector('[data-form="method"]');
      const input = form?.querySelector('input[name="tariff"]');
      if (input) input.value = button.dataset.tariff;
      form?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  document.querySelectorAll(".lead-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      if (status) {
        status.textContent = "Готово: форма нажалась и данные приняты в демо-режиме.";
      }
      form.querySelectorAll("input").forEach((input) => {
        if (!input.readOnly && input.type !== "hidden") input.value = "";
      });
    });
  });

  const secondsEl = document.querySelector("[data-seconds]");
  const minutesEl = document.querySelector("[data-minutes]");
  const hoursEl = document.querySelector("[data-hours]");
  if (secondsEl && minutesEl && hoursEl) {
    let total = 6 * 60 * 60 + 34 * 60;
    setInterval(() => {
      total = Math.max(0, total - 1);
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }, 1000);
  }
})();
