package controllers.admin

import play.api.mvc.{Controller, Action}
import views._

/**
 * Manage an administration home section
 */
object Administration extends Controller {

  // -- Actions

  /**
   * Forwards to admin technology section
   */
  def techList = Action { implicit request =>
    Ok(html.administration.technology.list())
  }

  /**
   * Forwards to admin quiz section
   */
  def quizList = Action { implicit request =>
    Ok(html.administration.quiz.list())
  }

  /**
   * Forwards to admin questionnaires section
   */
  def questList = Action { implicit request =>
    Ok(html.administration.questionnaire.list())
  }

  /**
   * Forwards to admin tests section
   */
  def testList = Action { implicit request =>
    Ok(html.administration.test.list())
  }

}