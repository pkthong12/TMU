import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProfileListRoutes } from "./applist.routing";

@NgModule({
  imports: [
    RouterModule.forChild(ProfileListRoutes),

  ],
  declarations: [
  ],
})
export class ProfileListModule {}
