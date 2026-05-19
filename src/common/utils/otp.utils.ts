export function generateOTP() {
  const minNumber = 100000;
  const maxNumber = 900000;
  return Math.floor(Math.random() * minNumber + maxNumber);
}
