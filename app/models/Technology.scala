package models

import org.squeryl.PrimitiveTypeMode._

/**
 * Testing technology
 */

case class Technology(override val id: Option[Long], name: String) extends Model

object Technology extends BaseDAO {

  override def page(page: Int, orderBy: Int, filter: String): Seq[_] = inTransaction(
    //TODO: fix pagination, add filtering
    from(AppDB.technology)(a =>
      where(a.deleted === false) select a
    ).page(1, 10).toList
  )

  override def get(id: Long): Option[Model] = inTransaction(
    from(AppDB.technology)(a =>
      where(a.id === id) select a
    ).headOption
  )

  override def put(technology: Model): Unit = inTransaction(
    AppDB.technology.update(technology.asInstanceOf[Technology])
  )

  override def rem(id: Long): Unit = inTransaction(
    update(AppDB.technology) (a =>
      where(a.id === Some(id))
      set(a.deleted := true)
    )
  )

  override def add(technology: Model): Option[Long] = inTransaction(
    AppDB.technology.insert(technology.asInstanceOf[Technology])
  ).id
}

