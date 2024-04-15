import { CommonModule } from "@angular/common";
import { Component, OnDestroy, AfterViewInit, ViewEncapsulation } from "@angular/core";
import { Validators, FormGroup, FormsModule } from "@angular/forms";
import { api, EnumTranslateKey } from 'alpha-global-constants';
import { BaseEditComponent, ICoreDropdownOption, ICorePageEditColumnComposition, ICorePageEditCRUD, ICoreFormSection, EnumFormBaseContolType, EnumCoreFormControlSeekerSourceType, DialogService, MultiLanguageService, AppService, IFormatedResponse, CorePageEditComponent, CoreFormService, IAlertOptions, AlertService } from "ngx-histaff-alpha";
import { Subscription, BehaviorSubject, forkJoin, map, zip } from "rxjs";
import { HuPlanningEditService } from "./hu-planning-edit.service";

@Component({
  selector: 'app-hu-planning-edit',
  standalone: true,
  imports: [
    CorePageEditComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './hu-planning-edit.component.html',
  styleUrl: './hu-planning-edit.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HuPlanningEditComponent extends BaseEditComponent implements OnDestroy, AfterViewInit {

  /* Properties to be passed into core-page-edit */

  override entityTable = "HU_PLANNING";
  typePlainOne: string[] = ['TIẾP TỤC QUY HOẠCH', 'QUY HOẠCH LẦN ĐẦU', 'BỔ SUNG QUY HOẠCH'];
  loading: boolean = false;
  planningId!: number;

  subscriptions: Subscription[] = [];

  employeeObjectList$ = new BehaviorSubject<any[]>([]);
  editBufferData$ = new BehaviorSubject<any>(null);
  employeeGetByIdObject$ = new BehaviorSubject<any>(null);
  employeeGetByIdObject = api.HU_EMPLOYEE_READ;

  signGetByIdObject$ = new BehaviorSubject<any>(null);
  signGetByIdApi = api.HU_EMPLOYEE_READ;

  sQhnsObjectGetByIdApi = api.SYS_OTHERLIST_READ;
  sQhnsObjectGetById$ = new BehaviorSubject<any>(null);
  sQhnsObjectOptions$ = new BehaviorSubject<ICoreDropdownOption[]>([]);

  // fPeriodOptions$ = new BehaviorSubject<ICoreDropdownOption[]>([]);
  // fPeriodGetById$ = new BehaviorSubject<any>(null);
  // fPeriodGetByIdApi = api.AT_SALARY_PERIOD_READ;

  posPlanningOptions$ = new BehaviorSubject<ICoreDropdownOption[]>([]);
  posPlanningGetById$ = new BehaviorSubject<any>(null);
  posPlanningGetByIdApi = api.SYS_OTHERLIST_READ;

  typePlanningOptions$ = new BehaviorSubject<ICoreDropdownOption[]>([]);
  typePlanningGetById$ = new BehaviorSubject<any>(null);
  typePlanningGetByIdApi = api.SYS_OTHERLIST_READ;

  evaluateOptions$ = new BehaviorSubject<ICoreDropdownOption[]>([]);
  evaluateGetById$ = new BehaviorSubject<any>(null);
  evaluateGetByIdApi = api.SYS_OTHERLIST_READ;

  // tPeriodOptions$ = new BehaviorSubject<ICoreDropdownOption[]>([]);
  // tPeriodGetById$ = new BehaviorSubject<any>(null);
  // tPeriodGetByIdApi = api.AT_SALARY_PERIOD_READ;

  // jAppLevelOptions$ = new BehaviorSubject<ICoreDropdownOption[]>([]);
  // jAppLevelGetById$ = new BehaviorSubject<any>(null);
  // jAppLevelGetByIdApi = api.HU_JOB_READ;

  sysLevlApproveOptions$ = new BehaviorSubject<ICoreDropdownOption[]>([]);
  sysLevlApproveGetById$ = new BehaviorSubject<any>(null);
  sysLevlApproveGetByIdApi = api.SYS_OTHERLIST_READ;

  captionCode!: EnumTranslateKey;
  formComposition!: ICorePageEditColumnComposition[][];
  crud!: ICorePageEditCRUD;
  subsctiptions: Subscription[] = [];

  apiParams: string[] = [
    'QHNS',
    'LQH',
    'CDQH',
    'DG',
    'LEVEL_APPROVE'
  ]

  alertOptions: IAlertOptions = {
    autoClose: true,
    keepAfterRouteChange: true,
    timeClose: 1000
  };
  sections: ICoreFormSection[] =
    [
      {
        rows: [
          [
            {
              flexSize: 6,
              label: EnumTranslateKey.UI_COMPONENT_LABEL_LEAVEJOB_ID,
              field: 'id',
              value: null,
              controlType: EnumFormBaseContolType.TEXTBOX,
              readonly: true,
              hidden: true,
              type: 'text'
            },
          ],
        ]
      },
      {
        caption: EnumTranslateKey.UI_COMPONENT_LABEL_LEAVEJOB_EMPLOYEE_INFOR,
        rows: [
          [
            // {
            //   flexSize: 3,
            //   label: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_PERIOD,//dot quy hoach
            //   field: 'planningPeriodId',
            //   value: '',
            //   getByIdObject$: this.sQhnsObjectGetById$,
            //   getByIdApi: this.sQhnsObjectGetByIdApi,
            //   shownFrom: 'name',
            //   controlType: EnumFormBaseContolType.DROPDOWN,
            //   dropdownOptions$: this.sQhnsObjectOptions$,
            //   type: 'number',
            //   validators: [
            //     {
            //       name: 'required',
            //       validator: Validators.required,
            //       errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
            //     }
            //   ]
            // },

            {
              flexSize: 3,
              label: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_FROM_YEAR,//giai doan tu nam
              field: 'fromYearId',
              value: '',
              controlType: EnumFormBaseContolType.TEXTBOX,
              // getByIdObject$: this.fPeriodGetById$,
              // getByIdApi: this.fPeriodGetByIdApi,
              // shownFrom: 'name',
              // controlType: EnumFormBaseContolType.DROPDOWN,
              // dropdownOptions$: this.fPeriodOptions$,
              type: 'number',
              validators: [
                {
                  name: 'required',
                  validator: Validators.required,
                  errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
                }
              ]
            },

            {
              flexSize: 3,
              label: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_TO_YEAR,//giai doan den nam
              field: 'toYearId',
              value: '',
              controlType: EnumFormBaseContolType.TEXTBOX,
              // getByIdObject$: this.tPeriodGetById$,
              // getByIdApi: this.tPeriodGetByIdApi,
              // shownFrom: 'name',
              // controlType: EnumFormBaseContolType.DROPDOWN,
              // dropdownOptions$: this.tPeriodOptions$,
              type: 'number',
              validators: [
                {
                  name: 'required',
                  validator: Validators.required,
                  errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
                }
              ]
            },

            {
              flexSize: 3,
              label: EnumTranslateKey.UI_COMPONENT_TITLE_HU_COM_PLANNING_MANAGE_NUM_DECISION,//so quyet dinh
              field: 'decisionNo',
              value: '',
              controlType: EnumFormBaseContolType.TEXTBOX,
              type: 'text',
              validators: [
                {
                  name: 'required',
                  validator: Validators.required,
                  errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
                }
              ]
            },

          ],
          [
            {
              flexSize: 3,
              label: EnumTranslateKey.UI_COMPONENT_TITLE_INS_CHANGE_EFFECTIVE_DATE,//ngay hieu luc
              field: 'effectDate',
              value: '',
              controlType: EnumFormBaseContolType.DATEPICKER,
              type: 'date',
              validators: [
                {
                  name: 'required',
                  validator: Validators.required,
                  errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
                }
              ]
            },
            {
              flexSize: 3,
              label: EnumTranslateKey.UI_COMPONENT_TITLE_INS_CHANGE_EXPIRE_DATE,//ngay ket thuc
              field: 'expireDate',
              value: '',
              controlType: EnumFormBaseContolType.DATEPICKER,
              type: 'date',
            },
            {
              flexSize: 3,
              label: EnumTranslateKey.UI_COMPONENT_TITLE_HU_PLANNING_TOTAL_PERSONNEL,//tong so can bo trong ky quy hoach
              field: 'totalPersonnel',
              value: '',
              controlType: EnumFormBaseContolType.TEXTBOX,
              type: 'text',
              readonly: true
            },
          ]
        ],
      },
      {
        caption: EnumTranslateKey.UI_COMPONENT_TITLE_HU_PLANNING_INFO_APPROVE,
        rows: [
          [
            {
              flexSize: 3,
              label: EnumTranslateKey.UI_COMPONENT_TITLE_HU_COM_PLANNING_MANAGE_SIGN_DAY,//ngay ky
              field: 'signDate',
              value: '',
              controlType: EnumFormBaseContolType.DATEPICKER,
              type: 'date',
            },
            {
              flexSize: 3,
              label: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_APP_LEVEL,//cap phe duyet
              field: 'appLevel',
              value: '',
              getByIdObject$: this.sysLevlApproveGetById$,
              getByIdApi: this.sysLevlApproveGetByIdApi,
              shownFrom: 'name',
              controlType: EnumFormBaseContolType.DROPDOWN,
              dropdownOptions$: this.sysLevlApproveOptions$,
              type: 'number',
              validators: [
                {
                  name: 'required',
                  validator: Validators.required,
                  errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
                }
              ]
            },
            {
              flexSize: 3,
              label: EnumTranslateKey.UI_ENTITY_FIELD_CAPTION_DISCIPLINE_SIGNER_NAME,
              field: 'signerId',
              value: '',
              controlType: EnumFormBaseContolType.SEEKER,
              seekerSourceType: EnumCoreFormControlSeekerSourceType.EMPLOYEE_SEEK,
              getByIdObject$: this.signGetByIdObject$,
              getByIdApi: this.signGetByIdApi,
              boundFrom: 'id',
              shownFrom: 'fullname',
              alsoBindTo: [
                { takeFrom: 'positionName', bindTo: 'positionName' },
                { takeFrom: 'fullname', bindTo: 'signerName' },
              ],
              type: 'string',
              // validators: [
              //   {
              //     name: 'required',
              //     validator: Validators.required,
              //     errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
              //   }
              // ]
            },
            {
              flexSize: 3,
              label: EnumTranslateKey.UI_ENTITY_FIELD_CAPTION_DISCIPLINE_SIGNER_POSITION,
              field: 'positionName',
              value: '',
              controlType: EnumFormBaseContolType.TEXTBOX,
              type: 'string',
              disabled: true
            },
          ],
          [
            {
              flexSize: 3,
              label: EnumTranslateKey.UI_ENTITY_FIELD_CAPTION_FAMILY_UPLOAD_FILE,
              field: 'attachmentBuffer',
              value: "",
              controlType: EnumFormBaseContolType.ATTACHMENT,
              assignTo: 'attachment',
              valueToShow: '',
              type: 'object',
            },
            {
              flexSize: 9,
              label: EnumTranslateKey.UI_ENTITY_FIELD_CAPTION_FAMILY_NOTE,
              field: 'note',
              value: '',
              controlType: EnumFormBaseContolType.TEXTBOX,
              type: 'text'
            },
            {
              flexSize: 6,
              label: EnumTranslateKey.UI_ENTITY_FIELD_CAPTION_SE_DOCUMENT_INFO_FILE,
              field: 'attachment',
              value: '',
              controlType: EnumFormBaseContolType.TEXTBOX,
              type: 'string',
              hidden: true
            },
          ],
        ]
      },
      {
        rows: [
          [
            {
              flexSize: 12,
              label: EnumTranslateKey.UI_COMPONENT_TITLE_EMPLOYEE_CHECKER,
              field: 'employeeIds',
              value: [],
              controlType: EnumFormBaseContolType.SEEKER,
              type: 'object',
              /* 
                START: Thay đổi thuộc tính của SEEKER để có SELECTOR:
              */
              seekerSourceType: EnumCoreFormControlSeekerSourceType.EMPLOYEE_SEEK,
              multiMode: true,
              multiModeExtendedColumns: [
                {
                  caption: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_POSITION_PLANNING,
                  field: "planningTitleId",
                  type: "number",
                  align: "left",
                  width: 200,
                  hidden: true
                },
                {
                  caption: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_POSITION_PLANNING,
                  field: "planningTitleName",
                  type: "string",
                  align: "left",
                  width: 200,
                },

                {
                  caption: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_POSITION_PLANNING,
                  field: "planningTypeId",
                  type: "number",
                  align: "left",
                  width: 200,
                  hidden: true
                },
                {
                  caption: EnumTranslateKey.UI_COMPONENT_TITLE_HU_COM_PLANNING_MANAGE_TYPE_OF_PLANNING,
                  field: "planningTypeName",
                  type: "string",
                  align: "left",
                  width: 200,
                },

                // {
                //   caption: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_POSITION_PLANNING,
                //   field: "evaluateId",
                //   type: "number",
                //   align: "left",
                //   width: 200,
                //   hidden: true
                // },

                // {
                //   caption: EnumTranslateKey.UI_COMPONENT_TITLE_HU_COM_PLANNING_MANAGE_EVALUATE,
                //   field: "evaluateName",
                //   type: "string",
                //   align: "left",
                //   width: 160,
                // },

                {
                  caption: EnumTranslateKey.UI_ENTITY_FIELD_CAPTION_HU_CERTIFICATE_LEVEL_TRAIN,
                  field: "levelTrainName",
                  type: "string",
                  align: "left",
                  width: 160,
                }


              ],
              multiModeExtendedSections: [
                {
                  caption: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_TYPE,
                  rows: [
                    [
                      {
                        field: "id",
                        controlType: EnumFormBaseContolType.TEXTBOX,
                        flexSize: 0,
                        label: EnumTranslateKey.UI_COMMON_EMPTY_STRING,
                        value: null,
                        type: "number",
                        hidden: true
                      },
                      {
                        field: "planningTitleId",
                        controlType: EnumFormBaseContolType.DROPDOWN,
                        flexSize: 6,
                        label: EnumTranslateKey.UI_ENTITY_FIELD_HU_PLANNING_POSITION_PLANNING,
                        value: "",
                        shownFrom: "name",
                        type: "number",
                        getByIdObject$: this.posPlanningGetById$,
                        getByIdApi: this.posPlanningGetByIdApi,
                        dropdownOptions$: this.posPlanningOptions$,
                        validators: [
                          {
                            name: 'required',
                            validator: Validators.required,
                            errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
                          }
                        ]
                      },
                      {
                        field: "planningTypeId",
                        controlType: EnumFormBaseContolType.DROPDOWN,
                        flexSize: 6,
                        label: EnumTranslateKey.UI_COMPONENT_TITLE_HU_COM_PLANNING_MANAGE_TYPE_OF_PLANNING,
                        value: "",
                        shownFrom: "name",
                        type: "number",
                        getByIdObject$: this.typePlanningGetById$,
                        getByIdApi: this.typePlanningGetByIdApi,
                        dropdownOptions$: this.typePlanningOptions$,
                        validators: [
                          {
                            name: 'required',
                            validator: Validators.required,
                            errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
                          }
                        ]
                      },
                    ],
                    // [
                    //   {
                    //     field: "evaluateId",
                    //     controlType: EnumFormBaseContolType.DROPDOWN,
                    //     flexSize: 6,
                    //     label: EnumTranslateKey.UI_COMPONENT_TITLE_HU_COM_PLANNING_MANAGE_EVALUATE,
                    //     value: '',
                    //     shownFrom: "name",
                    //     type: "number",
                    //     getByIdObject$: this.evaluateGetById$,
                    //     getByIdApi: this.evaluateGetByIdApi,
                    //     dropdownOptions$: this.evaluateOptions$
                    //   },
                    //   // {
                    //   //   field: "levelTrainName",
                    //   //   controlType: EnumFormBaseContolType.TEXTBOX,
                    //   //   flexSize: 6,
                    //   //   label: EnumTranslateKey.UI_COMPONENT_TITLE_HU_COM_PLANNING_MANAGE_TYPE_OF_PLANNING,
                    //   //   value: "",
                    //   //   type: "string",
                    //   // },
                    // ]
                  ]
                }
              ],
              objectList$: this.employeeObjectList$,
              editBufferData$: this.editBufferData$,
              getObjectListFrom: 'employeeList',
              getByIdObject$: this.employeeGetByIdObject$,
              // getByIdApi: this.employeeGetByIdApi,
              disabled: false,
              boundFrom: 'id',
              shownFrom: 'fullname',
              // alsoBindTo: [{ takeFrom: 'positionName', bindTo: 'signPosition' }],
              /* END: WHEN USING controlType === EnumFormBaseContolType.SEEKER */
              validators: [
                {
                  name: 'required',
                  validator: Validators.required,
                  errorMessage: EnumTranslateKey.UI_FORM_CONTROL_ERROR_REQUIRED,
                }
              ]

            },
            {
              flexSize: 12,
              label: EnumTranslateKey.UI_COMMON_EMPTY_STRING,
              field: 'employeeList',
              value: [],
              controlType: EnumFormBaseContolType.HIDDEN,
              type: 'object'
            },
          ]
        ]
      }
    ];
  constructor(
    public override dialogService: DialogService,
    private mls: MultiLanguageService,
    private appService: AppService,
    private huPlanningEditService: HuPlanningEditService,
    private coreFormService: CoreFormService,
    private alertService: AlertService
  ) {
    super(dialogService);
    this.captionCode = EnumTranslateKey.UI_COMPONENT_TITLE_HU_PLANNING;
    this.crud = {
      c: api.HU_PLANNING_CREATE,
      r: api.HU_PLANNING_READ,
      u: api.HU_PLANNING_UPDATE,
      d: api.HU_PLANNING_DELETE_IDS,
    };

  }

  ngOnInit(): void {
    this.loading = true;
    this.getAllValueDropdownSysOrtherList();

    // setTimeout(() => {

    //   this.subsctiptions.push(
    //     this.huPlanningEditService.GetAppLevel()
    //       .pipe(
    //         map((f: any) => {
    //           const options: { value: number; text: string; }[] = [];
    //           f.body.innerBody.map((g: any) => {
    //             options.push({
    //               value: g.id,
    //               text: g.name
    //             })
    //           })
    //           return options;
    //         })
    //       )
    //       .subscribe(response => {
    //         this.sysLevlApproveOptions$.next(response);
    //         this.loading = false;
    //       })
    //   );
    // })

    // this.subscriptions.push(
    //   this.appService.get(api.AT_SALARY_PERIOD_GET_YEAR).subscribe((res: any) => {
    //     if (!!res.ok && res.status === 200) {
    //       const body: IFormatedResponse = res.body
    //       if (body.statusCode === 200 && !!body.innerBody) {
    //         const options: { value: number | null; text: string; }[] = [];
    //         res.body.innerBody.map((g: any) => {
    //           options.push({
    //             value: g,
    //             text: g
    //           })
    //         })
    //         this.sysLevlApproveOptions$.next(options);
    //       }
    //     }
    //   })
    // )
    //this.formInitStringValue = JSON.stringify(this.form.getRawValue());
  }

  /* GET FormGroup Instance */
  popupForm!: FormGroup;
  onFormCreated(e: FormGroup): void {
    this.form = e;

    this.subscriptions.push(
      this.coreFormService.getFormBaseControlByName(this.sections, 'employeeIds')!.editBufferData$?.subscribe(x => {
        console.log("editBufferData changed: ", x)
        this.subscriptions.push(
          zip(
            this.appService.get(api.SYS_OTHERLIST_READ + "?id=" + x.planningTitleId),
            this.appService.get(api.SYS_OTHERLIST_READ + "?id=" + x.planningTypeId),
            this.appService.get(api.HU_PLANNING_GET_CERTIFICATE_BY_EMP + "?id=" + x.id)
          ).subscribe(xs => {
            if ((xs[0].ok && xs[0].status === 200 && xs[0].body?.statusCode === 200) && (xs[1].ok && xs[1].status === 200 && xs[1].body?.statusCode === 200)
              && (xs[2].ok && xs[2].status === 200 && xs[2].body?.statusCode === 200)) {
              const text0 = xs[0].body?.innerBody?.name;
              const text1 = xs[1].body?.innerBody?.name;
              const text2 = xs[2].body?.innerBody?.name;
              const newEmployeeObjectList = this.employeeObjectList$.value
              const filter = newEmployeeObjectList?.filter(l => l.id === x.id)
              if (filter?.length === 1) {
                filter[0].planningTitleName = text0
                filter[0].planningTypeName = text1
                filter[0].levelTrainName = text2
              }
              this.employeeObjectList$.next(newEmployeeObjectList);
              this.form.get('employeeList')?.patchValue(this.employeeObjectList$.value);
              console.log(this.employeeObjectList$.value);
              let count = this.employeeObjectList$.value.filter(x => !!x.planningTypeName && this.typePlainOne.includes(x.planningTypeName.toString().trim().toUpperCase()));
              this.form.get('totalPersonnel')?.setValue(count.length)
            }
            else {
              //this.alertService.warn(this.mls.trans(EnumTranslateKey.UI_COMPONENT_TITLE_HU_COMMEND_MUST_CHOOSE_EMPLOYEE_OBJ), this.alertOptions)
            }
          }),
        )
        // if (x.evaluateId != undefined && x.evaluateId != null) {
        //   this.appService.get(api.SYS_OTHERLIST_READ + "?id=" + x.evaluateId).subscribe(p => {
        //     if (!!p.ok && p.status === 200) {
        //       const text2 = p.body?.innerBody?.name;
        //       const newEmployeeObjectList = this.employeeObjectList$.value
        //       const filter = newEmployeeObjectList?.filter(l => l.id === x.id)
        //       if (filter?.length === 1) {
        //         filter[0].evaluateName = text2
        //       }
        //       this.employeeObjectList$.next(newEmployeeObjectList);
        //       this.form.get('employeeList')?.patchValue(this.employeeObjectList$.value);
        //     }
        //   })
        // }
      })!
    )
  }

  /* To allow form to be deactivated */
  onFormReinit(e: string): void {
    //Number(this.planningId)
    //this.formInitStringValue = String(this.planningId);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // console.log("ngAfterViewInit: ", this.form.get('id')?.value);
      this.planningId = this.huPlanningEditService.planningId;
      console.log(this.planningId.toString());
      if (!!this.planningId) {
        this.form.get('id')?.setValue(this.planningId);
        this.subsctiptions.push(
          this.appService
            .get(api.HU_PLANNING_READ_BY_ID + this.planningId.toString())
            .subscribe((x: any) => {
              if (x.ok && x.status == 200) {
                let resObj = x.body.innerBody;
                this.form.patchValue(resObj);

                let objSignName = {
                  value: resObj.signerId,
                  fullname: resObj.signerName,
                };
                this.signGetByIdObject$.next(objSignName);
                this.employeeObjectList$.next(resObj.employeeList); // Gan lai employeeObjectList

                this.sections.map((section) => {
                  section.rows.map((row) => {
                    row.map((control) => {
                      if (control.controlType === EnumFormBaseContolType.ATTACHMENT) {
                        control.valueToShow = resObj.attachment
                      }
                    });
                  });
                });

                this.formInitStringValue = JSON.stringify(
                  this.form.getRawValue()
                );
              }
            })
        );
      }
    })
    // this.form.get('signerId')?.valueChanges.subscribe(x => {
    //   if(x == null){
    //     this.form.get("positionName")?.patchValue(null);
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.subscriptions.map(x => {
      if (x) x.unsubscribe()
    })
    //this.huPlanningEditService.planningId = 0;
  }

  getAllValueDropdownSysOrtherList() {
    forkJoin(
      this.apiParams.map((param) =>
        this.appService.get(api.SYS_OTHERLIST_GETOTHERLISTBYTYPE + param)
      )
    ).subscribe((responses) => {
      responses.forEach((item, index) => {
        if (item.body.statusCode == 200 && item.ok == true) {
          const options: { value: number | null; text: string }[] = [];
          item.body.innerBody.map((g: any) => {
            options.push({
              value: g.id,
              text: g.name,
            });
          });
          const param = this.apiParams[index];
          switch (param) {
            case 'QHNS':  // dot khai bao
              this.sQhnsObjectOptions$.next(options);
              break;
            case 'LQH': //loai quy hoach
              this.typePlanningOptions$.next(options);
              break;
            case 'CDQH':
              this.posPlanningOptions$.next(options);
              break;
            case 'DG':
              this.evaluateOptions$.next(options);
              break;
            case 'LEVEL_APPROVE':
              this.sysLevlApproveOptions$.next(options);
              break;
            default:
              break;
          }
        }
      });
    });
  }
}

