export function parseQueryIds(query: string): string[] {
    return query.split(',').filter((item: string): boolean => !isNaN(Number(item)));
}