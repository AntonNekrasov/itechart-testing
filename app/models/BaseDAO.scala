package models

import org.squeryl.KeyedEntity
import org.squeryl.PrimitiveTypeMode._
import scala.util.Try

/**
 * Defines basic CRUD operations
 */
//TODO: add try monads
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
      inTransaction(
        tables.map(_.insert(obj))
      )
    }
    Try(aux.head)
  }

  /**
   * Updates object in database.
   *
   * @param obj the object to be updated
   */
  def put(obj: T): Try[Unit] = {
    def aux = {
      val tables = AppDB.findTablesFor(obj)
      inTransaction(
        tables.map(_.update(obj))
      )
    }
    Try(aux.head)
  }

  /**
   * Returns a single object.
   *
   * @param id ID of the object to be found
   */
  def getOne(id: Long): Option[T] = {
    val table = AppDB.findTablesFor(createT(id)).head
    inTransaction(
      from(table)(a =>
        where(a.id === Some(id) and a.deleted === false) select a
      ).headOption
    )
  }

  /**
   * Removes the object by ID.
   *
   * @param id ID of the object to be removed
   */
  def rem(id: Long): Unit = {
    val table = AppDB.findTablesFor(createT(id)).head
    inTransaction(
      update(table) (a =>
        where(a.id === Some(id))
          set(a.deleted := true)
      )
    )
  }
}

/**
 * Base class for all the entities
 */
abstract class Model(id: Option[Long] = None) extends KeyedEntity[Option[Long]] {
  val deleted: Boolean = false
}