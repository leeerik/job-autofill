(async function () {
  const profile = await JobAutofillProfile.loadProfile();
  const safeKeys = new Set(["firstName", "lastName", "email", "phone", "linkedin", "github"]);

  function setValue(element, value) {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    if (!setter) return false;
    setter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("blur", { bubbles: true }));
    return true;
  }

  let filled = 0;
  for (const element of document.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], input:not([type])")) {
    if (element.disabled || element.readOnly || element.type === "hidden" || element.type === "file" || element.type === "checkbox" || element.type === "radio" || element.value) continue;
    const match = JobAutofillMatcher.matchField(element, profile);
    if (match.status !== "auto" || !safeKeys.has(match.key) || !match.value) continue;
    if (setValue(element, match.value)) filled++;
  }

  const status = document.createElement("div");
  status.textContent = `Job Autofill: ${filled} standard fields filled`;
  Object.assign(status.style, {
    position: "fixed",
    zIndex: "2147483647",
    right: "16px",
    bottom: "16px",
    padding: "12px 16px",
    background: "#12302b",
    color: "#fff",
    borderRadius: "8px",
    font: "14px system-ui"
  });
  document.body.appendChild(status);
  setTimeout(() => status.remove(), 3000);
})();
