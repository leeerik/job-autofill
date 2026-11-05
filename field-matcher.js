(function () {
  const fields = {
    firstName: {
      aliases: ["first name", "firstname", "given name", "forename"],
      autocomplete: ["given-name"]
    },
    lastName: {
      aliases: ["last name", "lastname", "family name", "surname"],
      autocomplete: ["family-name"]
    },
    email: {
      aliases: ["email", "e-mail", "email address"],
      autocomplete: ["email"]
    },
    phone: {
      aliases: ["phone", "mobile", "telephone", "tel", "phone number"],
      autocomplete: ["tel", "tel-national"]
    },
    linkedin: {
      aliases: ["linkedin", "linkedin profile", "linkedin url"],
      autocomplete: []
    },
    github: {
      aliases: ["github", "github profile", "github url"],
      autocomplete: []
    }
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function metadataFor(element) {
    return {
      autocomplete: normalize(element.autocomplete),
      label: normalize([...(element.labels || [])].map(label => label.textContent).join(" ")),
      ariaLabel: normalize(element.getAttribute("aria-label")),
      name: normalize(element.name),
      id: normalize(element.id),
      placeholder: normalize(element.placeholder)
    };
  }

  function matchesAlias(value, alias) {
    const target = normalize(alias);
    return value === target || value.split(" ").includes(target) || value.includes(target);
  }

  function matchField(element, profile) {
    const metadata = metadataFor(element);
    const matches = [];

    for (const [key, definition] of Object.entries(fields)) {
      if (!profile[key]) continue;
      if (definition.autocomplete.some(value => metadata.autocomplete === normalize(value))) {
        matches.push({ key, value: String(profile[key]), confidence: 1, source: "autocomplete" });
        continue;
      }
      const sources = ["label", "ariaLabel", "name", "id", "placeholder"];
      const source = sources.find(name => definition.aliases.some(alias => matchesAlias(metadata[name], alias)));
      if (source) matches.push({ key, value: String(profile[key]), confidence: source === "label" || source === "ariaLabel" ? 0.95 : 0.9, source });
    }

    if (matches.length !== 1) return { status: "ignored", candidates: matches };
    return { ...matches[0], status: "auto", candidates: matches };
  }

  globalThis.JobAutofillMatcher = {
    fields,
    normalize,
    metadataFor,
    matchField,
    valueFor: (profile, key) => String(profile[key] || "")
  };
})();
