package controllers

import enums.MainSection
import play.api.mvc._
import play.twirl.api.Html
import views.html

object Application extends Controller {

  //
  // Actions
  //

  /**
   * Root action
   */
  def index = Action { implicit request =>
    //TODO: update this
    Ok(html.index(Html(""))(MainSection.Home))
  }

  /**
   * Redirects to home section
   */
  def homeSection =  TODO

  /**
   * Redirects to tests section
   */
  def testsSection = TODO

  /**
   * Redirects to results section
   */
  def resultsSection = TODO

  /**
   * Redirects to admin section
   */
  def adminSection = Action { implicit request =>
    Ok(html.administration.technology.list())
  }


}