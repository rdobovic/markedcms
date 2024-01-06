import unidecode from 'unidecode';

// Function that converts title to url friendly slug
export default function titleToSlug(title) {
    // Trim spaces and convert letters to lower
    title = title.trim().toLowerCase();
    // Replace all spaces and underscored with dashes
    title = title.replace(/(\s+)|(_+)/g, '-');
    // Normalize special characters, remove all left non-alphanumerical
    // characters and remove extra dashes from start or end if present
    return unidecode(title).replace(/[^a-z0-9\-]/g, '').replace(/^\-+|\-+$/g, '');
}