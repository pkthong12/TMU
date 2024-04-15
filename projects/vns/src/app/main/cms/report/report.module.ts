import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReportRoutes } from "./report.routing";
import { Error404Module } from "../../errors/404/error-404.module";

@NgModule({
  imports: [RouterModule.forChild(ReportRoutes), Error404Module],
})
export class ReportModule {}
