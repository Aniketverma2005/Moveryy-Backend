const isEmpty = (v) => 
    v === undefined || v ===null || ( typeof v === 'string' && v.trimm === '');

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validatePhone = (p) => /^\+[0-9]{7,15}$/.test(p);

export const Validation = {
    isEmpty,
    validateEmail,
    validatePhone
}