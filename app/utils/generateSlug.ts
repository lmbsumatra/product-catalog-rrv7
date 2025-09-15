export default function generateSlug(name: string): string {
    const baseSlug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const randomString = Math.random().toString(36).substring(2, 8);

    return `${baseSlug}-${randomString}`;
}
