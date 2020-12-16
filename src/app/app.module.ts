import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ProjectComponent} from './project/project.component';
import {TaskComponent} from './task/task.component';

@NgModule({
    declarations: [
        AppComponent,
        ProjectComponent,
        TaskComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
