export const validateCORS = (req, res, next) => {
    const validOrigins = ['http://localhost:5173']
    const { origin } = req.headers
  
    if (validOrigins.includes(origin) || !origin) {
      res.setHeader('Access-Control-Allow-Origin', origin ?? '*')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
      return next()
    }
  
    res.status(403).json({ message: 'Error de CORS. No estás permitido.' })
  }