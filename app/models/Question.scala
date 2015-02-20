package models

import java.text.SimpleDateFormat

import org.squeryl.PrimitiveTypeMode._
import org.squeryl.dsl.ast.ExpressionNode
import org.squeryl.dsl.fsm.{Conditioned, WhereState}
import play.api.libs.json.{Json, JsObject, Writes}

import scala.util.Try

/**
 * Question
 */
case class Question(id: Option[Long],
                    body: String) extends Model(id)

object Question extends BaseDAO[Question] {

  def apply(): Question = new Question(None, "")

  // -- Supplementary functions

  /**
   * Returns the sample of particular entity. Used for defining schema table.
   *
   * @param id ID of the entity (optional) to be created
   */
  override def createT(id: Long): Question = Question()

  /**
   * Implicitly converts the object of class Question into Json object.
   */
  implicit val jsonWrites = new Writes[Question] {
    override def writes(o: Question): JsObject = Json.obj(
      "id" -> o.id.getOrElse("").toString,
      "body" -> o.body,
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

  def page(page: Int, pageSize: Int = 10, orderBy: String, orderDir: Int, filter: String): Try[(Seq[Question], Long)] = {

    val lFilter = "%" + filter.toLowerCase + "%"
    val offSet = (page - 1) * pageSize

    def getOrderBy(cmp: Question): ExpressionNode = orderBy match {
      case "body" => if(orderDir == 0) cmp.body.desc else cmp.body.asc
//      case "description" => if(orderDir == 0) cmp.description.desc else cmp.description.asc
      case _ => if(orderDir == 0) cmp.body.desc else cmp.body.asc
    }

    def readConditions(a: Question): WhereState[Conditioned] = {
      where(a.deleted === false
        and a.body.toLowerCase.like(lFilter).inhibitWhen(lFilter == ""))
    }

    def list = {
      from(AppDB.question)(a =>
        readConditions(a) select a
          orderBy getOrderBy(a)
      )
    }

    def total = {
      from(AppDB.question)(a =>
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