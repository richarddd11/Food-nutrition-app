const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Inicializácia Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // ak v projekte využívate aj Firestore, realtime DB, atď.:
  // databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com"
});

// UID používateľa, ktorého chcete verifikovať:
const userUid = 'mAT8tp0ruJScZOMqXc5E1QbF7kc2';

admin.auth().updateUser(userUid, {
  emailVerified: true,
})
.then(userRecord => {
  console.log('Email bol manuálne overený pre používateľa:', userRecord.uid);
})
.catch(err => {
  console.error('Chyba pri overovaní emailu:', err);
});