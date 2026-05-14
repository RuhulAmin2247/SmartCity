const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Header থেকে token নিচ্ছি
    const authHeader = req.headers.authorization;

    // Token আছে কিনা চেক করছি
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Login করুন আগে' });
    }

    // "Bearer eyJ..." থেকে শুধু token অংশ নিচ্ছি
    const token = authHeader.split(' ')[1];

    // Token verify করছি
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Citizen এর info টা request এ রাখছি
    req.citizen = decoded;

    // পরের step এ যাও
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Token valid না, আবার login করুন' });
  }
};

module.exports = protect;