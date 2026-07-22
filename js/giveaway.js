(() => {
  const form = document.querySelector(".giveaway-form");
  if (!form) return;

  const driverInputs = [
    form.elements.first_place,
    form.elements.second_place,
    form.elements.third_place,
  ];
  const contactInput = form.elements.contact;
  const submitButton = form.querySelector(".giveaway-submit");
  const status = form.querySelector(".giveaway-status");

  const showStatus = (message, type = "") => {
    status.textContent = message;
    status.className = "giveaway-status";
    if (type) status.classList.add(`is-${type}`);
  };

  const validateEntry = () => {
    driverInputs.forEach((input) => input.setCustomValidity(""));
    contactInput.setCustomValidity("");

    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }

    const picks = driverInputs.map((input) => input.value.trim().toLowerCase());
    const duplicateIndex = picks.findIndex(
      (pick, index) => picks.indexOf(pick) !== index
    );

    if (duplicateIndex !== -1) {
      driverInputs[duplicateIndex].setCustomValidity(
        "Choose a different driver for each position."
      );
      driverInputs[duplicateIndex].reportValidity();
      return false;
    }

    const contact = contactInput.value.trim();
    const isInstagram = /^@[a-zA-Z0-9._]{1,30}$/.test(contact);

    if (!isInstagram) {
      contactInput.setCustomValidity("Enter a valid Instagram handle beginning with @.");
      contactInput.reportValidity();
      return false;
    }

    return true;
  };

  [...driverInputs, contactInput].forEach((input) => {
    input.addEventListener("input", () => input.setCustomValidity(""));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showStatus("");
    if (!validateEntry()) return;

    submitButton.disabled = true;
    submitButton.textContent = "SUBMITTING...";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Submission failed");

      form.reset();
      showStatus("Entry received. Good luck!", "success");
    } catch (_) {
      showStatus(
        "Your entry could not be sent. Please try again.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "SUBMIT ENTRY";
    }
  });
})();
