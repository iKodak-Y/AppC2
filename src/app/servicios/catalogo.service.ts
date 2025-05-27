import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(
    private servG: GeneralService,
    private http: HttpClient,
  ) { }

  get_productos() {
    const url = this.servG.URLSERV + 'productos/';
    return this.http.get<any>(url);
  }

}
