const handleError = (res, code, err) => {
    return res.status(code).json({
        ok: false,
        err
    });
}

const pagination = (page, limit) => {
    let p = page || 1;
    p = Number(p);
    p = isNaN(p) ? 1 : p;

    let l = limit || 10;
    l = Number(l);
    l = isNaN(l) ? 10 : l;

    return {
        skip: p * l - l,
        page,
        limit: l
    }
}

module.exports = {
    handleError,
    pagination
}