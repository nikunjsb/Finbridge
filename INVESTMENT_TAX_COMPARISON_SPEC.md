# Personal tax and investment comparison — agreed requirements

Owner discussion: 14 November 2026. Today's scope is the shared situation questionnaire, two self-filing preparation journeys and this comparison definition. An automatic investment optimiser, complete tax assessment and ELSTER submission are **not implemented** by this release.

## Establish the baseline first

- Select the tax year. Separate payroll gross/net estimates from verified annual taxable income and final assessment. Never derive the latter from salary and tax class alone.
- Establish assessment eligibility, household income, residence/foreign income, children, benefits and relevant year-change dates. A class change is not itself an annual tax saving.
- Reconcile existing work costs, second-household costs, special expenses, direct credits, reimbursements and automatic allowances. Do not reuse a cost in multiple categories or count an already claimed deduction as a new investment benefit.
- Require tax withheld and other payments before showing a refund/payable estimate. Otherwise show only the incremental modelled tax effect, subject to the assessment's supported scope.
- Gate foreign-income, progression, mixed business, property and other complex cases until their models and references are supported. An unsupported result is unknown, not a zero benefit.

## Affordability and preferences

The current companion collects an optional annual contribution budget, horizon and liquidity preference. Subsequent implementation must also gather household spending, existing commitments and debt, emergency reserves, existing pension contributions/limits, risk tolerance, goals and expected country of residence. Reuse existing salary/budget entries only through an explicit import/review action; never silently assume they are current.

## Routes to model separately

| Route | Immediate-tax treatment to verify | Additional inputs / comparison requirements |
|---|---|---|
| Ordinary ETF / securities account | No general salary-income deduction for buying units; investment-income rules are a separate model | Fund classification, allowances used elsewhere, distributions, advance taxation, sale timing, fees, capital losses and foreign taxes |
| Employer pension | Payroll tax/social-insurance effects and employer contribution, with verified year limits | Existing arrangements, contribution method, employer top-up, net-pay effect, benefit/social-insurance consequences and later payouts |
| Rürup / eligible basic pension | Eligibility, current annual room after existing pension contributions and year rules | Contract costs, qualifying contributions, retirement lock-in and later taxable pension |
| Riester, where eligible | Eligibility, allowances and interaction with special-expense comparison | Household/child facts, qualifying income, existing contracts, own contributions and later payouts |
| Rental property | Taxable rent versus eligible costs/depreciation; no blanket purchase-price deduction | Cash deposit, purchase costs, loan interest versus principal, building/land split, rent, vacancy, maintenance, disposal and financing risk |
| Physical gold | Purchase is not a general salary-tax deduction; assess disposal rules separately | Product type, acquisition/disposal dates, costs, spreads, storage, holding period and residence |

Buying a primary residence, a qualifying work accommodation property and a rental property require distinct scenarios. Gold securities and physical gold must not be assumed to share identical treatment. Verify each route with current primary sources before numerical release.

## Outputs and interaction

For each scenario show contribution, subsidy/employer money, incremental current tax effect, actual net cash cost, up-front capital, ongoing commitments, fees, accessible capital, locked capital, later taxes and projected after-tax wealth. Provide the no-change baseline and low/base/high assumptions. Describe tax deferral separately from permanent relief; distinguish a deduction, direct tax credit, subsidy and refund.

Offer two explicit objectives: highest estimated current tax saving among supported feasible allocations, and projected after-tax wealth under selected assumptions. The second is a scenario, never a guaranteed maximum return. Compare options at equal net personal cost, including timing/reinvestment assumptions for tax savings; property financing also requires liquidity constraints. Allow users to exclude property, retirement lock-in or other unsuitable routes. Show where contribution relief is exhausted and explain rejected/unassessed options.

## Release gates

- Year-versioned primary-source rules and independently worked reference fixtures per route; no numerical ranking until at least two supported routes can be compared fairly.
- Check existing contribution room, reimbursement/deduction overlap, household allocations, uncertainty, rounding and zero-tax cases.
- Test missing/contradictory data, budget and horizon boundaries, infeasible allocations, marginal-tax changes, contribution caps, fees and later taxation.
- Changing facts invalidates old results. Downloads preserve selected year, assumptions and limitations. Browser-local operation and opt-in persistence remain consistent with existing privacy behavior.
- Manual slider results and automatic search agree on fixed examples. Desktop/mobile, keyboard, exports, baseline regression and live-asset freshness checks pass before completion.

Sunday 15 November operational/accessibility reviews, Friday 20 November security work and 22 November hosting review retain their existing scope. The relocation/double-household extension TS04 remains pending.
