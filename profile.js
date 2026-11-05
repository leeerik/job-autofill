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
    normalized.linkedin = normalizeLink(normalized.linkedin, "https://linkedin.com/in/");
    normalized.github = normalizeLink(normalized.github, "https://github.com/");
    return normalized;
  }

  function normalizeLink(value, profilePrefix) {
    const link = String(value || "").trim();
    if (!link) return "";
    if (/^https?:\/\//i.test(link)) return link;
    if (/^(www\.)?(linkedin\.com|github\.com)\//i.test(link)) return `https://${link}`;
    if (!/[\s/]/.test(link)) return `${profilePrefix}${link.replace(/^@/, "")}`;
    return `https://${link}`;
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
