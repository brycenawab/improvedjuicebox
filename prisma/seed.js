const {PrismaClient} =  require('@prisma/client')
const prisma = new PrismaClient()


async function Users(){
    await prisma.User.createMany({
        data: [
            { username : "JohnathonToe" , password : "Indiana John" },
            { username : "SymerWoodley" , password : "symeriscrazy"},
            { username : "LavernaBartlett" , password : "LavernaB"}
        ]
    })
}

async function Posts(){
    await prisma.Post.createMany({
        data: [
            { title : "John's missing toe" , content : "I was born with 9 toes" , userId:1 },
            { title : "John + Joan " , content : "Joan is my new girlfriend, she doesn't know I have 9 toes" , userId : 1},
            { title : "Behind the scenes: the unseen side of John" , content : "In my free time I go snorkling" , userId : 1},
            { title : "About the, Symer" , content : "My name is Symer, and i'm a professional pupper master" , userId : 2},
            { title : "Why I hate Kermit" , content : "Kermit the frog is a horrible puppet I can hate all day but i've gotta puppet later" , userId : 2 },
            { title : "master of puppets" , content : "Taste me, you will see / More is all you need / Dedicated to / How I'm killing you" , userId : 2},
            { title : "Lavered Laverna" , content : "Today I was walking in the park and got lavered with lavenedar, I don't even like the smell of lavendar, who can I complain to, oh my gosh" , userId : 3},
            { title : "This crazy thing happened today" , content : "I don't understand what's wrong with people, today a man looked at me, I told his wife he was hitting on me" , userId : 3},
            { title : "I'm so tired" , content : "I'm so tired of being so pretty all guys want me but I don't want them cause they're so disgusting!" , userId:3}
        ]
    })
}

async function seedDatabase() {
    try {
      await Users();
      await Posts();
      console.log("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }
  
  seedDatabase();