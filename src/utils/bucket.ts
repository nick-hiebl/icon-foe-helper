export function contains(outer: string, query: string) {
  return outer.toLocaleLowerCase().includes(query)
}

type SearchResults<T> = { section: string; items: T[] }[]

export function bucket<T, K>(items: T[], labeler: (t: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>()

  items.forEach((item) => {
    const key = labeler(item)

    const list = map.get(key) || []

    map.set(key, list)

    list.push(item)
  })

  return map
}

type Matcher<I, K> = (query: string, t: I) => K

export function search<I, K>(items: I[], categories: [K, string][], matcher: Matcher<I, K>, searchQuery: string): SearchResults<I> {
  if (!searchQuery) {
    return [{ section: 'All', items }]
  }

  const buckets = bucket<I, K>(items, (item) => matcher(searchQuery, item))

  return categories
    .map(([key, label]) => ({
      section: label,
      items: buckets.get(key) || []
    }))
    .filter((category) => category.items.length > 0)
}
