function normaliseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function toTokens(values: Array<string | null | undefined>): string[] {
  return values
    .filter((v): v is string => typeof v === 'string')
    .map((v) => normaliseWhitespace(v).toLowerCase())
    .filter(Boolean);
}

/**
 * Build a single denormalised string for keyword searching.
 *
 * Keep it simple and predictable: lowercase, whitespace-normalised, space-delimited.
 * Do not attempt stemming/ranking here.
 */
export function buildProductSearchText(input: {
  title?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  fips_id?: string | null;
  category_values?: Array<{
    name?: string | null;
    short_description?: string | null;
    parent?: { name?: string | null } | null;
    search_text?: string | null;
  }> | null;
}): string {
  // Prefer category_value search_text if available, otherwise build from individual fields
  const categoryNames: string[] =
    input.category_values?.flatMap((cv) => {
      if (cv?.search_text) {
        // Use pre-computed search_text from category value
        // Split by commas first, then tokenize each part
        const commaSeparated = cv.search_text.split(',').map(s => s.trim()).filter(Boolean);
        return toTokens(commaSeparated);
      }
      // Fallback: build from individual fields
      return toTokens([cv?.name, cv?.parent?.name]);
    }) ?? [];

  const parts = toTokens([
    input.title ?? null,
    input.short_description ?? null,
    input.long_description ?? null,
    input.fips_id ?? null,
  ]).concat(categoryNames);

  // De-dupe again across all parts
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }

  return out.join(' ');
}

/**
 * Build search_text for a category value.
 * Includes: name, short_description, and parent name.
 */
export function buildCategoryValueSearchText(input: {
  name?: string | null;
  short_description?: string | null;
  parent?: { name?: string | null } | null;
}): string {
  const parts = toTokens([
    input.name ?? null,
    input.short_description ?? null,
    input.parent?.name ?? null,
  ]);

  // De-dupe
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }

  return out.join(' ');
}
