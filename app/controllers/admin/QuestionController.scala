package controllers.admin

import controllers.admin
import enums.ResponseStatus
import models.Question
import play.api.Logger
import play.api.data.Form
import play.api.data.Forms._
import play.api.i18n.Messages
import play.api.libs.json.{JsString, Json}
import play.api.mvc.{Controller, Action}
import views.html
import scala.util.{Try, Failure, Success}

/**
 * Manages administration question section
 */
object QuestionController extends Controller {

  /**
   * Describes the question form
   */
  def questForm(implicit lang: play.api.i18n.Lang) = Form {
    val maxBody = 1000

    mapping(
      "id" -> optional(longNumber),
      "body" -> nonEmptyText(maxLength = maxBody)
    )(Question.apply)(Question.unapply)

  }

  // -- Actions

  /**
   * Displays the paginated list of questions
   *
   * @param page Current page number (starts from 0)
   * @param pageSize Page size
   * @param orderBy Column to be sorted
   * @param orderDir Order direction (default ASC)
   * @param filter Filter applied on question technologies
   */
  def queryQuest(page: Int = 1, pageSize: Int = 10, orderBy: String, orderDir: Int, filter: String) = Action { implicit request =>

    val data = Question.page(page, pageSize, orderBy, orderDir, filter)

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
   * Displays question edit page
   *
   * @param id Question ID to edit
   */
  def editPage(id: Long) = Action { implicit request =>
    val entity: Try[Question] = Question.getOne(id)

    entity match {
      case Success(t) => Ok(html.administration.questionnaire.edit(Some(id))(questForm.fill(t)))
      case Failure(e) =>
        Logger.error("Unable to load record", e)
        Redirect(admin.routes.Administration.questList()).flashing(("error",
          Messages("error.unable.load.record") + ": " + JsString(e.getLocalizedMessage)))
    }
  }

  /**
   * Displays technology create page
   */
  def createPage = Action { implicit request =>
    Ok(html.administration.questionnaire.edit(None)(questForm))
  }

  /**
   * Stores new technology to a database
   */
  def createQuest = Action { implicit request =>
    questForm.bindFromRequest.fold(
      errors => BadRequest(html.administration.questionnaire.edit(None)(errors)),
      tech => {
        Question.add(tech) match {
          case Success(v) => Redirect(admin.routes.Administration.techList()).flashing(("success",
            Messages("success.created.record")))
          case Failure(e) =>
            Logger.error("Unable to create record", e)
            Redirect(admin.routes.QuestionController.createPage()).flashing(("error",
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
  def updateQuest(id: Long) = Action { implicit request =>
    questForm.bindFromRequest.fold(
      errors => BadRequest(html.administration.questionnaire.edit(Some(id))(errors)),
      question => {
        Question.put(question) match {
          case Success(v) => Redirect(admin.routes.Administration.questList()).flashing(("success",
            Messages("success.updated.record")))
          case Failure(e) =>
            Logger.error("Unable to update record", e)
            Redirect(admin.routes.QuestionController.editPage(id)).flashing(("error",
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
  def removeQuest(id: Long) = Action {
    Question.rem(id) match {
      case Success(_) => Ok(Json.obj("status" -> ResponseStatus.Success.toString))
      case Failure(e) => BadRequest(Json.obj("status" -> ResponseStatus.Error.toString,
        "error" -> e.getLocalizedMessage))
    }
  }

}
