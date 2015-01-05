package controllers.admin

import controllers.admin
import enums.ResponseStatus
import models.Technology
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc.{Controller, Action}
import views.html

import scala.util.{Failure, Success}

/**
 * Manages administration technology section
 */
object TechnologyController extends Controller {

  /**
   * Describes the technology form
   */
  val techForm = Form(
    mapping(
      "id" -> optional(longNumber),
      "name" -> nonEmptyText,
      "description" -> optional(text)
    )(Technology.apply)(Technology.unapply)
  )

  // -- Actions

  /**
   * Displays the paginated list of programming technologies.
   *
   * @param page Current page number (starts from 0)
   * @param pageSize Page size
   * @param orderBy Column to be sorted
   * @param orderDir Order direction (default ASC)
   * @param filter Filter applied on language names
   */
  def queryTech(page: Int = 1, pageSize: Int = 10, orderBy: String, orderDir: Int, filter: String) = Action {
    val list = Technology.page(page, pageSize, orderBy, orderDir, filter)
    val total = Technology.total(filter)

    //TODO: implement counting total pages
    val result = Json.obj(
      "data" -> Json.obj(
        "list" -> list,
        "total" -> total,
        "page" -> page
      ),
      "status" -> ResponseStatus.Success.toString
    )

    Ok(result).as(JSON)
  }

  /**
   * Displays technology create/edit page
   *
   * @param tech Technology to edit. None is returned for newly created entities
   */
  def editPage(tech: Option[Long]) = Action {
    val entity = tech.flatMap(id => Technology.getOne(id))
    val form = entity.map(e => techForm.fill(e)).getOrElse(techForm)

//    val form = tech.flatMap(id => Technology.getOne(id)).map(e => techForm.fill(e)).getOrElse(techForm)

    Ok(html.administration.technology.edit(entity, form))
  }

  /**
   * Stores new technology to a database.
   */
  def createTech = Action { implicit request =>
    techForm.bindFromRequest.fold(
      errors => BadRequest(""),//TODO: update
      tech => {
        Technology.add(tech) match {
          case Success(v) => Redirect(admin.routes.Administration.techList()).flashing(("updated", "success"))//TODO: update
          case Failure(e) => {
            e.printStackTrace()
            Redirect(admin.routes.TechnologyController.editPage()).flashing(("error", e.getLocalizedMessage))
          }//TODO: update
        }
      }
    )
  }

  /**
   * Updates an existing technology
   */
  def updateTech(id: Long) = Action { implicit request =>
    techForm.bindFromRequest.fold(
      errors => BadRequest(""),//TODO: update
      tech => {
        Technology.put(tech) match {
          case Success(v) => Redirect(admin.routes.Administration.techList()).flashing(("updated", "success"))//TODO: update
          case Failure(e) => {
            e.printStackTrace()
            Redirect(admin.routes.TechnologyController.editPage(Some(id))).flashing(("error", e.getLocalizedMessage))
          }//TODO: update
        }
      }
    )
  }

  /**
   * Removes an existing technology
   */
  def removeTech(id: Long) = Action {
    Technology.rem(id)
    Ok(Json.obj("status" -> ResponseStatus.Success.toString))
  }

}
