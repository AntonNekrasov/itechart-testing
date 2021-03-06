package controllers.admin

import models.Technology
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc.{Controller, Action}
import views.html

/**
 * Manages administration technology section
 */
object TechnologyController extends Controller {

  /**
   * Describe the computer form (used in both edit and create screens).
   */
  val techForm = Form(
    mapping(
      "id" -> ignored(None:Option[Long]),
      "name" -> nonEmptyText
    )(Technology.apply)(Technology.unapply)
  )

  // -- Actions

  /**
   * Displays the paginated list of programming technologies.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on language names
   */
  def queryTech(page: Int = 1, pageSize: Int = 10, orderBy: String, orderDir: Int, filter: String) = Action {
    val list = Technology.page(page, pageSize, orderBy, orderDir, filter)
    val total = Technology.total(filter)
    val result = Json.obj(
      "data" -> list,
      "total" -> total
    )

//    val result = reply[List[Technology]](list, FStatus.Success, total)
    Ok(result).as(JSON)
  }

  /**
   * Displays technology create/edit page.
   *
   * @param tech Technology to edit. None is returned for newly created entities
   */
  def addTech(tech: Option[Long]) = Action {
    Ok(html.administration.technology.edit(None))
  }

  /**
   * Stores new technology to a database.
   */
  def createTech = Action { implicit request =>
    techForm.bindFromRequest.fold(
      errors => BadRequest(""),
      tech => Ok("")
    )
  }

  /**
   * Updates an existing technology
   */
  def updateTech(id: Long) = Action { implicit request =>
    techForm.bindFromRequest.fold(
      errors => BadRequest(""),
      tech => Ok("")
    )
  }

  /**
   * Removes an existing technology
   */
  def removeTech(id: Long) = Action {
    Ok("")
  }

}
