package admin.technology

import org.specs2.mutable._
import org.specs2.runner._
import org.junit.runner._
import play.api.i18n.Messages

import play.api.test._
import play.api.test.Helpers._

/**
 * Checks Technology views.
 */
@RunWith(classOf[JUnitRunner])
class TechnologyIntegrationSpec extends Specification {

  "Technology section" should {

    "work from within a browser" in {
      running(TestServer(3333), HTMLUNIT) { browser =>
        browser.goTo("http://localhost:3333/admin/technology")
        browser.$("#rp-header a[href='/admin]'").first.getAttribute("class") must contain("active")
        browser.$("#rp-admin-content > h1").first.getText must equalTo(Messages("admin.center.panel.technology.list"))
        //TODO: continue;
      }.pendingUntilFixed("... HtmlUnit chokes on modern jquery & d3")
    }

  }

}
