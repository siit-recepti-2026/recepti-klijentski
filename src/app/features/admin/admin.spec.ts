import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
            pregled: () =>
              of({
                tipoviJela: [],
                tipoviObroka: [],
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
    const table = await loader.getHarness(MatTableHarness);
    const paginator = await loader.getHarness(MatPaginatorHarness);
    const sort = await loader.getHarness(MatSortHarness);
    const [naziv] = await sort.getSortHeaders({ label: 'Naziv' });

    expect(await table.getRows()).toHaveLength(10);
    await paginator.goToNextPage();
    expect(await table.getRows()).toHaveLength(2);

    await paginator.goToPreviousPage();
    await naziv.click();
    expect((await table.getCellTextByIndex())[0][0]).toBe('Kategorija 12');

    const search = await loader.getHarness(MatInputHarness);
    await search.setValue('kategorija 02');
    expect(await table.getCellTextByIndex()).toEqual([['Kategorija 02', 'Aktivno']]);
  });

  it('prikazuje opis i status postojećeg alergena', async () => {
    const tabs = await loader.getHarness(MatTabGroupHarness);
    await tabs.selectTab({ label: 'Alergeni' });
    const table = await loader.getHarness(MatTableHarness);

    expect(await table.getCellTextByIndex()).toEqual([['Gluten', 'Pšenica', 'Neaktivno']]);
  });
});
