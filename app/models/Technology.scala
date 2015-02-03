package models

import org.squeryl.PrimitiveTypeMode._
import org.squeryl.dsl.ast.ExpressionNode
import org.squeryl.dsl.fsm.{Conditioned, WhereState}
import play.api.libs.json.{JsObject, Json, Writes}
import java.text.SimpleDateFormat
import scala.util.Try

/**
 * Testing technology
 */
case class Technology(id: Option[Long],
                      name: String,
                      description: Option[String]) extends Model(id)

object Technology extends BaseDAO[Technology] {

  def apply(): Technology = new Technology(None, "", None)
  def apply(id: Option[Long] = None) = new Technology(id, "", None)

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
      "name" -> o.name,
      "description" -> o.description,
      "updated" -> new SimpleDateFormat("yyyy.MM.dd HH:mm:ss").format(o.updated)
    )
  }

  // -- Queries

  /**
   * Returns tuple paginated & ordered list of programming technologies and total amount of records .
   *
   * @param page Current page number (starts from 0)
   * @param pageSize Current page number (starts from 0)
   * @param orderBy Column to be sorted
   * @param orderDir Order direction
   * @param filter Filter applied on language names
   */

  def page(page: Int, pageSize: Int = 10, orderBy: String, orderDir: Int, filter: String): Try[(Seq[Technology], Long)] = {

    val lFilter = "%" + filter.toLowerCase + "%"
    val offSet = (page - 1) * pageSize

    def getOrderBy(cmp: Technology): ExpressionNode = orderBy match {
      case "name" => if(orderDir == 0) cmp.name.desc else cmp.name.asc
      case "description" => if(orderDir == 0) cmp.description.desc else cmp.description.asc
      case _ => if(orderDir == 0) cmp.name.desc else cmp.name.asc
    }

    def readConditions(a: Technology): WhereState[Conditioned] = {
      where(a.deleted === false
        and a.name.toLowerCase.like(lFilter).inhibitWhen(lFilter == ""))
    }

    def list = {
      from(AppDB.technology)(a =>
        readConditions(a) select a
          orderBy getOrderBy(a)
      )
    }

    def total = {
      from(AppDB.technology)(a =>
        readConditions(a) compute countDistinct(a.id))
    }

    inTransaction(
      for {
        d <- Try(list.page(offSet, pageSize).toList)
        t <- Try(total.toLong)
      } yield (d, t)
    )
  }

}