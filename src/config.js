const {
  REACT_APP_API_URL,
  REACT_APP_BASIC_KEY,
  REACT_APP_USER_COOKIE,
  REACT_APP_IMAGEKIT_URL,
  REACT_APP_IMAGEKIT_PUBLIC_KEY,
  REACT_APP_IMAGEKIT_AUTH_URL,
  REACT_APP_IMAGEKIT_DELETE_URL,
  REACT_APP_URL,
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID,
  // cookies
  REACT_APP_ACCEPT_COOKIE,
  REACT_APP_DECLINE_COOKIE,
  REACT_APP_VISIT_COOKIE,
  REACT_APP_DESCRIPTION_COOKIE,
  REACT_APP_VIEW_COOKIE,
} = process.env;

const config = {
  basicKey: REACT_APP_BASIC_KEY,
  apiUrl: REACT_APP_API_URL,
  userCookie: REACT_APP_USER_COOKIE,
  url: REACT_APP_URL,
  imagekitUrl: REACT_APP_IMAGEKIT_URL,
  imagekitPublicKey: REACT_APP_IMAGEKIT_PUBLIC_KEY,
  imagekitAuthUrl: REACT_APP_IMAGEKIT_AUTH_URL,
  imagekitDeleteUrl: REACT_APP_IMAGEKIT_DELETE_URL,
  firebaseConfig: {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
    measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID,
  },
  // cookie
  acceptCookie: REACT_APP_ACCEPT_COOKIE,
  declineCookie: REACT_APP_DECLINE_COOKIE,
  visitCookie: REACT_APP_VISIT_COOKIE,
  descriptionCookie: REACT_APP_DESCRIPTION_COOKIE,
  viewCookie: REACT_APP_VIEW_COOKIE,
};

export default config;
