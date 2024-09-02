const request = require('supertest')
const app = require('../routes/routes');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

//tests for route.js

//get all posts test
describe('GET /posts' ,()=>{
    beforeAll(async ()=>{
        await prisma.$connect();
    })


    
    afterAll(async ()=>{ 
        await prisma.$disconnect()
    })

    it('should return all posts with a status code of 200' , async ()=>{

        const response = await request(app)
        .get('/posts')

        expect(response.status).toBe(200)
        
        
    })
})

//get post by id 

describe('GET /posts/:id' ,()=>{

    let testpostid = null

    beforeAll(async ()=>{
        await prisma.$connect();

        const testpost = await prisma.post.create({
            data : {
                title : 'test post',
                content : 'test post content',
                userId : 1
            }
        })
           testpostid = testpost.id
        
    })


    
    afterAll(async ()=>{ 
        await prisma.post.deleteMany({
            where : {
                id : testpostid
            }
        })
        await prisma.$disconnect()
    })

    it('should return the post by id' , async ()=>{

        const response = await request(app)
        .get(`/posts/${testpostid}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('title' , 'test post')
        expect(response.body).toHaveProperty('content' , 'test post content')
        })
    })

    // create post 

    describe('POST /posts' , ()=>{

        let validToken = null
        let testUser = null

        beforeAll(async()=>{
            await prisma.$connect()

            try {
            testUser = await prisma.user.create({
                data : {
                   username : 'test user' ,
                   password : await bcrypt.hash('testPassword' , 10)
                }
            })
        if(!testUser){
            throw new Error('user not created')
        }

        validToken = jwt.sign(
            {id : testUser.id , username : testUser.username },
            process.env.SECRET_KEY,
            {expiresIn : '1h'}
        )

} catch (error) {
    console.error('error in beforeAll ' , error)
}
})

    afterAll(async ()=>{
     
            await prisma.$disconnect()


            })

            it('should create a post with a valid JWT' , async()=>{
                const response = await request(app)
                .post('/posts')
                .set('Authorization' , `Bearer ${validToken}`)
                    .send({
                        title : 'test post',
                        content : 'test post content',
                        userId : testUser.id
                        })

                        expect(response.status).toBe(200)
                       
            })

        })
     
// update post 

        describe('PUT /posts/:id', () => {

            let validToken = null;
            let testUser = null;
            let testPost = null;
        
            beforeAll(async () => {
                await prisma.$connect();
        
                try {
                    testUser = await prisma.user.create({
                        data: {
                            username: 'test user',
                            password: await bcrypt.hash('testPassword', 10)
                        }
                    });
        
                    if (!testUser) {
                        throw new Error('user not created');
                    }
        
                    validToken = jwt.sign(
                        { id: testUser.id, username: testUser.username },
                        process.env.SECRET_KEY,
                        { expiresIn: '1h' }
                    );
        
                   
                    testPost = await prisma.post.create({
                        data: {
                            title: 'initial title',
                            content: 'initial content',
                            userId: testUser.id
                        }
                    });

                    console.log(testPost)
        
                    if (!testPost) {
                        throw new Error('post not created');
                    }
        
                } catch (error) {
                    console.error('error in beforeAll', error);
                }
            });
        
            afterAll(async () => {
           
                await prisma.$disconnect();
            });
        
            it('should update a post with a valid JWT', async () => {
                const updatedData = {
                    title: 'updated title',
                    content: 'updated content',
                    userId : testUser.id
                };
        
                const response = await request(app)
                    .put(`/posts/${testPost.id}`)
                    .set('Authorization', `Bearer ${validToken}`)
                    .send(updatedData);
        
                expect(response.status).toBe(200);
            })
        })

        
        //delete post 
        describe('DELETE /posts/:id', () => {
            
            let validToken = null;
            let testUser = null;
            let testPost = null;

            beforeAll(async()=>{

                await prisma.$connect();
                
                try { 
                testUser = await prisma.user.create({
                    data: {
                        username : "testUserForDelete",
                        password : "testUserPassword"
                    }
                  })

                  if(!testUser){
                    throw new Error('user not created')
                  }


                  validToken = jwt.sign(
                    {id: testUser.id , username : testUser.username },
                    process.env.SECRET_KEY,
                    { expiresIn: '1h' }
                  )

                  testPost = await prisma.post.create({
                    data: {
                        title : "test post for delete",
                        content : "test post content for delete",
                        userId : testUser.id
                    }
                    })
                    } catch (error) {
                        console.error(error);
                    }
        })
                    afterAll(async()=>{
                        await prisma.post.deleteMany({ where: { id: testPost.id } });
                        await prisma.user.deleteMany({ where: { id: testUser.id } });
                        await prisma.$disconnect();
                    })

                    it('should delete a post with a valid JWT' , async()=>{
                        const response = await request(app)
                        .delete(`/posts/${testPost.id}`)
                        .set("Authorization", `Bearer ${validToken}`)
                    
                    expect(response.status).toBe(200)

                    
                    })


    
    
    })