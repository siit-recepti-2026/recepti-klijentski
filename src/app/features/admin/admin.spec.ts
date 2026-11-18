import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatSortHarness } from '@angular/material/sort/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { of } from 'rxjs';

import { AdminPregledService } from './admin-pregled.service';
import { AdminModule } from './admin.module';
import { Admin } from './admin';

describe('Admin', () => {
  let fixture: ComponentFixture<Admin>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const kategorijeNamirnica = Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      naziv: `Kategorija ${String(index + 1).padStart(2, '0')}`,
      opis: null,
      aktivan: true,
    }));

    await TestBed.configureTestingModule({
      imports: [AdminModule],
      providers: [
        { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } },
        {
          provide: AdminPregledService,
          useValue: {
            dodaj: (_vrsta: string, naziv: string) =>
              of({
                stavka: { id: naziv === 'Užina' ? 7 : 20, naziv, opis: null, aktivan: true },
                ponovoAktivirana: naziv === 'Užina',
              }),
            izmeni: (_vrsta: string, id: number, naziv: string) =>
              of({ id, naziv, opis: null, aktivan: true }),
            pregled: () =>
              of({
                tipoviJela: [],
                tipoviObroka: [{ id: 7, naziv: 'Užina', opis: null, aktivan: false }],
                tipoviIshrane: [],
                kategorijeNamirnica,
                alergeni: [{ id: 1, naziv: 'Gluten', opis: 'Pšenica', aktivan: false }],
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('pretražuje, sortira i menja strane u tabeli', async () => {
    const tabs = await loader.getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: 'Kategorije namirnica' });
    const tab = await tabs.getSelectedTab();
    const table = await tab.getHarness(MatTableHarness);
    const paginator = await tab.getHarness(MatPaginatorHarness);
    const sort = await tab.getHarness(MatSortHarness);
    const [naziv] = await sort.getSortHeaders({ label: 'Naziv' });

    expect(await table.getRows()).toHaveLength(10);
    await paginator.goToNextPage();
    expect(await table.getRows()).toHaveLength(2);

    await paginator.goToPreviousPage();
    await naziv.click();
    expect((await table.getCellTextByIndex())[0][0]).toBe('Kategorija 12');

    const search = await tab.getHarness(MatInputHarness.with({ ancestor: 'app-admin-tabela' }));
    await search.setValue('kategorija 02');
    const redovi = await table.getCellTextByIndex();
    expect(redovi).toHaveLength(1);
    expect(redovi[0].slice(0, 2)).toEqual(['Kategorija 02', 'Aktivno']);
  });

  it('prikazuje opis i status postojećeg alergena', async () => {
    const tabs = await loader.getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: 'Alergeni' });
    const tab = await tabs.getSelectedTab();
    const table = await tab.getHarness(MatTableHarness);

    expect(await table.getCellTextByIndex()).toEqual([['Gluten', 'Pšenica', 'Neaktivno']]);
    expect(await tab.getAllHarnesses(MatButtonHarness.with({ text: 'Dodaj' }))).toHaveLength(0);
  });

  it('dodaje aktivan tip jela i odmah ga prikazuje u tabeli', async () => {
    const tabs = await loader.getHarness(MatTabGroupHarness);
    const tab = await tabs.getSelectedTab();
    const input = await tab.getHarness(
      MatInputHarness.with({ ancestor: 'app-admin-forma-stavke' }),
    );
    const button = await tab.getHarness(MatButtonHarness.with({ text: 'Dodaj' }));

    expect(await button.isDisabled()).toBe(true);
    await input.setValue('  Čorba  ');
    await button.click();

    const table = await tab.getHarness(MatTableHarness);
    const redovi = await table.getCellTextByIndex();
    expect(redovi).toHaveLength(1);
    expect(redovi[0].slice(0, 2)).toEqual(['Čorba', 'Aktivno']);
    expect(await input.getValue()).toBe('');
  });

  it('popunjava formu i menja naziv postojećeg reda', async () => {
    const tabs = await loader.getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: 'Kategorije namirnica' });
    const tab = await tabs.getSelectedTab();
    const izmeni = await tab.getHarness(
      MatButtonHarness.with({ selector: '[aria-label="Izmeni Kategorija 01"]' }),
    );
    await izmeni.click();

    const input = await tab.getHarness(
      MatInputHarness.with({ ancestor: 'app-admin-forma-stavke' }),
    );
    expect(await input.getValue()).toBe('Kategorija 01');
    await input.setValue('Ažurirana kategorija');
    const sacuvaj = await tab.getHarness(MatButtonHarness.with({ text: 'Sačuvaj izmenu' }));
    await sacuvaj.click();

    const table = await tab.getHarness(MatTableHarness);
    const prveStavke = await table.getCellTextByIndex();
    expect(prveStavke[0].slice(0, 2)).toEqual(['Ažurirana kategorija', 'Aktivno']);
  });

  it('ponovo aktivira postojeći red kada se ponovo unese njegov naziv', async () => {
    const tabs = await loader.getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: 'Tipovi obroka' });
    const tab = await tabs.getSelectedTab();
    const table = await tab.getHarness(MatTableHarness);
    const input = await tab.getHarness(
      MatInputHarness.with({ ancestor: 'app-admin-forma-stavke' }),
    );
    const dodaj = await tab.getHarness(MatButtonHarness.with({ text: 'Dodaj' }));

    expect((await table.getCellTextByIndex())[0].slice(0, 2)).toEqual(['Užina', 'Neaktivno']);
    await input.setValue('Užina');
    await dodaj.click();

    const redovi = await table.getCellTextByIndex();
    expect(redovi).toHaveLength(1);
    expect(redovi[0].slice(0, 2)).toEqual(['Užina', 'Aktivno']);
    expect(await tab.getTextContent()).toContain('Stavka je ponovo aktivirana.');
  });
});
