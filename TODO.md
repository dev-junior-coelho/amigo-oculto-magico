# Task: Amigo Oculto Mágico - Secret Santa Application

## Plan
- [x] 1. Setup Supabase Database
  - [x] 1.1 Initialize Supabase
  - [x] 1.2 Create database schema (groups and matches tables)
  - [x] 1.3 Setup types and API utilities
- [x] 2. Create Encryption/Decryption Utilities
  - [x] 2.1 Implement crypto utilities for token generation
  - [x] 2.2 Create encryption/decryption functions
- [x] 3. Design System Configuration
  - [x] 3.1 Update index.css with WhatsApp green theme
  - [x] 3.2 Configure tailwind.config.js with semantic tokens
- [x] 4. Build Admin Setup Page
  - [x] 4.1 Create participant input form
  - [x] 4.2 Implement participant list with removal
  - [x] 4.3 Add draw/lottery logic
  - [x] 4.4 Validate minimum 3 participants
- [x] 5. Build Admin Distribution Page
  - [x] 5.1 Display all participants with phone numbers
  - [x] 5.2 Add WhatsApp send button with pre-filled message
  - [x] 5.3 Add copy token button
- [x] 6. Build Participant Reveal Page
  - [x] 6.1 Auto-read token from URL
  - [x] 6.2 Manual token input field
  - [x] 6.3 Decrypt and display assigned person
  - [x] 6.4 Error handling for invalid tokens
- [x] 7. Setup Routing
  - [x] 7.1 Configure routes for all pages
  - [x] 7.2 Setup navigation
- [x] 8. Testing and Validation
  - [x] 8.1 Run lint checks
  - [x] 8.2 Update index.html with proper title and metadata
  - [x] 8.3 Verify all components are properly integrated

## Notes
- Using Supabase instead of Firebase Firestore for easier integration
- WhatsApp integration via web.whatsapp.com URL scheme (no API key needed)
- Primary color: #25D366 (WhatsApp green) - HSL: 142 70% 49%
- Encryption: AES-256-GCM for secure data storage
- Token structure: Unique 64-character hex string for each participant
- All data is encrypted client-side before storage
- Admin token allows access to distribution page
- Participant tokens allow decryption of their assigned person only

## Implementation Summary
✅ Complete Supabase database with groups and matches tables
✅ Secure encryption/decryption using Web Crypto API
✅ WhatsApp green theme with monochromatic color scheme
✅ Admin Setup page with participant management
✅ Admin Distribution page with WhatsApp integration
✅ Participant Reveal page with automatic and manual token input
✅ Full routing configuration with proper navigation
✅ All lint checks passed
✅ Responsive design for mobile and desktop
