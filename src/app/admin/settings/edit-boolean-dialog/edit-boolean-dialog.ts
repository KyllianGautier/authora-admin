import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslocoDirective } from '@jsverse/transloco';
import { SettingKey } from '@kylliangautier/authora-types';
import type { BooleanSettingMeta } from '@kylliangautier/authora-types';

export interface EditBooleanDialogData {
  key: SettingKey;
  label: string;
  value: boolean;
  meta: BooleanSettingMeta;
}

@Component({
  selector: 'app-edit-boolean-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    TranslocoDirective,
  ],
  templateUrl: './edit-boolean-dialog.html',
  styleUrl: './edit-boolean-dialog.scss',
})
export class EditBooleanDialog {
  readonly data = inject<EditBooleanDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EditBooleanDialog>);

  value: boolean = this.data.value;

  save(): void {
    this.dialogRef.close(this.value);
  }
}
