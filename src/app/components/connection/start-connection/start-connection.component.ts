import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {ConnectionService} from '@services/connection-serivce/connection.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {routes} from '../../../app.routes';

@Component({
  selector: 'app-start-connection',
  standalone: true,
  templateUrl: './start-connection.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./start-connection.component.scss']
})
export class StartConnectionComponent implements OnInit {
  usernameInput = '';

  @ViewChild('connectionSection') connectionSection!: ElementRef;

  public readonly otherUsername = signal<string>("")
  constructor(
    public connectionService: ConnectionService,
    protected router: Router
  ) {

    toObservable(this.connectionService.isConnected).subscribe(isConnected => {
      if (isConnected) {
        connectionService.sendUsername().then(user => {
          this.otherUsername.set(user);
        })
      }
    });

  }

  connect(peerId: string) {
    if (peerId) {
      this.connectionService.connectToPeer(peerId);
    }

  }

  scrollToConnection() {
    this.connectionSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  disconnect() {
    this.connectionService.disconnect();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.connectionService.username.set(this.usernameInput);
    }

  }

  onSubmitSQL() {
    this.router.navigate(['/gamecomponent']);
  }

  ngOnInit(): void {
    if (this.connectionService.isConnected() || this.connectionService.username() != '' || this.connectionService.peerId() != '') {
      window.location.reload()
    }
  }

  protected readonly routes = routes;
}
