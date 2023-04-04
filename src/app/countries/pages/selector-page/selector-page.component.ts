import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { Country } from '../../interfaces/country.interface';
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
  // borders: string[] = [];
  countryBorders: CountrySmall[] = [];
  borders: string[] = [];
  loading: boolean = false;

  selectorForm: FormGroup = this._fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    borders: ['', [Validators.required]],
  });

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
        this.countries = countries || [];
        this.loading = false;
      });

    // country was changed
    this.selectorForm
      .get('country')
      ?.valueChanges.pipe(
        tap((_) => {
          this.loading = true;
          this.borders = [];
          this.countryBorders = [];
          this.selectorForm.get('borders')?.reset('');
        }),
        switchMap((code) => this.countriesService.getCountryByCode(code))
      )
      .subscribe((country) => {
        if (!country) return;
        this.borders = country[0].borders || [];

        this.getCountryNameBorder();

        this.loading = false;
      });
  }

  getCountryNameBorder() {
    if (!this.borders.length) return;

    for (const i of this.borders) {
      this.countriesService.getCountryByCodes(i).subscribe((country) => {
        if (!country) return;
        Object.values(country).map((value) => this.countryBorders.push(value));
      });
    }
  }

  save() {
    console.log(this.selectorForm.value);
  }
}
