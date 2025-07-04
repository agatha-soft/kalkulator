import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CalculatorComponent } from './calculator/calculator.component';
import { Upgrade } from './upgrade/upgrade';

// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { getAuth, provideAuth } from '@angular/fire/auth';
// import { getFirestore, provideFirestore } from '@angular/fire/firestore';
// import { environment } from '../environments/environment';


// const providedModules: any = [
//   provideFirebaseApp(() => initializeApp(environment.firebase)),
//   provideAuth(() => getAuth()),
//   provideFirestore(() => getFirestore())
// ]
@NgModule({
  declarations: [
    App,
    Upgrade,
    CalculatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // ...providedModules
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }
