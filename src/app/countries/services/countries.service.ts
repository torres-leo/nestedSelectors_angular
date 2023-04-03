import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CountrySmall } from '../interfaces/countrySmall';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  constructor(private http: HttpClient) {}

  private api_url: string = 'https://restcountries.com/v3.1/';
  private _regions: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regions(): string[] {
    return [...this._regions];
  }

  getCountryByRegion(region: string): Observable<CountrySmall[]> {
    const params = new HttpParams().set('fields', 'name,cca3');
    const url: string = `${this.api_url}/region/${region}`;
    return this.http.get<CountrySmall[]>(url, { params });
  }

  getCountryByCode(code: string): Observable<Country[] | null> {
    if (!code) {
      return of([]);
    }

    const params = new HttpParams().set('codes', code);
    const url: string = `${this.api_url}/alpha`;
    return this.http.get<Country[]>(url, { params });
  }
}
