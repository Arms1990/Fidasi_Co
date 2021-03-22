import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OnboardService } from 'src/app/shared/services/onboard.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  // userId: any = null;
  user: any = null;
  isDone: Boolean = false;

  activationTypes = [
    { label: 'Change of Supplier', value: 'change_of_supplier' },
    { label: 'New Activation', value: 'new_activation' },
    { label: 'Takeover/Voltura', value: 'tv' }
  ];

  numberOfPeoples = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5+', value: '5+' }
  ];

  listOfAppliances = [
    { label: 'Dish Washer', value: 'dish_washer' },
    { label: 'Washing Machine', value: 'washing_machine' },
    { label: 'Conditioner', value: 'conditioner' },
    { label: 'Water Heater', value: 'water_heater' },
    { label: 'Oven', value: 'oven' }
  ];

  onboardingForm = this.formBuilder.group({
    moa: [ '' ],
    first_name: [ '' ],
    surname: [ '' ],
    telephone: [ '' ],
    email: [ '' ],
    // activationType: [ '' ],
    // numberOfPeople: [ '' ],
    // appliances: this.formBuilder.array(this.listOfAppliances.map( appliance => false )),
    // document: [ '' ],
    tos: [ '' ]
  });

  constructor(
    private formBuilder: FormBuilder,
    private onboardService: OnboardService,
    private notification: NotificationService,
    private route: ActivatedRoute
  ) { }

  // get appliances() {
  //   return this.onboardingForm.get('appliances') as FormArray;
  // }

  get tos() {
    return this.onboardingForm.get('tos');
  }

  onboard(event: any) {
    event.preventDefault();

    const values = {
      ...this.onboardingForm.value,
      // appliances: this.onboardingForm.value.appliances.map( (appliance: any, index: number) => appliance && this.listOfAppliances[index].value).filter((appliance: any) => !!appliance)
    }

    return this.onboardService.onboard(values)
      .subscribe(
        (response: any) => {
          this.notification.success('Successo', response.message);
          this.isDone = true;
        }
      );
    
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe( (params: any) => {
      // this.userId = +params['id'];
      this.getUserInformation();
    })
  }

  getUserInformation() {
    return this.onboardService.getUser().subscribe( (response: any) => {
      const { user } = response;
      this.user = user;
      this.onboardingForm.patchValue({
        moa: user.moa,
        first_name: user.name,
        surname: user.surname,
        email: user.email,
        tos: user.tos_accepted,
        telephone: user.phoneNumbers[0].phone_number //Todo - Make this field support multiple numbers
      });
    });
  }

}
