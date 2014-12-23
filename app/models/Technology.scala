package models

import org.squeryl.PrimitiveTypeMode._

/**
 * Testing technology
 */

case class Technology(id: Option[Long] = None, name: String)

object Technology {

  def queryAll(): List[Technology] = inTransaction(
    from(AppDB.technology)(a => select(a)).toList
  )

  def findOne(id: Int): Option[Technology] = {
    inTransaction(from(AppDB.technology)(
      a => where(a.id === id) select a).headOption
    )
  }





}
