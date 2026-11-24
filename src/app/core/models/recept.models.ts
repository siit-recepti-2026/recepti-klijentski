//Oblici podataka koje server vraca za recepte (isti kao DTO klase na serveru)

//Osnovne informacije o receptu za prikaz na kartici recepta
export interface ReceptKarticaOdgovor {
  id: number;
  naziv: string;
  autor: string;
  tipJela: string;
  tipoviObroka: string[];
  tipoviIshrane: string[];
  alergeni: string[];
  brojPorcija: number;
  ukupnoVremePripremeMin: number;
  glavnaFotografija: string;
  prosecnaOcena: number;
  brojOcena: number;
}
