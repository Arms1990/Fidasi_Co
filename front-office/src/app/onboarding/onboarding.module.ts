import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [OnboardingComponent],
  imports: [
    CommonModule,
    SharedModule,
    OnboardingRoutingModule
  ]
})
export class OnboardingModule { }
