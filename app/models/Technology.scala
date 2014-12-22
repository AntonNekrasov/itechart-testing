package models

import anorm.SqlParser._
import anorm._
import play.api.db.DB
import play.api.Play.current

/**
 * Testing technology
 */

case class Technology(id: Option[Long] = None, name: String)

object Technology {

  /**
   * Parse a Company from a ResultSet
   */
  val simple = {
    get[Option[Long]]("technology.id") ~
      get[String]("technology.name") map {
      case id~name => Technology(id, name)
    }
  }

  /**
   * Construct the Map[String,String] needed to fill a select options set.
   */
  def options: Seq[(String,String)] = DB.withConnection { implicit connection =>
    SQL("select * from technology order by name").as(Technology.simple *).
      foldLeft[Seq[(String, String)]](Nil) { (cs, c) =>
      c.id.fold(cs) { id => cs :+ (id.toString -> c.name) }
    }
  }

}
