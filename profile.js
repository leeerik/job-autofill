(function () {
  const defaultProfile = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: ""
  };

  function normalizeProfile(profile) {
    const normalized = { ...defaultProfile, ...(profile || {}) };
    normalized.phone = String(normalized.phone || "").trim();
    normalized.firstName = String(normalized.firstName || "").trim();
    normalized.lastName = String(normalized.lastName || "").trim();
    normalized.email = String(normalized.email || "").trim();
    normalized.linkedin = normalizeSocialValue(normalized.linkedin);
    normalized.github = normalizeSocialValue(normalized.github);
    return normalized;
  }

  function normalizeSocialValue(value) {
    return String(value || "").trim().replace(/^@/, "");
  }

  async function loadProfile() {
    const result = await chrome.storage.local.get("profile");
    return normalizeProfile(result.profile);
  }

  async function saveProfile(profile) {
    const normalized = normalizeProfile(profile);
    await chrome.storage.local.set({ profile: normalized });
    return normalized;
  }

  globalThis.JobAutofillProfile = { defaultProfile, normalizeProfile, loadProfile, saveProfile };
})();
