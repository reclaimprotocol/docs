## 0.1.0

* JS SDK: `onError` callback now provides specific error messages indicating what went wrong during verification (proof generation failed, verification error, proof not verified, or proof submission failed) instead of generic errors
* Added EU region support documentation for JS SDK - use `https://eu.portal.reclaimprotocol.org` as `customSharePageUrl` to automatically route API requests to the EU backend
* **JS SDK**: When using a regional portal (any `customSharePageUrl` other than `share.reclaimprotocol.org` or `portal.reclaimprotocol.org`), you must now set a callback URL using `setAppCallbackUrl()`. The SDK throws a `CallbackUrlRequiredError` if missing.
* Added log event type documentation for inapp sdk and inapp react native sdk
