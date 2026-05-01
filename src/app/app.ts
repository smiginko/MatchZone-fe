import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserService} from "./user.service";

@Component({
  selector: 'app-root',
    imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
    private userService = inject(UserService);

    protected user = this.userService.getUser();

    protected login() {
        this.userService.login();
    }

    protected logout() {
        this.userService.logout();
    }
}
