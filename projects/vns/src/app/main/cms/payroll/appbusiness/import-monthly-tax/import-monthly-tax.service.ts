import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from 'alpha-global-constants';
import { BaseApiService } from '../../../../../services/base-api.service';
import { CommonHttpRequestService } from '../../../../../services/common-http-request.service';

@Injectable({
  providedIn: 'root',
})
export class ImportMonthlyTaxService {
  constructor(private commonHttpRequestService: CommonHttpRequestService) {
    
  }
  getListSalaries(x: number): Observable<any> {
    return this.commonHttpRequestService.makeGetRequest('getListSalaries', `/api/PaImportMonthlyTax/GetListSalaries?id=${x}`);
  }
}
