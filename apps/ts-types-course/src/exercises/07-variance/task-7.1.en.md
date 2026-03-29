# Task 7.1: Covariance & Contravariance

## Goal

Understand and demonstrate covariance (output position) and contravariance (input position) of types in TypeScript. Show how `Array<Dog>` relates to `Array<Animal>`, why function parameters are contravariant, and how this affects generic interface design.

## Requirements

1. Create a type hierarchy `Animal -> Dog -> GuideDog` with characteristic fields
2. Demonstrate array covariance: `Dog[]` -> `readonly Animal[]`
3. Show function parameter contravariance: `AnimalHandler` is assignable to `DogHandler`
4. Implement return type covariance: `DogFactory` -> `AnimalFactory`
5. Create generic interfaces `Producer<T>` (covariant) and `Consumer<T>` (contravariant) and show valid assignments
6. Demonstrate invariance of a `Box<T>` interface with `get()` and `set()` methods
7. Show covariance of `Promise<Dog>` -> `Promise<Animal>`

## Checklist

- [ ] `Animal -> Dog -> GuideDog` hierarchy created with unique fields at each level
- [ ] Array covariance demonstrated with `readonly`
- [ ] Callback contravariance shown with `Handler<T>` example
- [ ] `Producer<T>` and `Consumer<T>` correctly demonstrate co- and contravariance
- [ ] `Box<T>` invariance explained through read+write positions
- [ ] All results displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that `Producer<Dog>` is successfully assigned to `Producer<Animal>`
3. Verify that `Consumer<Animal>` is assigned to `Consumer<Dog>`
4. Check that the `Box<T>` invariance description is correct
