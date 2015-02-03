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
class TechnologyModelSpec extends Specification {

  //  -- Crud
  val testName = "Test"
  val testDescription = "Test Description"

  "Technology model" should {

    "be support crud operations" in {
      running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {

        val newName = "Test123"
        val test = Technology(None, testName, Some(testDescription))

        // -- Create

        val _c = Technology.add(test)
        _c must beSuccessfulTry
        val id = _c.get.id.get

        // -- Read

        val _r = Technology.getOne(id)
        _r must beSuccessfulTry
        _r.map(_.name must equalTo(testName)).get

        // -- Update

        val _u = Technology.put(_r.get.copy(name = newName))
        _u must beSuccessfulTry

        // -- Delete

        val _d = Technology.rem(id)
        _d must beSuccessfulTry

      }
    }

    "support pagination" in {
      running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {

        val listLength = 15

        (1 to listLength) map { x =>
          val t = Technology(None, testName + x, Some(testDescription))
          Technology.add(t)
        }

        val page = Technology.page(1, 10, "id", 0, "")

        page must beSuccessfulTry
        page.map(_._1.length must equalTo(10)).get
        page.map(_._2 must equalTo(listLength)).get
      }
    }

  }
}
