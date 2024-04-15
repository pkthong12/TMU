import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MediaRoutes } from "./media.routing";
import { Error404Module } from "../../errors/404/error-404.module";

@NgModule({
  imports: [RouterModule.forChild(MediaRoutes)],
})
export class MediaModule {}
