package admin.technology

import models.Technology
import org.junit.runner.RunWith
import org.specs2.mutable.Specification
import org.specs2.runner.JUnitRunner
import play.api.libs.json.{JsNumber, JsString}
import play.api.test.{FakeRequest, FakeApplication}
import play.api.test.Helpers._

import scala.util.parsing.json
import scala.util.parsing.json.JSONArray

/**
 * Checks Technology controller calls.
 */
@RunWith(classOf[JUnitRunner])
class TechnologyControllerSpec extends Specification {

  "TechnologyController" should {

    "return the paginated list technologies" in {
      running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {

        val listLength = 15
        val testName = "Test"
        val pageSize = 5
        val testDescription = "Test Description"

        val list = (1 to listLength) map { x =>
          val t = Technology(None, testName + x, Some(testDescription))
          Technology.add(t)
          t
        }

        val result = controllers.admin.TechnologyController.queryTech(1, pageSize, "id", 0, "")(FakeRequest())

        status(result) must equalTo(OK)
        contentAsJson(result) \ "status" mustEqual JsString("Success")
        contentAsJson(result) \ "data" \ "total" mustEqual JsNumber(listLength / pageSize)
        contentAsJson(result) \ "data" \ "list" must be JSONArray

//        result must \("list" -> JSONArray(list.take(10).toList))
//        contentType(error) must beSome("application/json")
//        status(error) must equalTo(INTERNAL_SERVER_ERROR)
//        contentAsJson(error) \ "status" mustEqual JsString("error")
//        contentAsJson(error) \ "message" mustEqual JsString("/ by zero")

      }
    }

//    "list computers on the the first page" in {
//      running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {
//
//        val result = controllers.Application.list(0, 2, "")(FakeRequest())
//
//        status(result) must equalTo(OK)
//        contentAsString(result) must contain("574 computers found")
//
//      }
//    }

  }

}
