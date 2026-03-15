import { Component, inject, signal, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ApiService } from '../../../core/api.service';
import { PasswordRules } from '../../../core/components/password-rules/password-rules';

interface CreateRegistrationForm {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-create-registration',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslocoDirective,
    PasswordRules,
  ],
  templateUrl: './create-registration.html',
  styleUrl: './create-registration.scss',
})
export class CreateRegistration {
  private readonly api = inject(ApiService);
  private readonly dialogRef = inject(MatDialogRef<CreateRegistration>);
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);

  @ViewChild(PasswordRules) passwordRulesComponent!: PasswordRules;

  readonly submitting = signal(false);
  readonly emailAvailable = signal<boolean | null>(null);

  readonly emailFC = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });

  readonly passwordFC = new FormControl<string>('', {
    validators: [Validators.required],
    nonNullable: true,
  });

  readonly confirmPasswordFC = new FormControl<string>('', {
    validators: [Validators.required],
    nonNullable: true,
  });

  readonly form = new FormGroup<CreateRegistrationForm>(
    {
      email: this.emailFC,
      password: this.passwordFC,
      confirmPassword: this.confirmPasswordFC,
    },
    { validators: this.passwordsMatchValidator }
  );

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const form = control as FormGroup<CreateRegistrationForm>;
    const password = form.controls.password.value;
    const confirmPassword = form.controls.confirmPassword.value;
    if (password && confirmPassword && password !== confirmPassword) {
      form.controls.confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  checkEmail(): void {
    if (this.emailFC.invalid) return;
    this.api.checkEmail(this.emailFC.value).subscribe({
      next: (available) => this.emailAvailable.set(available),
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.passwordRulesComponent?.valid()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { email, password } = this.form.getRawValue();

    this.api.signUp(email, password).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open(this.transloco.translate('registrations.created'));
        this.dialogRef.close(true);
      },
      error: () => {
        this.submitting.set(false);
        this.snackBar.open(this.transloco.translate('registrations.createError'));
      },
    });
  }
}
