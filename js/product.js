(() => {
  const buttons = document.querySelectorAll(".size-btn");
  const status = document.querySelector(".status");
  const form = document.querySelector(".stock-form");

  if (!buttons.length || !status) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-selected"));
      button.classList.add("is-selected");
      status.textContent = `${button.dataset.size} — sold out`;
      status.classList.add("is-visible");

      if (form) {
        form.querySelector(".stock-size").value = button.dataset.size;
        form.querySelector(".stock-form__note").textContent =
          `We'll email you when size ${button.dataset.size} is back.`;
        form.querySelector(".stock-form__status").textContent = "";
      }
    });
  });

  if (!form) return;

  const emailInput = form.elements.email;
  const sizeInput = form.querySelector(".stock-size");
  const submitButton = form.querySelector('button[type="submit"]');
  const formStatus = form.querySelector(".stock-form__status");
  const note = form.querySelector(".stock-form__note");

  const showFormStatus = (message, type = "") => {
    formStatus.textContent = message;
    formStatus.className = "stock-form__status";
    if (type) formStatus.classList.add(`is-${type}`);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showFormStatus("");

    if (!sizeInput.value) {
      showFormStatus("Select a size first.", "error");
      buttons[0].focus();
      return;
    }

    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Submission failed");

      const selectedSize = sizeInput.value;
      emailInput.value = "";
      showFormStatus(
        `You're on the list for size ${selectedSize}.`,
        "success"
      );
      note.textContent = "We'll only email you about this restock.";
    } catch (_) {
      showFormStatus("Could not save your email. Please try again.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Remind me";
    }
  });
})();
