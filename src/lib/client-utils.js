export const encodePassphrase = (passphrase) => encodeURIComponent(passphrase);

export const decodePassphrase = (base64String) => decodeURIComponent(base64String);

export const randomString = (length) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateRoomId = () => `${randomString(4)}-${randomString(4)}`;

export const isLowPowerDevice = () => {
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency < 6;
  }
  return false;
};
