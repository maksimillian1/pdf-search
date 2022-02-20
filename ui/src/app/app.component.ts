import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public form!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public sanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    this.form = this.fb.group({
      title: [],
      file: [],
    });

    const search = 'укт';
    this.http.get(`http://localhost:4000/documents/search?q=${search}`).subscribe(res => {
      console.log(res);
    });
  }

  public submit(): void {
    const {title, file} = this.form.value;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    this.http.post('http://localhost:4000/documents', formData).subscribe(res => {
      console.log(res);
    })
  }

  public fileBrowseHandler(event: Event) {
    const inputEvent = event as HTMLInputEvent;
    this.setLogo(inputEvent?.target?.files);
  }

  public setLogo(files: FileList | null): void {
    const file = files?.[0]

    // const reader = new FileReader();
    // reader.onloadend = () => this.form.controls.file.setValue(reader.result ? reader.result.toString(): null);

    return file
      ? this.form.controls.file.setValue(file as Blob)
      : this.form.controls.file.setValue(null);
  }


}
