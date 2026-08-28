export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')
  response.status(200).json({
    operatorName: process.env.OPERATOR_NAME || '',
  })
}

