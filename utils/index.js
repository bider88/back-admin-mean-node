const handleError = (res, code, err) => {
    return res.status(code).json({
        ok: false,
        err
    });
}

const pagination = (from, limit) => {
    let f = from || 0;
    f = Number(f);
    f = isNaN(f) ? 0 : f;

    let l = limit || 5;
    l = Number(l);
    l = isNaN(l) ? 5 : l;

    return {
        from: f,
        limit: l
    }
}

module.exports = {
    handleError,
    pagination
}