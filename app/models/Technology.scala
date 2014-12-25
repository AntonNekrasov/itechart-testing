package models

import org.squeryl.PrimitiveTypeMode._

/**
 * Testing technology
 */

case class Technology(id: Option[Long], name: String) extends Model {
  def this() = this(None, "")
}

object Technology extends BaseDAO[Technology] {

  def apply(): Technology = this()

  def page(page: Int, orderBy: Int, filter: String): Seq[Technology] = inTransaction(
    //TODO: fix pagination, add filtering
    from(AppDB.technology)(a =>
      where(a.deleted === false) select a
    ).page(1, 10).toList
  )

  override def get(id: Long): Option[Technology] = inTransaction(
    from(AppDB.technology)(a =>
      where(a.id === id) select a
    ).headOption
  )

  override def rem(id: Long): Unit = inTransaction(
    update(AppDB.technology) (a =>
      where(a.id === Some(id))
      set(a.deleted := true)
    )
  )

}