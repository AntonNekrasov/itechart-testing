package models

import org.squeryl.PrimitiveTypeMode._
import org.squeryl.dsl.ast.ExpressionNode
import play.api.libs.json.{JsObject, Json, Writes}

/**
 * Testing technology
 */
case class Technology(id: Option[Long],
                      name: String) extends Model(id)

object Technology extends BaseDAO[Technology] {

  def apply(): Technology = new Technology(None, "")
  def apply(id: Option[Long]  = None) = new Technology(id, "")

  // -- Supplementary functions

  /**
   * Returns the sample of particular entity. Used for defining schema table.
   *
   * @param id ID of the entity (optional) to be created
   */
  override def createT(id: Long): Technology = Technology()

  /**
   * Implicitly converts the object of class Technology into Json object.
   */
  implicit val jsonWrites = new Writes[Technology] {
    override def writes(o: Technology): JsObject = Json.obj(
      "id" -> o.id.getOrElse("").toString,
      "name" -> o.name
    )
  }

  // -- Queries

  /**
   * Returns paginated & ordered list of programming technologies.
   *
   * @param page Current page number (starts from 0)
   * @param pageSize Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param orderDir Order direction
   * @param filter Filter applied on language names
   */
  def page(page: Int, pageSize: Int = 10, orderBy: String, orderDir: Int, filter: String): Seq[Technology] = {

    def getOrderBy(cmp: Technology): ExpressionNode = orderBy match {
      case "name" => if(orderDir == 0) cmp.name.desc else cmp.name.asc
      case _ => if(orderDir == 0) cmp.name.desc else cmp.name.asc
    }

    val lFilter = filter.toLowerCase
    val offSet = (page - 1) * pageSize

    inTransaction(
      from(AppDB.technology)(a =>
        where(a.deleted === false
          and a.name.toLowerCase.like(lFilter).inhibitWhen(lFilter == "")) select a
          orderBy getOrderBy(a)
      ).page(offSet, pageSize).toList
    )
  }

  /**
   * Returns the total amount of programming technologies.
   *
   * @param filter Filter applied on language names
   */
  def total(filter: String): Long = {
    val lFilter = filter.toLowerCase
    inTransaction(
      from(AppDB.technology)(a =>
        where(a.deleted === false and
          a.name.toLowerCase.like(lFilter).inhibitWhen(lFilter == ""))
          compute countDistinct(a.id)
      )
    )
  }
}