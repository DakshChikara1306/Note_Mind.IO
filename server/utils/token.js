import jwt from 'jsonwebtoken';

export const generateToken = async (userId) => {
    try{
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  console.log('Generated token:', token); // Log the generated token for debugging
  return token;
} catch (error) {
  console.error('Error generating token:', error); // Log the error for debugging
}
};