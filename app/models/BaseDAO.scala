package models

import org.squeryl.KeyedEntity

/**
 * Defines basic CRUD operations
 */

trait BaseDAO {

  def page(page: Int, orderBy: Int, filter: String): Seq[_]

  def get(id: Long): Option[_]

  def add(obj: Model): Option[Long]

  def put(obj: Model): Unit

  def rem(id: Long): Unit

}

trait Model extends KeyedEntity[Option[Long]] {
  val deleted: Boolean = false
}