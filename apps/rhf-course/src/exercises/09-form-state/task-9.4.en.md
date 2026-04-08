# Exercise 9.4: Dirty Fields Only Submit

## Goal

Learn to use dirtyFields to submit only changed data (PATCH request).

## Requirements

Create a profile edit form with pre-filled data:

1. **Fields**: first name, last name, email, bio, city — all pre-filled from a "saved profile"
2. **dirtyFields**: visually mark changed fields (a "changed" indicator)
3. **On submit**: display two blocks:
   - PATCH (only changed fields from dirtyFields)
   - PUT (all form data)
4. **"Save" button** is disabled when the form has not been modified (isDirty === false)
5. **Live preview**: show which fields have been changed before submission

## Checklist

- [ ] Form is pre-filled with profile data
- [ ] Changed fields have a "changed" indicator
- [ ] Status block shows "Has changes" / "No changes"
- [ ] When there are changes, a preview of dirty data is shown
- [ ] "Save" button is disabled when there are no changes
- [ ] After submit — two blocks: PATCH (dirty) and PUT (all)

## How to verify

1. Open the form — all fields are filled, "Save" button is disabled
2. Change the first name — "changed" indicator appears, button becomes enabled
3. The status block shows what data would be submitted
4. Change email too — preview shows two changed fields
5. Click "Save" — PATCH contains only changed fields, PUT contains all data
