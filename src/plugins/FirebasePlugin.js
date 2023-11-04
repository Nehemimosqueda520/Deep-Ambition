import Phaser from "phaser";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    setDoc,
    doc,
    addDoc,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    getDoc,
  } from "firebase/firestore";
  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInAnonymously,
    signInWithPopup,
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDBJSJZbay-HC96PjF8jXBW9f1YVLQYdc0",
    authDomain: "deep-ambition.firebaseapp.com",
    projectId: "deep-ambition",
    storageBucket: "deep-ambition.appspot.com",
    messagingSenderId: "243456055859",
    appId: "1:243456055859:web:68d9393c085546a592e146"
};

export default class FirebasePlugin extends Phaser.Plugins.BasePlugin {
constructor(pluginManager) {
    super(pluginManager);
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.onLoggedInCallback = () => {};

    this.authStateChangedUnsubscribe = onAuthStateChanged(this.auth, (user) => {
      if (user && this.onLoggedInCallback) {
        this.onLoggedInCallback();
      }
    });
  }

  destroy() {
    this.authStateChangedUnsubscribe();
    super.destroy();
  }

  onLoggedIn(callback) {
    this.onLoggedInCallback = callback;
  }

  async saveGameData(userId, data) {
    await setDoc(doc(this.db, "game-data", userId), data);
  }

  async loadGameData(userId) {
    const snap = await getDoc(doc(this.db, "game-data", userId));
    return snap.data();
  }

  async createUserWithEmail(email, password) {
    const credentials = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return credentials.user;
  }

  async signInWithEmail(email, password) {
    const credentials = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return credentials.user;
  }

  async signInAnonymously() {
    const credentials = await signInAnonymously(this.auth);
    return credentials.user;
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credentials = await signInWithPopup(this.auth, provider);
    return credentials.user;
  }

  async signInWithGithub() {
    const provider = new GithubAuthProvider();
    const credentials = await signInWithPopup(this.auth, provider);
    return credentials.user;
  }

  getUser() {
    return this.auth.currentUser;
  }

  async addHighScore(name, score) {
    await addDoc(collection(this.db, "high-scores"), {
      name,
      score,
      createdAt: new Date(),
    });
  }

  async getHighScores() {
    const q = query(
      collection(this.db, "high-scores"),
      orderBy("score", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((d) => {
      scores.push(d.data());
    });

    return scores;
  }
}