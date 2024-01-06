// Simple function used to choose value of form field on page load,
// it searches in form and data objects and returns first value it finds
// for given field or default value if nothing is found

export default function getOldFunction (pageData, formData) {
    return (name, defaultVal) => {
        
        const res = (formData) ? formData?.[name] : (
            pageData?.[name] ?? (typeof(defaultVal) !== 'undefined' ? defaultVal : '')
        );
        
        return res;
    }
}