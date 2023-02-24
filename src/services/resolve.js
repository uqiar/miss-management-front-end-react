const resolve = async (promise) => {
    const resolved = {
        data: null,
        error: null
    };

    try {
        resolved.data = await promise;

    } catch (e) {
        if (e.response.status === 403 || e.response.status === 401) {
            var base_url = window.location.origin;
            localStorage.removeItem("__set")
            setTimeout(() => {
                window.location.href = base_url
            }, 3000);
        }
        resolved.error = e;
        throw new Error(e.response.data && e.response.data.message ? e.response.data.message : e.message)
    }

    return resolved;
}
export default resolve