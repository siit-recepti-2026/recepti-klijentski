import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReceptKarticaOdgovor } from '../models/recept.models';

//Pozivi servera za recepte
@Injectable({ providedIn: 'root' })
export class ReceptService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/recepti`;

  //Najveca prosecna ocena u proteklih mesec dana
  popularni(): Observable<ReceptKarticaOdgovor[]> {
    return this.http.get<ReceptKarticaOdgovor[]>(`${this.url}/popularni`);
  }

  //Od najnovijeg ka starijem, po datumu objave
  najnoviji(): Observable<ReceptKarticaOdgovor[]> {
    return this.http.get<ReceptKarticaOdgovor[]>(`${this.url}/najnoviji`);
  }
}
