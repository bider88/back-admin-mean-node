const handleError = (res, code, err) => {
    return res.status(code).json({
        ok: false,
        err
    });
}

module.exports = {
    handleError
}