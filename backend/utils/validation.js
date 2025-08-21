const nameValid = (name) => typeof name === 'string' && name.length >= 20 && name.length <= 60;

const addressValid = (address) => typeof address === 'string' && address.length <= 400;

const passwordValid = (password) => {
  const re = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
  return re.test(password);
};

const emailValid = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

module.exports = { nameValid, addressValid, passwordValid, emailValid };