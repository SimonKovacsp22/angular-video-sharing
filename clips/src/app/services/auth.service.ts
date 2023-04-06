import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import IUser from '../models/user.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(500));
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => {
        this.redirect = data.auth?.authOnly ?? false;
      });
  }
  public async createUser(userData: IUser) {
    const { email, password, name, phoneNumber, age } = userData;
    const userdCred = await this.auth.createUserWithEmailAndPassword(
      email as string,
      password as string
    );

    if (!userdCred.user) {
      throw new Error("User can't be found");
    }

    await this.usersCollection.doc(userdCred.user?.uid).set({
      name,
      email,
      age,
      phoneNumber,
    });

    await userdCred.user.updateProfile({
      displayName: name,
    });
  }

  public async logout($event?: Event) {
    if ($event) $event.preventDefault();
    await this.auth.signOut();
    console.log(this.redirect);
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
