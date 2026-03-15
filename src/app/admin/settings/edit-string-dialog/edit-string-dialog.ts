import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';
import { SettingKey } from '@kylliangautier/authora-types';
import type { StringSettingMeta } from '@kylliangautier/authora-types';

export interface EditStringDialogData {
  key: SettingKey;
  label: string;
  value: string;
  meta: StringSettingMeta;
}

@Component({
  selector: 'app-edit-string-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoDirective,
  ],
  templateUrl: './edit-string-dialog.html',
  styleUrl: './edit-string-dialog.scss',
})
export class EditStringDialog implements OnInit {
  readonly data = inject<EditStringDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EditStringDialog>);

  readonly control = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    const validators = [Validators.required];
    if (this.data.meta.minLength !== undefined) {
      validators.push(Validators.minLength(this.data.meta.minLength));
    }
    if (this.data.meta.maxLength !== undefined) {
      validators.push(Validators.maxLength(this.data.meta.maxLength));
    }
    if (this.data.meta.pattern) {
      validators.push(Validators.pattern(this.data.meta.pattern));
    }
    this.control.setValidators(validators);
    this.control.setValue(this.data.value);
  }

  applyDefault(): void {
    this.control.setValue(this.data.meta.default);
  }

  save(): void {
    if (this.control.valid) {
      this.dialogRef.close(this.control.value);
    }
  }
}
