const isEmpty = (v) => 
    v === undefined || v ===null || ( typeof v === 'string' && v.trim === '');

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validatePhone = (p) => /^\+[0-9]{7,15}$/.test(p);

const validateDomain = (d) => /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(d);

const validatePincode = (p) => /^[1-9][0-9]{5}$/.test(p);

const validateSubdomain = (s) => /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/.test(s);

export const Validation = {
    isEmpty,
    validateEmail,
    validatePhone,
    validateDomain,
    validatePincode,
    validateSubdomain
}