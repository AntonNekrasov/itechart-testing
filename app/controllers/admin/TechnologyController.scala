package controllers.admin

import models.Technology
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc.{Controller, Action}

/**
 * Manage an administration technology section
 */

object TechnologyController extends Controller {

  /**
   * Describe the computer form (used in both edit and create screens).
   */
  val computerForm = Form(
    mapping(
      "id" -> ignored(None:Option[Long]),
      "name" -> nonEmptyText
    )(Technology.apply)(Technology.unapply)
  )

  // -- Actions



}
