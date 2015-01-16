package controllers

import play.api._
import play.api.mvc._
import views.html

object Application extends Controller {

  // TODO : temporary section
  val Admin = Redirect(admin.routes.Administration.home)
//  val Stub = Ok(html.auxiliary.stub())

  //
  // Actions
  //

  def index = Action { implicit request =>
    Redirect(admin.routes.Administration.home)
  }

}