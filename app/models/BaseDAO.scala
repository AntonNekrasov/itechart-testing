package models

import org.squeryl.KeyedEntity
import org.squeryl.PrimitiveTypeMode._
import scala.util.Try

/**
 * Defines basic CRUD operations
 */
trait BaseDAO[T<:Model] {

  /**
   * Returns the sample of particular entity. Used for defining schema table.
   *
   * @param id ID of the entity (optional) to be created
   */
  def createT(id: Long): T

  /**
   * Adds object to a database.
   *
   * @param obj the object to be stored
   */
  def add(obj: T): Try[T] = {
    def aux = {
      val tables = AppDB.findTablesFor(obj)
      tables.map(_.insert(obj))
    }
    inTransaction(Try(aux.head))
  }

  /**
   * Updates object in database.
   *
   * @param obj the object to be updated
   */
  def put(obj: T): Try[Unit] = {
    def aux = {
      val tables = AppDB.findTablesFor(obj)
      tables.map(_.update(obj))
    }
    inTransaction(Try(aux.head))
  }

  /**
   * Returns a single object.
   *
   * @param id ID of the object to be found
   */
  def getOne(id: Long): Try[T] = {
    def aux = {
      val table = AppDB.findTablesFor(createT(id)).head
      from(table)(a =>
        where(a.id === Some(id) and a.deleted === false) select a
      )
    }
    inTransaction(Try(aux.head))
  }

  /**
   * Removes the object by ID.
   *
   * @param id ID of the object to be removed
   */
  def rem(id: Long): Try[Int] = {
    def aux = {
      val table = AppDB.findTablesFor(createT(id)).head
      update(table) (a =>
        where(a.id === Some(id))
          set(a.deleted := true)
      )
    }
    inTransaction(Try(aux))
  }

}

/**
 * Base class for all the entities
 */
abstract class Model(id: Option[Long] = None) extends KeyedEntity[Option[Long]] {
  val deleted: Boolean = false
}