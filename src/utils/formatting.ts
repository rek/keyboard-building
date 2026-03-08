export function formatId(id: string): string {
  if (!id) return ''
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
