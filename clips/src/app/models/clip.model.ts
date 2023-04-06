import firebase from 'firebase/compat/app';
export default interface IClip {
  uid: string;
  displayName: string;
  title: string;
  url: string;
  fileName: string;
  timestamp: firebase.firestore.FieldValue;
  docId?: string;
}
