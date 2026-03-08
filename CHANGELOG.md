## 0.2.0

* Added Analytics Dashboard documentation for the Developer Portal, including time range filters and OS-based device breakdown
* Added Device-Based Analytics documentation explaining device metrics (Total Devices, Devices with Proofs, Device Conversion Rate)
* Added Live Feed documentation with session status indicators and provider information
* Added Session Details documentation covering status, location, device, and provider cards
* Added Short Summary documentation showing chronological session events timeline with timestamps and human-readable labels
* Updated Related Sessions documentation to explain device-based session grouping
* Added AI Analysis (Beta) documentation with interactive chat and admin prompt customization
* Fixed session status misclassification in the Live Feed where sessions with successful proof submissions would incorrectly show as "dropped off" instead of "successful"

## 0.1.0

* Added `assertValidProof` documentation for JS SDK - an alternative to `verifyProof` that throws errors instead of returning a boolean
* Updated Provider Schema InjectionType enum to reflect actual values (HAWKEYE, NONE, CDP) instead of outdated MSWJS value
* JS SDK: `onError` callback now provides specific error messages indicating what went wrong during verification (proof generation failed, verification error, proof not verified, or proof submission failed) instead of generic errors
* Added EU region support documentation for JS SDK - use `https://eu.portal.reclaimprotocol.org` as `customSharePageUrl` to automatically route API requests to the EU backend
* **JS SDK**: When using a regional portal (any `customSharePageUrl` other than `share.reclaimprotocol.org` or `portal.reclaimprotocol.org`), you must now set a callback URL using `setAppCallbackUrl()`. The SDK throws a `CallbackUrlRequiredError` if missing.
* Added log event type documentation for inapp sdk and inapp react native sdk
