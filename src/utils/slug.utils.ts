export function generateSlug(name: string, separator: string = '_'): string {
    return name.toLowerCase().split(' ').join(separator).trim();
}