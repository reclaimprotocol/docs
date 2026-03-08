## 0.1.0

* Added `assertValidProof` documentation for JS SDK - an alternative to `verifyProof` that throws errors instead of returning a boolean
* Updated Provider Schema InjectionType enum to reflect actual values (HAWKEYE, NONE, CDP) instead of outdated MSWJS value
* JS SDK: `onError` callback now provides specific error messages indicating what went wrong during verification (proof generation failed, verification error, proof not verified, or proof submission failed) instead of generic errors
* Added EU region support documentation for JS SDK - use `https://eu.portal.reclaimprotocol.org` as `customSharePageUrl` to automatically route API requests to the EU backend
* **JS SDK**: When using a regional portal (any `customSharePageUrl` other than `share.reclaimprotocol.org` or `portal.reclaimprotocol.org`), you must now set a callback URL using `setAppCallbackUrl()`. The SDK throws a `CallbackUrlRequiredError` if missing.
* Added log event type documentation for inapp sdk and inapp react native sdk
