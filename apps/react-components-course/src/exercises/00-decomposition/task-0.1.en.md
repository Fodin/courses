# Task 0.1: Decompose a monolithic ProductPage

## Goal

Take the monolithic `ProductPage` component (~200 lines) and decompose it into four independent components: `ProductCard`, `ReviewsList`, `AddToCartForm`, `RelatedProducts`.

## Requirements

1. Create a `ProductCard` component that takes a `product` object and displays the image, name, description, and price
2. Create a `ReviewsList` component that takes a `reviews` array and displays each review with author, star rating, and text
3. Create an `AddToCartForm` component that manages product quantity (`useState`) and has an "Add to cart" button with visual confirmation
4. Create a `RelatedProducts` component that takes a `products` array and displays them in a horizontal tile layout
5. The `Task0_1` component should be the orchestrator: stores data in state, renders four child components
6. Each component is typed — no `any`

## Hints

- Define interfaces first (`Product`, `Review`) — this will help understand what props are needed
- `AddToCartForm` manages only its local state (quantity, "added" status)
- `ProductCard` and `ReviewsList` are dumb components — they have no state
- Start by moving JSX, then remove unnecessary dependencies

## Checklist

- [ ] `Product` and `Review` interfaces defined
- [ ] `ProductCard` accepts `product: Product` and renders image, name, price
- [ ] `ReviewsList` accepts `reviews: Review[]` and renders a list
- [ ] `AddToCartForm` has state for quantity and add status
- [ ] `RelatedProducts` accepts `products: Product[]` and renders a tile layout
- [ ] `Task0_1` renders all four components
- [ ] No `any` in types

## How to check yourself

Open the assignment in the browser. You should see:
- A product card with image and price
- A form with quantity field and "Add to cart" button (button changes text after click)
- A reviews list with star ratings
- A row of related products

Try clicking "Add to cart" — the button should show "Added!" for 2 seconds.
