package views

import views.html.auxiliary.textInput
import views.html.helper.FieldConstructor

/**
 * Defines custom templates for the app
 */
object rpHelpers {
  implicit val rpTextInput = FieldConstructor(textInput.f)
}

