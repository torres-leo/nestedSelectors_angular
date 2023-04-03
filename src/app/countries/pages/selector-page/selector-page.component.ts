import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { CountrySmall } from '../../interfaces/countrySmall';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  regions: string[] = [];
  countries: CountrySmall[] = [];
  borders: string[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    this.regions = this.countriesService.regions;

    // region was changed
    this.selectorForm
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.selectorForm.get('country')?.reset('');
          this.loading = true;
        }),
        switchMap((region) => this.countriesService.getCountryByRegion(region))
      )
      .subscribe((countries) => {
        this.countries = countries;
        this.loading = false;
      });

    // country was changed
    this.selectorForm
      .get('country')
      ?.valueChanges.pipe(
        tap((_) => {
          this.loading = true;
          this.borders = [];
          this.selectorForm.get('borders')?.reset('');
        }),
        switchMap((code) => this.countriesService.getCountryByCode(code))
      )
      .subscribe((country) => {
        this.borders = country![0]?.borders || [];
        this.loading = false;
      });
  }

  selectorForm: FormGroup = this._fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    borders: ['', [Validators.required]],
  });

  save() {
    console.log(this.selectorForm.value);
  }
}
