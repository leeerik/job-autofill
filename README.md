# Job Autofill

A privacy-first Chrome Manifest V3 extension that fills empty job application fields from a profile stored in `chrome.storage.local`.

## Install

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this folder.
4. Open the extension popup, complete the profile, and save it.

## Use

Open an application on any page with a form, then choose **Autofill six fields**. The extension fills only empty, high-confidence first name, last name, email, phone, LinkedIn, and GitHub inputs. LinkedIn and GitHub values are kept as entered, without automatically adding `https://`. It never submits the application. Dropdowns, custom widgets, application questions, files, and ambiguous matches are intentionally skipped.

The matcher recognizes common labels, names, IDs, placeholders, `autocomplete`, and associated `<label>` elements for the six supported fields. LinkedIn and GitHub use explicit labels or field names rather than generic URL autocomplete, which avoids confusing the two.

The simplified runtime does not open a review panel or use AI. This keeps the autofill path predictable: a field must be a standard control with a high-confidence deterministic match or it is ignored.

## Architecture

The extension uses a small deterministic runtime:

- `profile.js` owns the local six-field profile.
- `field-matcher.js` ranks first name, last name, email, phone, LinkedIn, and GitHub using normalized form metadata and confidence evidence.
- `content.js` fills only high-confidence text-like inputs for those six fields.
- `popup.html` and `popup.js` expose only the six supported profile fields.

No dropdown, application-specific answer, demographic disclosure, file upload, custom widget, country code, or AI suggestion is inferred or populated.

## Testing

Open `tests/matcher.test.html` directly in Chrome to run the supported-field matcher tests. Confirm that only empty standard inputs with clear labels or autocomplete values are filled, existing values remain unchanged, dropdowns and custom widgets are skipped, and no submit action occurs.

## Privacy and limitations

The six profile fields are kept locally in `chrome.storage.local`. No network requests are made and there is no automatic submission. All fields outside the six supported inputs are intentionally ignored.
