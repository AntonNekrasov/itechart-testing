package controllers.admin

import play.api.mvc.{Controller, Action}
import views._

/**
 * Manage an administration section
 */
object Administration extends Controller {

  //
  //  Actions
  //


  /**
   * Handle default path requests, redirect to admin home
   */
  def home = Action { implicit request =>
    Ok(html.admin.home())
  }

  /**
   * Display the paginated list of programming languages.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on language names
   */
  def langList(page: Int, orderBy: Int, filter: String) = Action { implicit request =>
    Ok(html.admin.technology.list())
  }




}