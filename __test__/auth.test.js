const request = require('supertest')
const app = require('../routes/auth');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

// tests for auth.js

// test for creating user
describe('POST /users' ,()=>{
    beforeAll(async ()=>{
        await prisma.$connect();
    })


    
    afterAll(async ()=>{ 
        await prisma.user.deleteMany({
        where: {
          username: {
            in: ['testUser4'] 
          }
        }
    })
})

    it('should create a user and return an access token' , async ()=>{
        const username = 'testUser5';
        const password = 'testPassword';

        const hashedPassword = await bcrypt.hash(password,10)
       
       await prisma.user.create({
        data:{
            username,
            password: hashedPassword
        }
       })
       const response = await request(app)
       .post('/users')
       .send({ username, password });
       
       console.log('Creating user with username:', username);
       console.log('Data being sent to create user:', { username, password: hashedPassword });
       console.log('Response Status:', response.status);
       console.log('Response Body:', response.body);

    expect(response.body).toHaveProperty('accessToken')
    expect(response.status).toBe(201)


        })

   
    })

    //test for login 
    describe('POST /' ,()=>{
        beforeAll(async ()=>{
            await prisma.$connect();
        })
    
    
        
        afterAll(async ()=>{ 
        await prisma.user.deleteMany({
            where: {
              username: {
                in: ['testUser4'] 
              }
            }
        })
    })
        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash('testPassword', 10);
            await prisma.user.create({
              data: {
                username: 'testUser4',
                password: hashedPassword,
              },
            });
          });
        

        it('logs in user and returns an access token' , async ()=>{
           
            const username = 'testUser4'
            const password = 'testPassword'

       
            const response = await request(app)
            .post('/login')
            .send({ username, password });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body.message).toBe('User logged in successfully')
        })
    })


    