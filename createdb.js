#! /usr/bin/env node
// console.log(
//     'This script populates some test users, addresses to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
//   );

// Get arguments passed on command line

require('dotenv').config();
const User = require("./models/user");
const Credential = require("./models/credential");
const Authentication = require("./models/authentication");
const Address = require("./models/address");
const List = require("./models/list");
const Post = require("./models/post");
const Media = require("./models/media");
const Avatar = require("./models/avatar");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const users = [];
const credentials = [];
const addresses = [];
const lists = [];
const posts = [];
const medias = [];
const avatars = [];
const authentications = [];

const mongoose = require("mongoose");
const { CLIENT_RENEG_LIMIT } = require("tls");
const authentication = require("./models/authentication");
mongoose.set("strictQuery", false);

const userArgs = process.argv.slice(2);

const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await Promise.all([
        await createUsers(),
        await createCredentials(),
        await createAuthentications(),
    ]);
    await createAddresses();
    await createLists();
    await createPosts();
    await createMedias();
    await createAvatars();
    // await authenticateCredential();
    // await authenticateRememberMe();
    // await updateCredentialRole();
    // await emailVerify();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function emailVerify() {
    const credential = await Credential.findOne({ username: userArgs[0]}).exec();
    const authentication = await Authentication.findOne({ credential: credential.id }).exec();
    console.log(credential.id);

    if (credential && !authentication) {
        const user = await User.findById(credential.user).exec();
        if (user && credential) {
            const authentication = await Authentication.find().count().exec();
            console.log(user.id);
            console.log(authentication);
            await authenticationCreate(authentication, user.id, credential.id, new Date(), new Date(), true, false, false );
        }

    } else {
        console.log("User not found! Or Authentication exists!");
    }

}

async function authenticateRememberMe() {
    const arrAuthNew = await Authentication.findByIdAndUpdate('6553cfa0f655d90c4fe45e8f', { status: true, remember: true } );
    if(arrAuthNew) { console.log("Successfully updated!"); }
}

async function authenticateCredential() {
    console.log("Authenticating credentials with user id!");
    const arrUser = await User.find();
    const lenArrUser = arrUser.length;
    for(i=0; i<lenArrUser; i++) {
        const authExists = await Authentication.findOne({ user: arrUser[i].id }).exec();
        const credential = authExists.credential;
        console.log(credential);
        if (typeof authExists.credential !== "undefined") {
            const arrCred = await Credential.findById( credential ).exec();
            const arrCredUpdated = new Credential({
                username: arrCred.username,
                password: arrCred.password,
                created: arrCred.created,
                updated: arrCred.updated,
                lastLogin: arrCred.lastLogin,
                numFailAttempts: arrCred.numFailAttempts,
                user: authExists.user,
                _id: arrCred.id, // This is required, or a new ID will be assigned!
            });
            await Credential.findByIdAndUpdate(credential, arrCredUpdated, {});
            console.log(arrCredUpdated);
        }
    }
}

async function updateCredentialRole() {
    console.log("Creating new parameter for all instances in credential table");
    const arrCred = await Credential.find().exec();
    const arrCredLength = arrCred.length;
    for (var i=0; i<arrCredLength; i++) {
        const updatedCred = await Credential.findByIdAndUpdate(arrCred[i].id, { role: 'Basic' }).exec();
        console.log(updatedCred);
    }
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

async function credentialCreate(index, username, password, role, created, updated, lastLogin, numFailAttempts, user) {
    const credentialdetail = {
        username: username,
        password: password,
        role: role,
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

async function authenticationCreate(index, user, credential, created, updated, status, remember, online) {
    const authenticationdetail = { user: user, credential: credential, created }
    if (updated != false) authenticationdetail.updated = updated;
    if (status != false) authenticationdetail.status = status;
    if (remember != false) authenticationdetail.remember = remember;
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
        fileName: fileName,
        fileType: fileType,
        size: size,
        created: created,
    };
    if (post != false) mediadetail.post = post;
    if (src != false) mediadetail.src = src;
    if (updated != updated) mediadetail.updated = updated;
    

    const media = new Media(mediadetail);
    media.file.data = fs.readFileSync(filePath);
    media.file.contentType = fileContentType;
    await media.save();
    medias[index] = media;
    console.log(`Added media: ${fileName}.${fileType}, ${size}`);
}

async function avatarCreate(index, user, fileName, fileType, filePath, fileContentType, size, src, created, updated) {
    const avatardetail = {
        user: user,
        fileName: fileName,
        fileType: fileType,
        size: size,
        created: created,
    };
    if (src != false) avatardetail.src = src;
    if (updated != updated) avatardetail.updated = updated;
    

    const avatar = new Avatar(avatardetail);
    avatar.file.data = fs.readFileSync(filePath);
    avatar.file.contentType = fileContentType;
    await avatar.save();
    avatars[index] = avatar;
    console.log(`Added avatar: ${fileName}.${fileType}, ${size}`);
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
            "wickkiller07",
            "mypasswordD0g.",
            "Basic",
            "2023-10-20",
            "",
            "",
            1,
            users[0]
        ),
        credentialCreate(
            1,
            "batman",
            "1amBatman_",
            "Basic",
            "2023-10-22",
            "",
            "",
            1,
            users[1]
        ),
        credentialCreate(
            2,
            "redflash",
            "1Loveqora.",
            "Basic",
            "2023-10-22",
            "",
            "",
            1,
            users[2]
        ),
        credentialCreate(
            3,
            "jinchuriki",
            "7thHokkage.",
            "Basic",
            "2023-10-25",
            "",
            "",
            9,
            users[3]
        ),
        credentialCreate(
            4,
            "npc86",
            "IamShadow_1.",
            "Basic",
            "2023-10-21",
            "",
            "",
            1,
            users[4]
        ),
    ]);
}

async function createAuthentications() {
    console.log("Adding authentications");
    await Promise.all([
        authenticationCreate( 0, users[0], credentials[0], "2023-10-20", "", false, false, false ),
        authenticationCreate( 1, users[1], credentials[1], "2023-10-23", "", false, false, false ),
        authenticationCreate( 2, users[2], credentials[2], "2023-10-22", "", false, false, false ),
        authenticationCreate( 3, users[3], credentials[3], "2023-10-25", "", false, false, false ),
        authenticationCreate( 4, users[4], credentials[4], "2023-10-21", "", false, false, false ),
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
            "./uploads-post/img-1.jpg",
            'image/png',
            263172,
            "",
            "2018-01-04",
            ""
        ),
        mediaCreate(1,
            posts[1],
            "Violet-flowers",
            "jpg",
            "./uploads-post/img-2.jpg",
            'image/png',
            357920,
            "",
            "2018-05-12",
            ""
        ),
        mediaCreate(2,
            posts[1],
            "Mighty-trees",
            "jpg",
            "./uploads-post/img-3.jpg",
            "image/png",
            491193,
            "",
            "2018-05-14",
            ""
        ),
        mediaCreate(3,
            posts[3],
            "Dream-path",
            "jpg",
            "./uploads-post/img-4.jpg", 
            "image/png",
            288478,
            "",
            "2017-07-22",
            ""
        ),
        mediaCreate(4,
            posts[2],
            "Queen-Lilith",
            "jpg",
            "./uploads-post/img-5.jpg", 
            "image/png",
            365083,
            "",
            "2017-07-22",
            ""
        ),
        mediaCreate(5,
            posts[1],
            "Queen-Lilith",
            "jpg",
            "./uploads-post/img-6.jpg", 
            "image/png",
            247375,
            "",
            "2017-07-22",
            ""
        ),
    ]);
}


async function createAvatars() {
    console.log("Adding avatars");
    await Promise.all([
        avatarCreate(6,
            users[0],
            "Avatar",
            "jpg",
            "./uploads-avatar/img-1.PNG",
            'image/png',
            8046,
            "",
            "2024-03-01",
            ""
        ),
        avatarCreate(7,
            users[1],
            "Avatar",
            "jpg",
            "./uploads-avatar/img-2.PNG",
            'image/png',
            85142,
            "",
            "2024-03-01",
            ""
        ),
        avatarCreate(8,
            users[2],
            "Avatar",
            "jpg",
            "./uploads-avatar/img-3.PNG", 
            "image/png",
            48914,
            "",
            "2024-03-01",
            ""
        ),
        avatarCreate(9,
            users[3],
            "Avatar",
            "jpg",
            "./uploads-avatar/img-5.PNG", 
            "image/png",
            152313,
            "",
            "2024-03-01",
            ""
        ),
        avatarCreate(10,
            users[4],
            "Avatar",
            "jpg",
            "./uploads-avatar/img-7.PNG", 
            "image/png",
            289124,
            "",
            "2024-03-01",
            ""
        ),
    ]);
}