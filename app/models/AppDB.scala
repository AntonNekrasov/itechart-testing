package models

import org.squeryl.Schema

/**
 * Schema mapping
 */

object AppDB extends Schema {
  val technology = table[Technology]("technology")
}
