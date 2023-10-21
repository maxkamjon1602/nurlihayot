#! /usr/bin/env node
console.log(
    'This script populates some test users, addresses to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const User = require("./models/user");
const Address = require("./models/address");

const users = [];
const addresses = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];
main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    // await createUsers();
    // await createAddresses();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function userCreate(index, firstName, lastName, dateOfBirth, biography, phoneNumber, email, connAccounts) {
    const userdetail = { firstName: firstName, lastName: lastName, email: email };
    if (dateOfBirth != false) userdetail.dob = dateOfBirth;
    if (biography != false) userdetail.bio = biography;
    if (phoneNumber != false) userdetail.telephone = phoneNumber;
    if (connAccounts != false) userdetail.accounts = connAccounts;

    const user = new User(userdetail);

    await user.save();
    users[index] = user;
    console.log(`Added user: ${firstName} ${lastName} - ${email}`);
}

async function addressCreate(index, lineOne, secondLine, city, country, postcode, user) {
    const addressdetail = { lineOne: lineOne, city: city, country: country, postcode: postcode, user: user };
    if (secondLine != false) addressdetail.lineTwo = secondLine;

    const address = new Address(addressdetail);
    
    await address.save();
    addresses[index] = address;
    console.log(`Added address: ${lineOne}, ${postcode}`);
}

async function listCreate(name, user) {
    const listdetail = { name: name, user: user };

    const list = new List(listdetail);

    await list.save();
    lists[index] = list;
    console.log(`Added list: ${name}, ${user}`);
}

async function createUsers() {
    console.log("Adding users");
    await Promise.all([
        userCreate(
            0, 
            "John", 
            "Wick", 
            "1980-08-09", 
            "Baba yaga", 
            "01111 223344", 
            "john.wick@continental.net", 
            [{
                kind: 'facebook',
                uid: 'john.wick'
            },
            {
                kind: 'internal',
                username: 'mrwick',
                password: 'mydog'
            },
            {
                kind: 'twitter',
                uid: 'jwick'
            }]
        ),
        userCreate(
            1,
            "Bruce",
            "Wayne",
            "1988-03-03",
            "I am Batman",
            "01001 000001",
            "brucewayne@gothem.com",
            [{  kind: 'facebook',
                uid: 'bruce.wayne',
            },
            {   kind: 'internal',
                username: 'iambatman',
                password: 'ilovejocker'
            },
            {   kind: 'twitter',
                uid: 'bwayne'
            }]
        ),
        userCreate(
            2,
            "Barry",
            "Allen",
            "1995-01-10",
            "Red Flash",
            "02001 123123",
            "barryalen@central.city",
            [{  kind: 'facebook',
                uid: 'barry.allen'
            },
            {   kind: 'internal',
                username: 'flash',
                password: 'savitar'
            },
            {   kind: 'twitter',
                uid: 'ballen'
            }]
        ),
        userCreate(
            3,
            "Uzumaki",
            "Naruto",
            "2002-05-07",
            "My path of ninja.",
            "09110 999001",
            "numberseven@hokage.konoha",
            [{  kind: 'facebook',
                uid: 'naruto.uzumaki'

            },
            {   kind: 'internal',
                username: 'jinchuriki',
                password: 'ihaveninetails'
            },
            {   kind: 'twitter',
                uid: 'unaruto'
            }]
        ),
        userCreate(
            4,
            "Cid",
            "Kageno",
            "2008-07-11",
            "I am atomic",
            "07842 681629",
            "notnpc@shadow.org",
            [{  kind: 'facebook',
                uid: 'sidecharacter'
            },
            {   kind: 'internal',
                username: 'shadow',
                password: 'iamnotnpc'
            },
            {   kind: 'twitter',
                uid: 'ckageno'
            }]
        ),
    ]);
}

async function createAddresses() {
    console.log("Adding addresses");
    await Promise.all([
        addressCreate(
            0,
            "1 Continental",
            "",
            "New York",
            "United States",
            "T01 101",
            users[0]
        ),
        addressCreate(
            1,
            "1 Gotham street",
            "",
            "Gotham",
            "United States",
            "B10 911",
            users[1]
        ),
        addressCreate(
            2,
            "5 Central City",
            "Police station",
            "Central City",
            "United States",
            "0001 99N",
            users[2]
        ),
        addressCreate(
            3,
            "14 Orphan house",
            "Dirt road",
            "Konoha",
            "Leaf Village",
            "I228 617",
            users[3]
        ),
        addressCreate(
            4,
            "54 Dwelling house",
            "Academic street",
            "Kintal",
            "Kingdom of shadow",
            "000 000",
            users[4]
        ),
    ]);
}

async function createList() {
    console.log("Adding lists");
    await Promise.all([
        listCreate(
            "Pencil killed",
            users[0]
        ),
        listCreate(
            "Continental",
            users[0]
        ),
        listCreate(
            "Fried list",
            users[3]
        ),
        listCreate(
            "Enemies",
            users[3]
        ),
        listCreate(
            "Shadow Garden",
            users[4]
        ),
        listCreate(
            "atomic",
            users[4]
        ),
    ]);
}