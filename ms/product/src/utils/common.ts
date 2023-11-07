export const generateSlug = (slug: string): string => {
    return slug.toLowerCase().replace(/[^\w-]+/g, '-')
}
