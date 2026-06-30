/* ==========================================================================
   CONTACT PAGE SCRIPT
   There is no backend, so submitted messages are saved to localStorage
   under DAE.KEYS.CONTACT_MESSAGES purely so the admin dashboard has
   something real to display.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const message = {
      id: daeGenerateId("MSG"),
      name: document.getElementById("ct-name").value.trim(),
      email: document.getElementById("ct-email").value.trim(),
      subject: document.getElementById("ct-subject").value,
      message: document.getElementById("ct-message").value.trim(),
      date: new Date().toISOString(),
    };
    const messages = daeStoreGet(DAE.KEYS.CONTACT_MESSAGES, []);
    messages.unshift(message);
    daeStoreSet(DAE.KEYS.CONTACT_MESSAGES, messages);

    const alertBox = document.getElementById("contact-alert");
    alertBox.className = "alert alert-success";
    alertBox.textContent = "Thanks — your message has been sent. We typically reply within one business day.";
    alertBox.classList.remove("d-none");

    form.reset();
    form.classList.remove("was-validated");
  });
});
