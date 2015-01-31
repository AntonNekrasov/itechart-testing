package admin.technology


import models.Technology
import org.junit.runner.RunWith
import org.specs2.mutable.Specification
import org.specs2.runner.JUnitRunner
import play.api.test.FakeApplication
import play.api.test.Helpers._

/**
 * Checks database queries
 */
@RunWith(classOf[JUnitRunner])
class ModelSpec extends Specification {
  // --

  "Technology model" should {

    "be retrieved by id" in {
      running(FakeApplication(additionalConfiguration = inMemoryDatabase(name = "test"))) {

        val technology = Technology.getOne(3000l)

        technology must beSuccessfulTry

        technology.map(_.name must equalTo("Java core")).get

      }
    }

    "support pagination" in {
      running(FakeApplication(additionalConfiguration = inMemoryDatabase(name = "test"))) {

        val page = Technology.page(1, 10, "name", 0, "")

        page must beSuccessfulTry

        page.map(_._1.length must equalTo(10)).get

        page.map(_._2 must equalTo(15)).get

      }
    }
  }
}
