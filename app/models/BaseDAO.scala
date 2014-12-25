package models

import org.squeryl.KeyedEntity
import org.squeryl.PrimitiveTypeMode._
import scala.util.{Try,Success,Failure}

/**
 * Defines basic CRUD operations
 */

trait BaseDAO[T <: Model] {


  def add(obj: T): Try[T] = {
    def aux = {
      val tables = _tables(obj)
      inTransaction(
        tables.map(_.insert(obj))
      )
    }
    Try(aux.head)
  }

  def put(obj: T): Unit = {
    val tables = _tables(obj)
    inTransaction(
      tables.map(_.update(obj))
    )
  }

  def get(id: Long): Option[T]

  def rem(id: Long): Unit

  private def _tables(obj: T) = AppDB.findTablesFor(obj)

}

trait Model extends KeyedEntity[Option[Long]] {
  val deleted: Boolean = false
}

import scala.io.Source


object Test extends App {

  def readTextFile(filename: String): Try[List[String]] = {
    Try(Source.fromFile(filename).getLines.toList)
  }

  val filename = "/etc/passwd"
  readTextFile(filename) match {
    case Success(lines) => lines.foreach(println)
    case Failure(f) => println(f)
  }

}