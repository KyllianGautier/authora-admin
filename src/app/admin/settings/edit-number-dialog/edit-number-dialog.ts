import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoDirective } from '@jsverse/transloco';
import { SettingKey, SettingType } from '@kylliangautier/authora-types';
import { SettingValuePipe } from '../setting-value.pipe';
import type { NumberSettingMeta } from '@kylliangautier/authora-types';

const UNIT_MAP: Partial<Record<SettingType, string>> = {
  [SettingType.DurationSec]: 'sec',
  [SettingType.DurationMs]: 'ms',
  [SettingType.Occurrence]: '×',
  [SettingType.ByteSize]: 'KiB',
  [SettingType.Length]: 'chars',
};

export interface EditNumberDialogData {
  key: SettingKey;
  label: string;
  value: number;
  meta: NumberSettingMeta;
  greaterThanValue?: number;
  greaterThanLabel?: string;
  greaterThanFormatted?: string;
  lessThanValue?: number;
  lessThanLabel?: string;
  lessThanFormatted?: string;
}

function greaterThanValidator(refValue: number, label: string, formattedValue: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value !== null && control.value <= refValue) {
      return { greaterThan: { key: label, value: formattedValue } };
    }
    return null;
  };
}

function lessThanValidator(refValue: number, label: string, formattedValue: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value !== null && control.value >= refValue) {
      return { lessThan: { key: label, value: formattedValue } };
    }
    return null;
  };
}

@Component({
  selector: 'app-edit-number-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoDirective,
    SettingValuePipe,
  ],
  templateUrl: './edit-number-dialog.html',
  styleUrl: './edit-number-dialog.scss',
})
export class EditNumberDialog implements OnInit {
  readonly data = inject<EditNumberDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EditNumberDialog>);

  readonly unit = UNIT_MAP[this.data.meta.type] ?? '';
  readonly control = new FormControl<number>(0, { nonNullable: true });

  ngOnInit(): void {
    const validators: ValidatorFn[] = [Validators.required];
    if (this.data.meta.min !== undefined) {
      validators.push(Validators.min(this.data.meta.min));
    }
    if (this.data.meta.max !== undefined) {
      validators.push(Validators.max(this.data.meta.max));
    }
    if (this.data.greaterThanValue !== undefined && this.data.greaterThanLabel) {
      validators.push(
        greaterThanValidator(this.data.greaterThanValue, this.data.greaterThanLabel, this.data.greaterThanFormatted!)
      );
    }
    if (this.data.lessThanValue !== undefined && this.data.lessThanLabel) {
      validators.push(
        lessThanValidator(this.data.lessThanValue, this.data.lessThanLabel, this.data.lessThanFormatted!)
      );
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
