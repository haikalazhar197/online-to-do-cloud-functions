const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const defaultImg =
  "https://lh3.googleusercontent.com/a-/AOh14Gg_y1WjT42C9jvK6TcRXBemMGJS7qhIrXHnvPnyvQ";

//Function to delete all of users todos
const deleteTodos = (uid) => {
  db.collection("todos")
    .where("uid", "==", uid)
    .get()
    .then((querySnaphot) => {
      querySnaphot.docs.forEach((doc) => {
        db.collection("todos")
          .doc(doc.id)
          .delete()
          .then(() => console.log("Deleted"))
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
};

//Function to delete user Data in the users collection
const deleteUserData = (uid) => {
  db.collection("users")
    .doc(uid)
    .delete()
    .then(() => console.log("User Deleted"))
    .catch((err) => console.log(err));
};

//Run a cloud function once a user is created -- Add user Data in the users collection
exports.createUser = functions
  .region("asia-east2")
  .auth.user()
  .onCreate((user) => {
    return db
      .collection("users")
      .doc(user.uid)
      .set({
        name: user.displayName || user.email,
        email: user.email,
        uid: user.uid,
        img: user.photoURL || defaultImg,
      })
      .then(() => console.log("Success"))
      .catch((err) => console.log(err));
  });

//Deletes users todos
exports.deleteUser = functions
  .region("asia-east2")
  .auth.user()
  .onDelete((user) => {
    deleteTodos(user.uid);
  });

//Delete User from users collection
exports.deleteUserFirestore = functions
  .region("asia-east2")
  .auth.user()
  .onDelete((user) => {
    deleteUserData(user.uid);
  });
