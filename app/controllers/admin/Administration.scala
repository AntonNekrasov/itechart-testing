package controllers.admin

import play.api.mvc.{Controller, Action}
import play.twirl.api.Html
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
    Ok(html.administration.technology.list())
  }

  /**
   * Display the paginated list of programming languages.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on language names
   */
  def techList(page: Int, orderBy: Int, filter: String) = Action { implicit request =>
    Ok(html.administration.technology.list())
  }

  /**
   * Display the paginated list of quizes.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on quiz names
   */
  def quizList(page: Int, orderBy: Int, filter: String) = Action { implicit request =>
    Ok(html.administration.quiz.list())
  }

  /**
   * Display the paginated list of questionnaires.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on questionnaire names
   */
  def questList(page: Int, orderBy: Int, filter: String) = Action { implicit request =>
    Ok(html.administration.questionnaire.list())
  }

  /**
   * Display the paginated list of questionnaires.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on questionnaire names
   */
  def testList(page: Int, orderBy: Int, filter: String) = Action { implicit request =>
    Ok(html.administration.test.list())
  }


}