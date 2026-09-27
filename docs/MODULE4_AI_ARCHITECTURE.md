# BuildConnect Module 4 — AI Recommendation Engine Architecture

## 1. System Classification Notice
> [!IMPORTANT]
> **CURRENT SYSTEM CLASSIFICATION**: Explainable Multi-Factor Heuristic Recommendation Engine.
> This system uses deterministic rule-based candidate filtering, trade keyword inference, Haversine geographic distance calculation, rating scaling, and score aggregation. It does NOT utilize machine learning models (such as neural networks or regression models) as no trained ML artifacts exist in the repository.

---

## 2. High-Level Recommendation Pipeline Architecture

```
[ Customer Requirement Request ]
(prompt, profession, skills, user_latitude, user_longitude, max_distance_km, preferred_availability, min_rating)
                                │
                                ▼
         [ Step 1: Candidate Filtering Engine ]
  (Eliminates non-matching trade, busy workers, over-budget, or out-of-range candidates)
                                │
                                ▼
       [ Step 2: Multi-Factor Scoring Matrix ]
  ┌──────────────────────────────────────────────────────────┐
  │ Factor                    │ Scoring Type │ Max Points    │
  ├───────────────────────────┼──────────────┼───────────────┤
  │ Trade / Profession Match  │ Points       │ 30 pts        │
  │ Specialized Skill Match   │ Points       │ 25 pts        │
  │ Geographic Proximity      │ Points       │ 20 pts        │
  │ Customer Rating           │ Points       │ 15 pts        │
  │ Preferred Availability    │ Points       │ 10 pts        │
  │ Experience & Trust        │ Points       │ 10 pts        │
  ├───────────────────────────┼──────────────┼───────────────┤
  │ Total Raw Accumulator     │ Points       │ 110 pts       │
  └───────────────────────────┴──────────────┴───────────────┘
                                │
                                ▼
         [ Step 3: Explanation Generator ]
  (Constructs human-readable, fact-backed explanation arrays)
                                │
                                ▼
       [ Step 4: Deterministic Tie-Breaking ]
  (Score desc ➔ Rating desc ➔ Total Jobs desc ➔ Worker ID asc)
                                │
                                ▼
         [ Ranked Worker Recommendations ]
  (Output matchScore is clamped to 0–100% range [35%–99%])
```

---

## 3. Mathematical Scoring Specification

For candidate worker $w$ and recommendation input $I$:

$$\text{RawScore}(w, I) = S_{\text{trade}} + S_{\text{skill}} + S_{\text{proximity}} + S_{\text{rating}} + S_{\text{avail}} + S_{\text{exp}}$$

$$\text{MatchScore}(w, I) = \min\left(99, \max\left(35, \text{RawScore}(w, I)\right)\right)$$

Where:
- $S_{\text{trade}} = 30$ if exact profession match; $25$ if prompt contains profession name; $20$ if keyword matches trade domain; $10$ baseline (Max: 30 pts).
- $S_{\text{skill}} = \min(25, 10 \times \text{number of matching skills})$ (Max: 25 pts).
- $S_{\text{proximity}} = 20$ if distance $\le 2\text{ km}$; $16$ if $\le 5\text{ km}$; $12$ if $\le 10\text{ km}$; $14$ if city matches without coordinates (Max: 20 pts).
- $S_{\text{rating}} = \text{round}\left(\min\left(15, \max\left(5, \frac{\text{Rating} - 3.5}{1.5} \times 15\right)\right)\right)$ (Max: 15 pts).
- $S_{\text{avail}} = 10$ if matching availability or `'Available Today'`; $8$ if `'Available Tomorrow'`; $6$ default (Max: 10 pts).
- $S_{\text{exp}} = (5 \text{ if experience } \ge 5\text{ yrs else } 2) + (5 \text{ if trust score } \ge 90\text{ else } 3)$ (Max: 10 pts).

---

## 4. Geographic Distance Calculation

Haversine distance formula:

$$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$

Where $R = 6371\text{ km}$, $\phi_1, \phi_2$ are latitudes, and $\lambda_1, \lambda_2$ are longitudes.

---

## 5. Missing Data Handling Strategy

- **Missing Coordinates**: Fall back to city-level string comparison ($S_{\text{proximity}} = 14\text{ pts}$), no fabricated distance.
- **Missing Experience / Rating**: Neutral baseline scores ($S_{\text{rating}} = 10\text{ pts}$, $S_{\text{exp}} = 5\text{ pts}$).
- **Missing Skills**: Trade profession keyword fallback matching.

---

## 6. Future Machine Learning Roadmap (Phase 14)

```
[ Historical Bookings & Reviews ]  ──┐
[ Customer Search Query History ] ──┼──▶ [ Feature Engineering ] ──▶ [ Gradient Boosted / Neural Ranker ] ──▶ [ Ranked Workers API ]
[ Worker Conversion Rates ]        ──┘
```
In future releases, as transaction logs accumulate in Supabase, a machine learning model (e.g. LightGBM or XGBoost Ranker) can replace the heuristic weights without changing the API contract.
