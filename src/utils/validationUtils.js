export async function validateSchema(schema, data, options = {}) {
    try {
        await schema.validate(data, { abortEarly: false, ...options });
        return { valid: true, errors: {} };
    } catch (err) {
        const errors = {};
        if (err.inner) {
            err.inner.forEach(e => {
                if (!errors[e.path]) errors[e.path] = e.message;
            });
        } else if (err.path) {
            errors[err.path] = err.message;
        }
        return { valid: false, errors };
    }
}