package controllers.admin

import controllers.admin
import enums.ResponseStatus
import models.Technology
import play.api.Logger
import play.api.data.Form
import play.api.data.Forms._
import play.api.i18n.Messages
import play.api.libs.json.{JsString, Json}
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
  def techForm(implicit lang: play.api.i18n.Lang) = Form {
    val maxName = 50
    val maxDescription = 1000

    mapping(
      "id" -> optional(longNumber),
      "name" -> nonEmptyText(maxLength = maxName),
      "description" -> optional(text(maxLength = maxDescription))
    )(Technology.apply)(Technology.unapply)

  }

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

  def queryTech(page: Int = 1, pageSize: Int = 10, orderBy: String, orderDir: Int, filter: String) = Action { implicit request =>

    val data = Technology.page(page, pageSize, orderBy, orderDir, filter)

    data match {
      case Failure(e) =>
        val result = Json.obj(
          "message" -> Messages("error.unable.load.data"),
          "error" -> e.getLocalizedMessage,
          "status" -> ResponseStatus.Error.toString
        )
        BadRequest(result).as(JSON)

      case Success((list, total)) =>
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
  }

  /**
   * Displays technology edit page
   *
   * @param id Technology ID to edit
   */
  def editPage(id: Long) = Action { implicit request =>
    val entity: Try[Technology] = Technology.getOne(id)

    entity match {
      case Success(t) => Ok(html.administration.technology.edit(Some(id))(techForm.fill(t)))
      case Failure(e) =>
        Logger.error("Unable to load record", e)
        Redirect(admin.routes.Administration.techList()).flashing(("error",
          Messages("error.unable.load.record") + ": " + JsString(e.getLocalizedMessage)))
    }
  }

  /**
   * Displays technology create page
   */
  def createPage = Action { implicit request =>
    Ok(html.administration.technology.edit(None)(techForm))
  }

  /**
   * Stores new technology to a database
   */
  def createTech = Action { implicit request =>
    techForm.bindFromRequest.fold(
      errors => BadRequest(html.administration.technology.edit(None)(errors)),
      tech => {
        Technology.add(tech) match {
          case Success(v) => Redirect(admin.routes.Administration.techList()).flashing(("success",
            Messages("success.created.record")))
          case Failure(e) =>
            Logger.error("Unable to create record", e)
            Redirect(admin.routes.TechnologyController.createPage()).flashing(("error",
              Messages("error.unable.create.record") + ": " + JsString(e.getLocalizedMessage)))
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
      errors => BadRequest(html.administration.technology.edit(Some(id))(errors)),
      tech => {
        Technology.put(tech) match {
          case Success(v) => Redirect(admin.routes.Administration.techList()).flashing(("success",
            Messages("success.updated.record")))
          case Failure(e) =>
            Logger.error("Unable to update record", e)
            Redirect(admin.routes.TechnologyController.editPage(id)).flashing(("error",
              Messages("error.unable.update.record") + ": " + JsString(e.getLocalizedMessage)))
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
    Technology.rem(id) match {
      case Success(_) => Ok(Json.obj("status" -> ResponseStatus.Success.toString))
      case Failure(e) => BadRequest(Json.obj("status" -> ResponseStatus.Error.toString,
        "error" -> e.getLocalizedMessage))
    }
  }

}
