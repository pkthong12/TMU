import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { EnumTranslateKey, api } from 'alpha-global-constants';
import { BaseComponent,IGenerateTemplateRequest, IFilterOperator, EnumFilterOperator, IInOperator, ISortItem, EnumSortDirection, ICorePageListCRUD, ICorePageListEditRouting, ICoreTableColumnItem, EnumCoreTablePipeType, MultiLanguageService, OrganizationService, AlertService, ICorePageListApiDefinition, ICoreButtonVNS, EnumCoreButtonVNSCode, alertOptions, AppService, ICoreButtonDropdownOption, CoreButtonGroupService } from "ngx-histaff-alpha";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "cms-app-contractappendix",
  templateUrl: "./contractappendix.component.html",
  styleUrls: ["./contractappendix.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ContractAppendixComponent extends BaseComponent implements AfterViewInit  {
  @ViewChild('sticker') sticker!: TemplateRef<any>;
  title = EnumTranslateKey.UI_COMPONENT_TITLE_HU_CONTRACT_APPENDIX
  orgIds!: number[];
  selectedIds: number[] = [];
  loading!: boolean;
  id: any;
  dataButtonPrints : ICoreButtonDropdownOption[] = []
  datePeriodComparisonFor: string = 'startDate';
  datePeriodComparisonForLabelKey: EnumTranslateKey = EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_STARTDATE_FILTER;
  statusInclusionFor: string = 'workStatusId';
  statusInclusionForLabelKey: EnumTranslateKey = EnumTranslateKey.UI_CORE_PARAMS_EMPLOYEE_STATUS_IN;
  statusOptionsApi: api = api.HU_EMPLOYEE_CV_GET_EMPLOYEE_STATUS_LIST;
  outerParam$ = new BehaviorSubject<any>(null);
  generateTemplateRequest!: IGenerateTemplateRequest;
  outerFilterOperators: IFilterOperator[] = [
    {
      field: 'orgId',
      operator: EnumFilterOperator.EQUAL
    }
  ]
  outerInOperators: IInOperator[] = [
    {
      field: 'orgId',
      values: this.orgIds || []
    }
  ]
  outerSort: ISortItem[] = [
    {
      field: "jobOrderNum",
      sortDirection: EnumSortDirection.ASC
    }
  ]
  crud: ICorePageListCRUD = {
    deleteIds: api.HU_CONTRACTAPPENDIX_DELETE_IDS,
    toggleApproveIds: api.HU_CONTRACTAPPENDIX_CHANGESTATUSAPPROVE
  }
  editRoute: ICorePageListEditRouting = {
    auxiliary: 'popupAux'
  }
  columns: ICoreTableColumnItem[] = [
    {
      caption: 'ID',
      field: 'id',
      hidden: true,
      type: 'number',
      align: 'left',
      width: 10,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_STATUSNAME,
      field: 'statusName',
      type: 'string',
      align: 'left',
      width: 130,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_EMPLOYEECODE,
      field: 'employeeCode',
      type: 'string',
      align: 'left',
      width: 80,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_EMPLOYEENAME,
      field: 'employeeName',
      type: 'string',
      align: 'left',
      width: 250,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_LEAVEJOB_TITLE_NAME,
      field: 'positionName',
      type: 'string',
      align: 'left',
      width: 210,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_ORGNAME,
      field: 'orgName',
      type: 'string',
      align: 'left',
      width: 210,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_CONTRACTNO,
      field: 'contractNo',
      type: 'string',
      align: 'left',
      width: 150,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_CONTRACTTYPENAME,
      field: 'contractTypeName',
      type: 'string',
      align: 'left',
      width: 210,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACTAPPENDIX_CONTRACTAPPENDIXNO,
      field: 'contractAppendixNo',
      type: 'string',
      align: 'left',
      width: 200,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_STARTDATE,
      field: 'startDate',
      type: 'date',
      pipe: EnumCoreTablePipeType.DATE,
      align: 'center',
      width: 100,
    },

    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_EXPIREDATE,
      field: 'expireDate',
      type: 'date',
      pipe: EnumCoreTablePipeType.DATE,
      align: 'center',
      width: 100,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_SIGNDATE,
      field: 'signDate',
      type: 'date',
      pipe: EnumCoreTablePipeType.DATE,
      align: 'center',
      width: 100,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_SIGNERNAME,
      field: 'signerName',
      type: 'string',
      align: 'left',
      width: 150,
    },
    {
      caption: EnumTranslateKey.UI_COMPONENT_LABEL_CONTRACT_SIGNERPOSITION,
      field: 'signerPosition',
      type: 'string',
      align: 'left',
      width: 130,
    },
  ]
  constructor(
    public override mls: MultiLanguageService,
    private organizationService: OrganizationService,
    private alertService: AlertService,
    private http : HttpClient,
    private appService: AppService,
    private coreButtonGroupService : CoreButtonGroupService

  ) {
    super(mls);
     /* Get orgIds startup value */
     const newOrgIds: number[] = [];
     this.organizationService.status$.value.activeKeys.map(x => newOrgIds.push(Number(x)))
     this.onOrgIdsChange(newOrgIds)
  }
  apiDefinition: ICorePageListApiDefinition = {
    queryListRelativePath: api.HU_CONTRACTAPPENDIX_QUERY_LIST,
  }

  onOrgIdsChange(orgIds: number[]) {

    this.orgIds = orgIds
    this.outerInOperators = [
      {
        field: 'orgId',
        values: orgIds
      }
    ]
  } 
  override ngOnInit(): void {
    this.mls.lang$.subscribe(x => {
      this.lang = x;
      this.generateTemplateRequest = {
        exCode: 'HU_CONTRACT_APPENDIX',
        lang: x
      }
    })

    this.subscriptions.push(
      this.appService.get(api.SYS_OTHERLIST_GETOTHERLISTBYTYPE + "CONTRACT_APPENDIX_PRINTING_FORM").subscribe(x => {
        let vals = x.body.innerBody
        vals.map(x => {
          x.codeName = x.code + '-'+ x.name
        })
        vals.forEach(element => {
          let dataButtonPrint : ICoreButtonDropdownOption = {
            childCaptionCode : element.codeName,
            childIconWrapperClass : '',
            childCode: element.codeName,
            childIconClass: ''
          }
          this.dataButtonPrints.push(dataButtonPrint)
        });

        this.coreButtonGroupService.headerButtonPrintDropdownOptions$.next(this.dataButtonPrints)
      })
    )
  }
  ngAfterViewInit(): void {
    const stickerFilter = this.columns.filter(c => c.field === 'statusName');
    if (!!stickerFilter.length) stickerFilter[0].templateRef = this.sticker;
  }

  onRowClick(e: any) {
    this.id = e.id
  }

  onCorePageHeaderButtonClick(e: ICoreButtonVNS) {
    if (e.code == EnumCoreButtonVNSCode.HEADER_PRINT) {
      this.loading = true;
      this.http.get(api.HU_CONTRACTAPPENDIX_PRINT, {
        responseType: 'blob',
        params: { id: this.id.toString() }
      }).subscribe((response: Blob) => {
        if (response.type === 'application/octet-stream') {
          const downloadUrl = URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', 'Phụ lục hợp đồng LD.doc');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
          this.loading = false;
        }
        else {
          const reader = new FileReader();
          reader.onload = () => {
            const jsonBody = reader.result as string;
            const data = JSON.parse(jsonBody);
            this.alertService.warn(data.messageCode, alertOptions);
          };
          reader.readAsText(response);
          this.loading = false;
        }

      });
    }

    else if(e.code === EnumCoreButtonVNSCode.HEADER_PRINT_DROPDOWN){
          if (this.selectedIds.length > 1) {
            this.alertService.warn(this.mls.trans('PRINT_ONE_RECORD'), alertOptions);
            return;
          } else if(this.selectedIds.length == 0){
            this.alertService.warn(this.mls.trans(EnumTranslateKey.REPORT_SELECTED_NOT_NULL), alertOptions);
            return;
          }
          else {
            const fileName = e.childCodeClicked;
            this.loading = true;
            const request = {
              fileName : fileName,
              id : this.selectedIds[0],
              viewName : "CONTRACT_APPENDIX"
            }
            this.appService
              .blobPost(api.EXPORT_WORD_BY_TEMPLATE,request)
              .subscribe((x: any) => {
                let downloadLink = document.createElement("a");
                downloadLink.href = window.URL.createObjectURL(new Blob([x.body]))
                downloadLink.setAttribute("download", fileName +'.doc');
                document.body.appendChild(downloadLink);
                downloadLink.click();
                this.loading = false;
              });
          }
    }
  }
}
