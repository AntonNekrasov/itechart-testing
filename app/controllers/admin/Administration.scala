package controllers.admin

import play.api.mvc.{Controller, Action}
import views._

/**
 * Manage an administration home section
 */
object Administration extends Controller {

  val Technology = Ok(html.administration.technology.list())

  val Questionnaire = Ok(html.administration.questionnaire.list())

  val Test = Ok(html.administration.test.list())

  val Quiz = Ok(html.administration.quiz.list())

  // -- Actions

  /**
   * Handle default path requests, redirect to admin home
   */
  def home = Action { Technology }

  /**
   * Forwards to a admin technology section.
   */
  def techList = Action { Technology }

  /**
   * Display the paginated list of quizes.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on quiz names
   */
  def quizList(page: Int, orderBy: Int, filter: String) = Action { Quiz }

  /**
   * Display the paginated list of questionnaires.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on questionnaire names
   */
  def questList(page: Int, orderBy: Int, filter: String) = Action { Questionnaire }

  /**
   * Display the paginated list of questionnaires.
   *
   * @param page Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param filter Filter applied on questionnaire names
   */
  def testList(page: Int, orderBy: Int, filter: String) = Action { Test }

}