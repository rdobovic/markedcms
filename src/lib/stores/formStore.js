import { writable } from "svelte/store";

export const FORM_CONTEXT_KEY = 'formContext';

export function formStore(initialData = {}) {
    const form = writable({
        name: 'form',
        errors: {},
        values: {},
        ...initialData,
    });

    return {
        ...form,

        setErrors: (errors) => form.update(existing => ({
            ...existing, errors
        })),

        setValues: (values) => form.update(existing => ({
            ...existing, values
        })),

        setError: (name, error) => form.update(existing => {
            existing.errors[name] = error;
            return existing;
        }),

        setValue: (name, value) => form.update(existing => {
            existing.values[name] = value;
            return existing;
        }),
    };
}