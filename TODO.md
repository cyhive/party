# TODO: Remove Firebase and Unwanted Dependencies

## Files to Delete

- [x] Delete entire `src/firebase/` directory
- [x] Delete `firestore.rules`
- [x] Delete `apphosting.yaml`
- [x] Delete `src/components/FirebaseErrorListener.tsx`

## Dependencies to Remove

- [x] Remove "firebase": "^11.9.1" from package.json
- [x] Remove "@genkit-ai/google-genai": "^1.20.0" from package.json
- [x] Remove "@genkit-ai/next": "^1.20.0" from package.json
- [x] Remove "genkit": "^1.20.0" from package.json
- [x] Remove "genkit-cli": "^1.20.0" from devDependencies from package.json

## Code Updates

- [x] Remove FirebaseClientProvider from `src/app/layout.tsx`
- [x] Remove firebase entries from `.gitignore`

## Verification

- [x] Run npm install to update dependencies
- [x] Check for any remaining Firebase references in codebase
- [x] Test that the application still works without Firebase
