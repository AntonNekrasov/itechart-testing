package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  // TODO : temporary section
  val Admin = Redirect(admin.routes.Administration.home)


  //
  // Actions
  //

  def index = Action { Admin }

}