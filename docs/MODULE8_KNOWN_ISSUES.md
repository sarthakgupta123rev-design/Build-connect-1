# BuildConnect — Module 8 Known Issues & Severity Matrix

## Issue Classification Matrix

| Issue ID | Classification | Subsystem | Issue Description | Mitigation / Workaround |
| :--- | :--- | :--- | :--- | :--- |
| **ISSUE-01** | **LOW** | Web Hosting (Render) | Free-tier Web Services enter sleep mode after 15 minutes of inactivity, causing a ~450ms cold-start delay on first HTTP request. | Production deployments on paid or auto-pinging tiers bypass sleep mode. |
| **ISSUE-02** | **INFORMATIONAL** | Frontend (Vite) | Vite build emits chunk size warning (> 500 kB) for single vendor bundle. | App renders cleanly; code-splitting via dynamic imports (`React.lazy`) can be added in future optimizations. |
| **ISSUE-03** | **INFORMATIONAL** | Payments | Real financial transactions are disabled by design; payment gateway operates in Sandbox/Stub mode. | Integration tests verify order creation and signature validation without charging live credit cards. |

---

## Severity Definitions
- **BLOCKER**: 0 identified (Prevents safe public operation).
- **HIGH**: 0 identified (Important security or functional defect).
- **MEDIUM**: 0 identified (Meaningful defect with workaround).
- **LOW**: 1 identified (Minor operational performance observation).
- **INFORMATIONAL**: 2 identified (Documentation & architecture observations).

---

## Production Readiness Classification
**PRODUCTION STATUS: READY WITH KNOWN LIMITATIONS**
(Zero BLOCKER or HIGH issues remain unresolved).
