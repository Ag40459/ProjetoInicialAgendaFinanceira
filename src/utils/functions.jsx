export function setAlert(messange, functionError, closeModal) {
    functionError(messange);
    setTimeout(() => {
        functionError('');
    }, 2000);
    return
}