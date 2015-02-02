package admin.technology

import models.Technology
import org.junit.runner.RunWith
import org.specs2.mutable.Specification
import org.specs2.runner.JUnitRunner
import play.api.i18n.Messages
import play.api.libs.json.{JsNumber, JsString}
import play.api.test.{FakeRequest, FakeApplication}
import play.api.test.Helpers._

/**
 * Checks Technology controller calls.
 */
@RunWith(classOf[JUnitRunner])
class TechnologyControllerSpec extends Specification {

  val testName = "Test"
  val testDescription = "Test Description"

  "TechnologyController" should {

    "return the paginated list technologies" in {
      running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {

        val listLength = 15
        val pageSize = 5

        val list = (1 to listLength) map { x =>
          val t = Technology(None, x + testName, Some(testDescription))
          Technology.add(t)
          t
        }

        val result = controllers.admin.TechnologyController.queryTech(1, pageSize, "name", 1, "")(FakeRequest())

        status(result) must equalTo(OK)
        contentType(result) must beSome.which(_ == "application/json")
        contentAsJson(result) \ "status" mustEqual JsString("Success")
        contentAsJson(result) \ "data" \ "total" mustEqual JsNumber(listLength / pageSize)
        (contentAsJson(result) \ "data" \ "list")(0) \ "name" mustEqual JsString(list.sortBy(_.name).head.name)
      }
    }

  }

  "respond to the open edit screen Action" in {
    running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {
      val Some(error) = route(FakeRequest(GET, "/admin/technology/edit/" + 13))
      status(error) must equalTo(SEE_OTHER)

      Technology.add(Technology(Some(1L), testName, Some(testDescription)))

      val Some(success) = route(FakeRequest(GET, "/admin/technology/edit/" + 1))
      status(success) must equalTo(OK)
      contentType(success) must beSome("text/html")
      charset(success) must beSome("utf-8")
    }
  }

  "be able to update records" in {
    running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {

      Technology.add(Technology(Some(1L), testName, Some(testDescription)))

      val badResult = controllers.admin.TechnologyController.updateTech(1)(FakeRequest())

      status(badResult) must equalTo(BAD_REQUEST)

      val badData = controllers.admin.TechnologyController.updateTech(1)(
        FakeRequest().withFormUrlEncodedBody("id" -> "1", "name" -> "", "description" -> "badBadBad")
      )

      status(badData) must equalTo(BAD_REQUEST)
      contentAsString(badData) must contain("""<input type="hidden" name="id" value="1" />""")
      contentAsString(badData) must contain("""<input type="text" id="name" name="name" value="" />""")
      contentAsString(badData) must contain("""<textarea id="description" name="description" >badBadBad</textarea>""")

      val result = controllers.admin.TechnologyController.updateTech(1)(
        FakeRequest().withFormUrlEncodedBody("id" -> "1", "name" -> testName, "description" -> testDescription)
      )

      status(result) must equalTo(SEE_OTHER)
      redirectLocation(result) must beSome.which(_ == "/admin/technology")

      flash(result).get("success") must beSome.which(_ == Messages("success.updated.record"))

    }
  }

  "respond to the open create screen Action" in {
    running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {
      val Some(result) = route(FakeRequest(GET, "/admin/technology/create"))

      status(result) must equalTo(OK)
      contentType(result) must beSome("text/html")
      charset(result) must beSome("utf-8")
    }
  }

  "be able to create records" in {
    running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {

      val badResult = controllers.admin.TechnologyController.createTech(FakeRequest())

      status(badResult) must equalTo(BAD_REQUEST)

      val badData = controllers.admin.TechnologyController.createTech(
        FakeRequest().withFormUrlEncodedBody("name" -> "", "description" -> "badBadBad")
      )

      status(badData) must equalTo(BAD_REQUEST)
      contentAsString(badData) must contain("""<input type="text" id="name" name="name" value="" />""")
      contentAsString(badData) must contain("""<textarea id="description" name="description" >badBadBad</textarea>""")

      val result = controllers.admin.TechnologyController.createTech(
        FakeRequest().withFormUrlEncodedBody("name" -> testName, "description" -> testDescription)
      )

      status(result) must equalTo(SEE_OTHER)
      redirectLocation(result) must beSome.which(_ == "/admin/technology")
      flash(result).get("success") must beSome.which(_ == Messages("success.created.record"))
    }
  }

  "able to remove records" in {
    running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {

      Technology.add(Technology(Some(1L), testName, Some(testDescription)))

      val (_, length1) = Technology.page(1, 5, "id", 1, "").get
      length1 must equalTo(1)

      val result = controllers.admin.TechnologyController.removeTech(1L)(FakeRequest())
      status(result) must equalTo(OK)
      val (_, length2) = Technology.page(1, 5, "id", 1, "").get
      length2 must equalTo(0)

    }
  }

}