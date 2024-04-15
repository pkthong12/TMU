import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AttendanceListRoutes } from "./attendancelist.routing";

@NgModule({
  imports: [RouterModule.forChild(AttendanceListRoutes)],
  declarations: [
  ],
})
export class AttendanceListModule {}
