package controllers

import play.api.libs.json.{JsNumber, JsObject, Json}

/**
 * Base controller. Defines the response format
 */
trait BasicU {

  def reply[T](data: T, status: RStatus.Value, total: Long = 0): JsObject = {
    val o = Json.obj(
      "status" -> status.toString,
//      "data" -> Json.toJson(data)
      "data" -> data.toString
    )
    if(total > 0) o.+(("total", JsNumber(total)))
    o
  }
}

object RStatus extends Enumeration {
  type Status = Value

  val Success, Error = Value
}