# 2FATest
Little service that allows for user registration and login, with 2FA functionality

## Notes
Although 3 routes were requested, I deemed it more clean to have both steps of the 2FA login on the same endpoint

## Setup
Perform the following steps to setup the service:

1. Install modules 
`npm ci`
2. Start mysql container 
`docker-compose up -d`
3. Create env configuration
`echo 'PORT=3000' > .env`
`echo 'ROOT_CONNECTION_STRING="mysql://root:StrongPassword123!@localhost:3306/Users"' > .env`
4. Transpile
`npm run tsc`
5. Migrate
`npx prisma migrate deploy`
6. Run
`npm run start`

## Unit Tests
Unit tests can be run with:
`npx jest`

## Examples
An Insomnia v4 file is included with example calls