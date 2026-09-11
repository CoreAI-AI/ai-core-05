# Complete CoreAI Premium Plans Flow

## What will change
- Add a dedicated **Plans** page that shows Free, Monthly, Quarterly, and Yearly plans on mobile, desktop, and TV.
- Add a **Plans** entry in CoreAI navigation so users can open the page anytime.
- Make Premium/subscription chat requests open the plans interface every time, including “show plans again” requests.
- If Premium is already active, show a clear English message with the current plan and included benefits while still showing all plans.
- Remove UPI and card payment actions for now. Selecting a paid plan will only open the redeem-code option.
- Keep the existing redeem code as the only working activation method and preserve the selected plan after successful redemption.

## Technical details
- Reuse the existing pricing cards to keep pricing consistent across chat and the new Plans page.
- Simplify the current payment dialog into a redeem-only dialog; no fake payment success paths remain.
- Update subscription intent matching for repeated requests such as “one more time,” “show plans again,” and Hinglish equivalents.
- Verify the flow and current build after implementation.
