export const config = {
  "dev": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": process.env.POSTGRES_HOST,
    "dialect": "postgres",
    "aws_reigion": process.env.UDAGRAM_REGION,
    "aws_profile": process.env.UDAGRAM_PROFILE,
    "aws_media_bucket": process.env.UDAGRAM_BUCKET,
    "url": process.env.URL    
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  },
  "jwt": {
    "secret": process.env.JWT_SECRET
  }

}
