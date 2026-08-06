/**
 * Renders a schema.org block for search engines.
 *
 * The `<` escaping is the point: JSON.stringify output goes into the page
 * verbatim, so a literal "</script>" inside any string field (a course title,
 * an article description) would close the tag early and turn the rest of the
 * payload into markup. Escaping to < keeps the JSON valid and inert.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
