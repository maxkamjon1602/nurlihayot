#! /usr/bin/env node
// console.log(
//     'This script populates some test users, addresses to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
//   );

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const User = require("./models/user");
const Credential = require("./models/credential");
const Authentication = require("./models/authentication");
const Address = require("./models/address");
const List = require("./models/list");
const Post = require("./models/post");
const Media = require("./models/media");
const fs = require("fs");

const users = [];
const credentials = [];
const addresses = [];
const lists = [];
const posts = [];
const medias = [];
const authentications = [];


const mongoose = require("mongoose");
const { CLIENT_RENEG_LIMIT } = require("tls");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];
main().catch((err) => console.log(err));

async function main() {
    // console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    // console.log("Debug: Should be connected?");
    // await Promise.all([
    //     await createUsers(),
    //     await createCredentials(),
    //     await createAuthentications(),
    // ]);
    // await createAddresses();
    // await createLists();
    // await createPosts();
    // await createMedias();
    // console.log("Debug: Closing mongoose");
    await authenticateCredential();
    mongoose.connection.close();
}

async function authenticateCredential() {
    console.log("Authenticating credentials with user id!");
    const arrUser = await User.find();
    const lenArrUser = arrUser.length;
    for(i=0; i<lenArrUser; i++) {
        const authExists = await Authentication.findOne({ user: arrUser[i].id }).exec();
        console.log(authExists);
        if (typeof authExists.credential !== "undefined") {
            const arrCred = await Credential.findOne({ id: authExists.credential });
            // console.log(arrCred);
            // const cred = new Credential({
            //     username: arrCred.username,
            //     password: arrCred.password,
            //     created: arrCred.created,
            //     updated: arrCred.updated,
            //     lastLogin: arrCred.lastLogin,
            //     numFailAttempts: arrCred.numFailAttempts,
            //     user: authExists.user,
            //     _id: authExists.credential,
            // })
            // await Credential.findOneAndUpdate( {id: authExists.credential}, cred, {} );
        }
    }


    // const arrCredv2 = await Credential.find();
    // console.log(" ----------------------------------- ")
    // console.log(arrCredv2);
}

async function userCreate(index, firstName, lastName, created, updated, dateOfBirth, biography, phoneNumber, email, connAccounts) {
    const userdetail = { firstName: firstName, lastName: lastName, created: created, email: email };
    if (updated != false) userdetail.updated = updated;
    if (dateOfBirth != false) userdetail.dob = dateOfBirth;
    if (biography != false) userdetail.bio = biography;
    if (phoneNumber != false) userdetail.telephone = phoneNumber;
    if (connAccounts != false) userdetail.accounts = connAccounts;

    const user = new User(userdetail);

    await user.save();
    users[index] = user;
    console.log(`Added user: ${firstName} ${lastName} - ${email}`);
}

async function credentialCreate(index, username, password, created, updated, lastLogin, numFailAttempts, user) {
    const credentialdetail = {
        username: username,
        password: password,
        created: created,
    }
    if (updated != false) credentialdetail.updated = updated;
    if (lastLogin != false) credentialdetail.lastLogin = lastLogin;
    if (numFailAttempts != false) credentialdetail.numFailAttempts = numFailAttempts;
    if (user != false) credentialdetail.user = user;
    
    const credential = new Credential(credentialdetail);

    await credential.save();
    credentials[index] = credential;
    console.log(`Added password: ${username} - ${password}, at ${created}`);
}

async function authenticationCreate(index, user, credential, created, updated, status, online) {
    const authenticationdetail = { user: user, credential: credential, created }
    if (updated != false) authenticationdetail.updated = updated;
    if (status != false) authenticationdetail.status = status;
    if (online != false) authenticationdetail.online = online;

    const authentication = new Authentication(authenticationdetail);

    await authentication.save();
    authentications[index] = authentication;
    console.log(`Added authentication: ${user} - ${credential}`);
}

async function addressCreate(index, lineOne, secondLine, city, country, postcode, created, updated, user) {
    const addressdetail = {
        lineOne: lineOne, 
        city: city, 
        country: country, 
        postcode: postcode, 
        created: created, 
        user: user 
    };
    if (secondLine != false) addressdetail.lineTwo = secondLine;
    if (updated != false) addressdetail.updated = updated;

    const address = new Address(addressdetail);
    
    await address.save();
    addresses[index] = address;
    console.log(`Added address: ${lineOne}, ${postcode}`);
}

async function listCreate(index, name, user) {
    const listdetail = { name: name, user: user };

    const list = new List(listdetail);

    await list.save();
    lists[index] = list;
    console.log(`Added list: ${name}, `); // ${user}
}

async function postCreate(index, user, title, description, created, updated, list) {
    const postdetail = { user: user, created: created, };
    if (title != false) postdetail.title = title;
    if (description != false ) postdetail.description = description;
    if (updated != false ) postdetail.updated = updated;
    if (list != false ) postdetail.list = list;

    const post = new Post(postdetail);

    await post.save();
    posts[index] = post;
    console.log(`Added post: ${user.lastName} - ${created}, ${title}`);
}

async function mediaCreate(index, post, fileName, fileType, filePath, fileContentType, size, src, created, updated) {
    const mediadetail = {
        post: post,
        fileName: fileName,
        fileType: fileType,
        size: size,
        created: created,
    };
    if (src != false) mediadetail.src = src;
    if (updated != updated) mediadetail.updated = updated;
    

    const media = new Media(mediadetail);
    media.file.data = fs.readFileSync(filePath);
    media.file.contentType = fileContentType;
    await media.save();
    medias[index] = media;
    console.log(`Added media: ${fileName}.${fileType}, ${size}`);
}

async function createUsers() {
    console.log("Adding users");
    await Promise.all([
        userCreate(
            0, 
            "John", 
            "Wick", 
            "2023-10-20",
            "",
            "1980-08-09",
            "Baba yaga",
            "01111 223344",
            "john.wick@continental.net",
            [{
                kind: 'facebook',
                uid: 'john.wick'
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
            "2023-10-22",
            "",
            "1988-03-03",
            "I am Batman",
            "01001 000001",
            "brucewayne@gothem.com",
            [{  kind: 'facebook',
                uid: 'bruce.wayne',
            },
            {   kind: 'twitter',
                uid: 'bwayne'
            }]
        ),
        userCreate(
            2,
            "Barry",
            "Allen",
            "2023-10-22",
            "",
            "1995-01-10",
            "Red Flash",
            "02001 123123",
            "barryalen@central.city",
            [{  kind: 'facebook',
                uid: 'barry.allen'
            },
            {   kind: 'twitter',
                uid: 'ballen'
            }]
        ),
        userCreate(
            3,
            "Uzumaki",
            "Naruto",
            "2023-10-25",
            "",
            "2002-05-07",
            "My path of ninja.",
            "09110 999001",
            "numberseven@hokage.konoha",
            [{  kind: 'facebook',
                uid: 'naruto.uzumaki'

            },
            {   kind: 'twitter',
                uid: 'unaruto'
            }]
        ),
        userCreate(
            4,
            "Cid",
            "Kageno",
            "2023-10-21",
            "",
            "2008-07-11",
            "I am atomic",
            "07842 681629",
            "notnpc@shadow.org",
            [{  kind: 'facebook',
                uid: 'sidecharacter'
            },
            {   kind: 'twitter',
                uid: 'ckageno'
            }]
        ),
    ]);
}

async function createCredentials() {
    console.log("Adding password");
    await Promise.all([
        credentialCreate(
            0,
            // users[0],
            "wickkiller07",
            "mypasswordD0g.",
            "2023-10-20",
            "",
            "",
            1
        ),
        credentialCreate(
            1,
            // users[1],
            "batman",
            "1amBatman_",
            "2023-10-22",
            "",
            "",
            1
        ),
        credentialCreate(
            2,
            // users[2],
            "redflash",
            "1Lovenigger.",
            "2023-10-22",
            "",
            "",
            1
        ),
        credentialCreate(
            3,
            // users[3],
            "jinchuriki",
            "7thHokkage.",
            "2023-10-25",
            "",
            "",
            9
        ),
        credentialCreate(
            4,
            // users[4],
            "npc86",
            "IamShadow_1.",
            "2023-10-21",
            "",
            "",
            1
        ),
    ]);
}

async function createAuthentications() {
    console.log("Adding authentications");
    await Promise.all([
        authenticationCreate( 0, users[0], credentials[0], "2023-10-20", "", false, false ),
        authenticationCreate( 1, users[1], credentials[1], "2023-10-23", "", false, false ),
        authenticationCreate( 2, users[2], credentials[2], "2023-10-22", "", false, false ),
        authenticationCreate( 3, users[3], credentials[3], "2023-10-25", "", false, false ),
        authenticationCreate( 4, users[4], credentials[4], "2023-10-21", "", false, false ),
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
            "2023-10-26",
            "",
            users[0]
        ),
        addressCreate(
            1,
            "1 Gotham street",
            "",
            "Gotham",
            "United States",
            "B10 911",
            "2023-10-29",
            "",
            users[1]
        ),
        addressCreate(
            2,
            "5 Central City",
            "Police station",
            "Central City",
            "United States",
            "0001 99N",
            "2023-10-26",
            "",
            users[2]
        ),
        addressCreate(
            3,
            "14 Orphan house",
            "Dirt road",
            "Konoha",
            "Leaf Village",
            "I228 617",
            "2023-10-27",
            "",
            users[3]
        ),
        addressCreate(
            4,
            "54 Dwelling house",
            "Academic street",
            "Kintal",
            "Kingdom of shadow",
            "000 000",
            "2023-10-28",
            "",
            users[4]
        ),
    ]);
}


async function createLists() {
    console.log("Adding lists");
    await Promise.all([
        listCreate(0, "My favourite", users[0]),
        listCreate(1, "Garden members", users[4]),
        listCreate(2, "Gotham policed", users[1]),
        listCreate(3, "Mutated", users[2]),
        listCreate(4, "My friend list", users[3]),
    ]);
}

async function createPosts() {
    console.log("Adding posts");
    await Promise.all([
        postCreate(0,
            users[0],
            "My favorite scenery",
            "The photograph of this beautiful image deserves to be one of the best in the history",
            "2018-01-04",
            "",
            [lists[0]]
        ),
        postCreate(1,
            users[0],
            "Gorgeous nature",
            "This unknown flowers are very fabulous and their smell can be scent from screen. The second scene with mighty trees make the human feel insignificant.",
            "2018-05-12",
            "",
            [lists[0]]
        ),
        postCreate(2,
            users[4],
            "My angel lady",
            "This lady from Diablo IV is my favourite girl, and perfect match for my Shadow status.",
            "2023-08-07",
            "",
            [lists[1]]
        ),
        postCreate(3,
            users[3],
            "Perfect for speeding",
            "This straight line is so beautifully structured for my light speed run.",
            "2017-07-22",
            "",
            ""
        ),
    ]);
}

async function createMedias() {
    console.log("Adding media");
    await Promise.all([
        mediaCreate(0,
            posts[0],
            "Iceberg",
            "jpg",
            "../uploads/IMG_1.JPG",
            'image/png',
            5488395,
            "",
            "2018-01-04",
            ""
        ),
        mediaCreate(1,
            posts[1],
            "Violet-flowers",
            "jpg",
            "../uploads/IMG_2.JPG",
            'image/png',
            4520899,
            "",
            "2018-05-12",
            ""
        ),
        mediaCreate(2,
            posts[1],
            "Mighty-trees",
            "jpg",
            "../uploads/IMG_3.JPG", 
            "image/png",
            11121241,
            "",
            "2018-05-14",
            ""
        ),
        mediaCreate(3,
            posts[3],
            "Dream-path",
            "jpg",
            "../uploads/IMG_6.JPG", 
            "image/png",
            14022292,
            "",
            "2017-07-22",
            ""
        ),
        mediaCreate(4,
            posts[2],
            "Queen-Lilith",
            "jpg",
            "../uploads/IMG_10.JPG", 
            "image/png",
            2545400,
            "",
            "2017-07-22",
            ""
        ),
    ]);
}