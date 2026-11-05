const form = document.getElementById("profileForm");
const status = document.getElementById("status");
const keys = ["firstName", "lastName", "email", "phone", "linkedin", "github"];

function setStatus(message, isError = false) {
  status.textContent = message;
  status.style.color = isError ? "#a63e25" : "";
}

async function loadProfile() {
  const profile = await JobAutofillProfile.loadProfile();
  for (const key of keys) form.elements[key].value = profile[key] || "";
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const profile = {};
  for (const key of keys) profile[key] = form.elements[key].value.trim();
  await JobAutofillProfile.saveProfile(profile);
  setStatus("Profile saved locally.");
});

document.getElementById("autofill").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab");
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["profile.js", "field-matcher.js", "content.js"] });
    setStatus("Four standard fields autofilled. Everything else was ignored.");
  } catch (error) {
    setStatus(`Unable to autofill this page: ${error.message}`, true);
  }
});

loadProfile().catch(error => setStatus(`Could not load profile: ${error.message}`, true));
