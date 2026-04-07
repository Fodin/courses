# Task 14.2: Inverted Index Visualizer

## Goal

Implement an interactive visualizer that clearly demonstrates how an inverted index is built: tokenization, normalization, stemming, index construction, and search with TF-IDF scoring.

## Requirements

1. **Document input** (textarea):
   - User enters several documents (each line = a separate document)
   - "Build Index" button
   - Example documents are pre-filled

2. **Visualization of tokenization → normalization → index**:
   - Show for each document: original text → tokens → normalized → stemmed
   - Inverted index table: term → list of doc_ids with term frequency
   - Sort terms alphabetically

3. **Search through the index**:
   - Query input field
   - Found documents with matching terms highlighted
   - For multi-word queries — intersection of posting lists (AND logic)

4. **TF-IDF scoring**:
   - For each found document, show TF, IDF, and the resulting TF-IDF score
   - Sort results by descending score
   - Visually highlight the score (progress bar or color)

## Checklist

- [ ] Textarea for document input (each line = a document)
- [ ] "Build Index" button triggers indexing
- [ ] Tokenization table: doc → tokens → normalized → stems
- [ ] Inverted index table: term → doc_ids (with term frequency)
- [ ] Search field with AND logic for multi-word queries
- [ ] Search results with highlighted matching terms
- [ ] TF-IDF scoring for each result (TF, IDF, total)
- [ ] Results sorted by TF-IDF score

## How to check yourself

1. Enter 3-5 documents with overlapping words
2. Check: the inverted index contains all unique terms
3. Enter a single-word query — all documents with that word should be found
4. Enter a two-word query — only documents containing both should be found
5. Check: documents with higher TF-IDF rank higher in results
6. Check: a rare word (high IDF) contributes more than a common one
7. Compare your visualizer with the reference solution (Solution)
