package controllers.admin

import play.api.mvc.{Controller, Action}
import views._

/**
 * Manage an administration home section
 */
object Administration extends Controller {

  // -- Actions

  /**
   * Handle default path requests, redirect to admin home
   */
  def home = Action { implicit request =>
//    TODO: update;
    Ok(html.administration.technology.list())
  }

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