import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { AuthLayout, AuthLayoutTitle } from '../core/components/auth-layout/auth-layout';
import { AuthService } from '../core/auth.service';

interface SignInForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslocoDirective,
    AuthLayout,
    AuthLayoutTitle,
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);
  private readonly snackBar = inject(MatSnackBar);

  readonly submitting = signal(false);

  readonly usernameFC = new FormControl<string>('', {
    validators: [Validators.required],
    nonNullable: true,
  });

  readonly passwordFC = new FormControl<string>('', {
    validators: [Validators.required],
    nonNullable: true,
  });

  readonly signInFG = new FormGroup<SignInForm>({
    username: this.usernameFC,
    password: this.passwordFC,
  });

  onSubmit(): void {
    if (this.signInFG.invalid) {
      this.signInFG.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { username, password } = this.signInFG.getRawValue();

    this.authService.signIn(username, password).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate([`/${this.transloco.getActiveLang()}`]);
      },
      error: () => {
        this.submitting.set(false);
        this.passwordFC.reset();
        this.snackBar.open(this.transloco.translate('signIn.errors.invalidCredentials'));
      },
    });
  }
}
