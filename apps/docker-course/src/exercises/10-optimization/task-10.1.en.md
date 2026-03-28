# Task 10.1: Analyzing and Reducing Image Size

## Objective

Learn to analyze Docker image size using `docker history`, `docker image inspect`, and `dive`; understand the differences between base image variants (full, slim, alpine, distroless, scratch) and how they affect the final image size.

## Requirements

1. Create a component with two switchable sections: "Analysis Tools" and "Base Image Comparison"
2. The "Analysis Tools" section shows a table of tools (`docker history`, `docker image inspect`, `dive`) with a description, command, and what each tool shows
3. For each tool, add a "Show sample output" button — clicking it displays a block with a sample console output
4. The "Base Image Comparison" section shows a table of image types (full, slim, alpine, distroless, scratch) with size, description of contents, and when to use each
5. Add a visualization: horizontal progress bars showing the relative size of each image type (full = 100%)
6. At the bottom of the component: a "Key Takeaway" block with a recommendation for choosing a base image

## Hints

- `useState<string>` for the active section
- `useState<Record<string, boolean>>` to manage the visibility of sample output for each tool
- Progress bars: `div` with `width` as a percentage and `backgroundColor`
- Array of objects for images: `{ name, example, size, sizePercent, description, useCase }`

## Checklist

- [ ] Two sections switch correctly
- [ ] Analysis tools table (3 tools)
- [ ] Sample output buttons work independently
- [ ] Base image table (5 types) with sizes
- [ ] Visual size progress bars
- [ ] "Key Takeaway" block with a recommendation

## How to Verify

1. Switch between sections — the content changes
2. In "Analysis Tools", click the sample buttons — the sample output is shown/hidden independently
3. In "Base Image Comparison", all 5 types are visible with sizes and progress bars
4. Progress bars visually reflect the size differences (scratch — minimum, full — maximum)
5. The recommendation block is always visible
