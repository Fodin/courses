# Task 5.3: tuple

## Objective

Learn to use `tuple()` to validate fixed-length arrays with differently typed elements.

## Requirements

1. Create `coordinatesSchema` — a tuple [latitude, longitude]:
   - latitude: number, required, min(-90), max(90)
   - longitude: number, required, min(-180), max(180)

2. Create `personTupleSchema` — a tuple [name, age, role]:
   - name: string, required
   - age: number, required, positive, integer
   - role: string, required, oneOf(['admin', 'user', 'guest'])

3. Use `.label()` for tuple elements

4. Implement separate input fields for each tuple element

## Checklist

- [ ] `coordinatesSchema` validates lat/lng ranges
- [ ] `personTupleSchema` uses `oneOf()` for role
- [ ] Tuple elements have `.label()` for readable errors
- [ ] Empty fields are handled as undefined
- [ ] Role is selected via `<select>`

## How to verify

1. Coordinates: [55.7558, 37.6173] — success (Moscow)
2. Coordinates: [91, 0] — error (latitude > 90)
3. Coordinates: empty — required error
4. Person: ["Alice", 25, "admin"] — success
5. Person: ["Alice", -1, "admin"] — error (age not positive)
6. Person: ["Alice", 25, "superadmin"] — error (role not in the list)
