// Logger middleware for API requests and errors
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  // Log the incoming request
  console.log(`\n🔥 [${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Log request body for POST/PUT/PATCH (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    const sanitizedBody = { ...req.body };
    
    // Hide sensitive fields
    if (sanitizedBody.password) sanitizedBody.password = '***hidden***';
    if (sanitizedBody.firebaseToken) sanitizedBody.firebaseToken = '***hidden***';
    if (sanitizedBody.refreshToken) sanitizedBody.refreshToken = '***hidden***';
    
    console.log(`📝 Request Body:`, JSON.stringify(sanitizedBody, null, 2));
  }
  
  // Capture the original res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    const statusCode = res.statusCode;
    const statusEmoji = statusCode >= 400 ? '❌' : '✅';
    
    console.log(`${statusEmoji} [${timestamp}] ${method} ${url} - Status: ${statusCode}`);
    
    // Log response for errors or if status >= 400
    if (statusCode >= 400) {
      console.log(`💥 Error Response:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`✨ Success Response: ${data.message || 'Success'}`);
    }
    
    console.log(`⏱️  Request completed in ${Date.now() - req.startTime}ms\n`);
    
    return originalJson.call(this, data);
  };
  
  // Store start time for duration calculation
  req.startTime = Date.now();
  
  next();
};

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  
  console.log(`\n💥 [${timestamp}] ERROR in ${method} ${url}`);
  console.log(`🚨 Error Message: ${err.message}`);
  console.log(`📍 Stack Trace:`);
  console.log(err.stack);
  
  // If it's an API error with statusCode, use that
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  // Default server error
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};