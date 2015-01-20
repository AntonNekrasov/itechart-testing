package controllers.admin

import controllers.admin
import enums.ResponseStatus
import models.Technology
import play.api.Logger
import play.api.data.Form
import play.api.data.Forms._
import play.api.i18n.Messages
import play.api.libs.json.Json
import play.api.mvc.{Controller, Action}
import views.html
import scala.util.{Try, Failure, Success}

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
   * Displays the paginated list of programming technologies
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
    val totalPages = total / pageSize + (if(total % pageSize != 0) 1 else 0)

    val result = Json.obj(
      "data" -> Json.obj(
        "list" -> list,
        "total" -> totalPages,
        "page" -> page
      ),
      "status" -> ResponseStatus.Success.toString
    )
    Ok(result).as(JSON)
  }

  /**
   * Displays technology create/edit page
   *
   * @param techId Technology ID to edit. None is returned for newly created entities
   */
  def editPage(techId: Option[Long]) = Action { implicit request =>
    val entity: Option[Try[Technology]] = techId.map(id => Technology.getOne(id))
    val form: Try[Form[Technology]] = entity map {v => v.map(f => techForm.fill(f))
    } getOrElse(Success(techForm))

    form match {
      case Success(form) => Ok(html.administration.technology.edit(form))
      case Failure(e) => {
//        todo: resolve issue with flashing, without redirecting
        BadRequest(html.administration.technology.list()).flashing(("error", Messages("error.unable.load.record") + ": " + e.getLocalizedMessage))
      }
    }
  }

  /**
   * Stores new technology to a database
   */
  def createTech = Action { implicit request =>
    techForm.bindFromRequest.fold(
      errors => BadRequest(html.administration.technology.edit(errors)),
      tech => {
        Technology.add(tech) match {
          case Success(v) => Redirect(admin.routes.Administration.techList()).flashing(("success",
            Messages("success.created.record")))
          case Failure(e) =>
            Logger.error(Messages("error.unable.create.record"), e)
            Redirect(admin.routes.TechnologyController.editPage()).flashing(("error",
              Messages("error.unable.create.record") + ": " + e.getLocalizedMessage))
        }
      }
    )
  }

  /**
   * Updates an existing technology
   *
   * @param id Technology id, used for getting appropriate record
   */
  def updateTech(id: Long) = Action { implicit request =>
    techForm.bindFromRequest.fold(
      errors => BadRequest(html.administration.technology.edit(errors)),
      tech => {
        Technology.put(tech) match {
          case Success(v) => Redirect(admin.routes.Administration.techList()).flashing(("success",
            Messages("success.updated.record")))
          case Failure(e) =>
            Logger.error(Messages("error.unable.update.record"), e)
            Redirect(admin.routes.TechnologyController.editPage(Some(id))).flashing(("error",
              Messages("error.unable.update.record") + ": " + e.getLocalizedMessage))
        }
      }
    )
  }

  /**
   * Removes an existing technology
   *
   * @param id Technology id. using for getting appropriate record
   */
  def removeTech(id: Long) = Action {
    Technology.rem(id)
    Ok(Json.obj("status" -> ResponseStatus.Success.toString))
  }

}
